import type { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { IPageRepository } from "../ports";
import type { PageBlock } from "../domain";
import { StaticPage } from "../domain/StaticPage";
import { PageId } from "../domain/PageId";
import { Slug } from "../domain/Slug";
import { PageStatus } from "../domain/PageStatus";
import { Tag } from "../domain/Tag";

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

export class NotionPageRepository implements IPageRepository {
    constructor(
        private client: Client,
        private databaseId: string,
    ) {}

    async listPages(): Promise<StaticPage[]> {
        const response = await this.client.databases.query({
            database_id: this.databaseId,
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

    async getPageBlocks(_id: PageId): Promise<PageBlock[]> {
        return [];
    }
}
