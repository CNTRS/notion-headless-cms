import type { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { IPageRepository } from "../ports";
import { NotionDataSourceError } from "./errors";
import type { PageBlock } from "../domain";
import { StaticPage } from "../domain/StaticPage";
import { PageId } from "../domain/PageId";
import { Slug } from "../domain/Slug";
import { PageStatus } from "../domain/PageStatus";
import { Tag } from "../domain/Tag";
import { RichText } from "../domain/RichText";

interface NotionProperty {
    type: string;
    [key: string]: unknown;
}

function extractPlainText(richText: Array<{ plain_text?: string }>): string {
    if (!richText || richText.length === 0) return "";
    return richText.map(r => r.plain_text ?? "").join("");
}

function mapNotionPage(page: PageObjectResponse): StaticPage {
    const props = page.properties as Record<string, NotionProperty>;

    const id = page.id;
    const titleProp = Object.values(props).find(p => p.type === "title") as
        | {
              type: "title";
              title: Array<{ plain_text?: string }>;
          }
        | undefined;
    const title = titleProp ? extractPlainText(titleProp.title) : "";

    const slugProp = Object.values(props).find(p => p.type === "rich_text") as
        | {
              type: "rich_text";
              rich_text: Array<{ plain_text?: string }>;
          }
        | undefined;
    const slug = slugProp ? extractPlainText(slugProp.rich_text) : "";

    const statusProp = Object.values(props).find(p => p.type === "status") as
        | {
              type: "status";
              status: { name: string };
          }
        | undefined;
    const status = statusProp?.status?.name ?? "draft";

    const tagsProp = Object.values(props).find(
        p => p.type === "multi_select",
    ) as
        | {
              type: "multi_select";
              multi_select: Array<{ name: string }>;
          }
        | undefined;
    const tags = (tagsProp?.multi_select ?? []).map(t => Tag.create(t.name));

    const authorProp = Object.values(props).find(
        p => p.type === "created_by",
    ) as
        | {
              type: "created_by";
              created_by: { id: string };
          }
        | undefined;
    const author = authorProp?.created_by?.id ?? page.created_by?.id;

    const createdAtProp = Object.values(props).find(
        p => p.type === "created_time",
    ) as
        | {
              type: "created_time";
              created_time: string;
          }
        | undefined;
    const createdAt = createdAtProp?.created_time
        ? new Date(createdAtProp.created_time)
        : new Date(page.created_time);

    const updatedAtProp = Object.values(props).find(
        p => p.type === "last_edited_time",
    ) as
        | {
              type: "last_edited_time";
              last_edited_time: string;
          }
        | undefined;
    const updatedAt = updatedAtProp?.last_edited_time
        ? new Date(updatedAtProp.last_edited_time)
        : page.last_edited_time
          ? new Date(page.last_edited_time)
          : undefined;

    return StaticPage.create({
        id: PageId.create(id),
        slug: Slug.create(slug || "untitled"),
        status: PageStatus.create(status),
        title,
        tags,
        author,
        createdAt,
        updatedAt,
    });
}

type NotionBlock = {
    type: string;
    [key: string]: unknown;
};

function extractRichTextFromBlock(block: NotionBlock): Array<{
    content: string;
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
    href?: string;
}> {
    const blockData = block[block.type] as
        | { rich_text?: Array<Record<string, unknown>> }
        | undefined;
    if (!blockData?.rich_text) return [];
    return blockData.rich_text.map((rt: Record<string, unknown>) => {
        const annotations = (rt.annotations as Record<string, unknown>) || {};
        const text = (rt.text as Record<string, unknown>) || {};
        return {
            content:
                (rt.plain_text as string) ?? (text.content as string) ?? "",
            bold: !!annotations.bold,
            italic: !!annotations.italic,
            strikethrough: !!annotations.strikethrough,
            underline: !!annotations.underline,
            code: !!annotations.code,
            color: annotations.color as string | undefined,
            href: (rt.href as string | null | undefined) ?? undefined,
        };
    });
}

function mapNotionBlock(block: NotionBlock): PageBlock | null {
    const type = block.type;

    switch (type) {
        case "paragraph":
        case "text":
            return {
                type: "text",
                richText: extractRichTextFromBlock(block).map(RichText.create),
            };

        case "heading_1":
        case "heading_2":
        case "heading_3":
            return {
                type,
                richText: extractRichTextFromBlock(block).map(RichText.create),
            };

        case "image": {
            const imageData = block.image as
                | {
                      type?: string;
                      external?: { url: string };
                      file?: { url: string };
                  }
                | undefined;
            const url = imageData?.external?.url ?? imageData?.file?.url ?? "";
            return { type: "image", url };
        }

        case "bulleted_list_item":
            return {
                type: "bulleted_list_item",
                richText: extractRichTextFromBlock(block).map(RichText.create),
            };

        case "numbered_list_item":
            return {
                type: "numbered_list_item",
                richText: extractRichTextFromBlock(block).map(RichText.create),
            };

        case "callout": {
            const calloutData = block.callout as
                | { icon?: { type: string; emoji?: string } }
                | undefined;
            return {
                type: "callout",
                richText: extractRichTextFromBlock(block).map(RichText.create),
                icon: calloutData?.icon?.emoji,
            };
        }

        case "video": {
            const videoData = block.video as
                | { external?: { url: string }; file?: { url: string } }
                | undefined;
            const url = videoData?.external?.url ?? videoData?.file?.url ?? "";
            return { type: "video", url };
        }

        case "code": {
            const codeData = block.code as { language?: string } | undefined;
            return {
                type: "code",
                richText: extractRichTextFromBlock(block).map(RichText.create),
                language: codeData?.language,
            };
        }

        case "quote":
            return {
                type: "quote",
                richText: extractRichTextFromBlock(block).map(RichText.create),
            };

        case "divider":
            return { type: "divider" };

        default:
            return null;
    }
}

export class NotionPageRepository implements IPageRepository {
    private dataSourceId: string | null = null;

    constructor(
        private client: Client,
        private databaseId: string,
    ) {}

    private async resolveDataSourceId(): Promise<string> {
        if (this.dataSourceId !== null) return this.dataSourceId;

        const response = await this.client.databases.retrieve({
            database_id: this.databaseId,
        });
        if (
            !("data_sources" in response) ||
            response.data_sources.length === 0
        ) {
            throw new NotionDataSourceError(this.databaseId);
        }

        this.dataSourceId = response.data_sources[0].id;
        return this.dataSourceId;
    }

    async listPages(): Promise<StaticPage[]> {
        const dataSourceId = await this.resolveDataSourceId();
        const response = await this.client.dataSources.query({
            data_source_id: dataSourceId,
        });
        return response.results
            .filter(
                (r): r is PageObjectResponse =>
                    r.object === "page" && "properties" in r,
            )
            .map(mapNotionPage);
    }

    async getPage(id: PageId): Promise<StaticPage | null> {
        try {
            const response = await this.client.pages.retrieve({
                page_id: id.toString(),
            });
            if (!("properties" in response)) return null;
            return mapNotionPage(response as PageObjectResponse);
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "status" in err &&
                (err as { status: number }).status === 404
            ) {
                return null;
            }
            throw err;
        }
    }

    async getPageBlocks(id: PageId): Promise<PageBlock[]> {
        const blocks: PageBlock[] = [];
        let cursor: string | undefined;
        let hasMore = true;

        while (hasMore) {
            const response = await this.client.blocks.children.list({
                block_id: id.toString(),
                start_cursor: cursor,
            });
            for (const block of response.results) {
                if (block.object !== "block") continue;
                if (!("type" in block)) continue;
                const mapped = mapNotionBlock(block as NotionBlock);
                if (mapped) blocks.push(mapped);
            }
            hasMore = response.has_more;
            cursor = response.next_cursor ?? undefined;
        }

        return blocks;
    }
}
