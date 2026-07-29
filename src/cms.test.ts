import { describe, test, expect } from "vitest";
import "dotenv/config";
import NotionCMS from "./cms";
import type { IPageRepository } from "./ports";
import type { IImageFetcher } from "./ports";
import { PAGE_ID, PAGE_METADATA_AND_CONTENT } from "./helpers.mocks";

describe("The NotionCMS", () => {
    test("accepts repository and image fetcher", () => {
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: () => Promise.resolve(null),
            getPageBlocks: () => Promise.resolve([]),
        };
        const imageFetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        const cms = new NotionCMS(repository, imageFetcher);
        expect(cms).toBeInstanceOf(NotionCMS);
        expect((cms as Record<string, unknown>).repository).toBe(repository);
        expect((cms as Record<string, unknown>).imageFetcher).toBe(imageFetcher);
    });
});

test("Get Page metadata", async () => {
    const dbId = String(process.env.NOTION_DB);
    const accessToken = String(process.env.NOTION_TOKEN);

    const client = new NotionCMS({ token: accessToken, db: dbId });

    const result = await client.getPage(PAGE_ID);

    expect(result?.id).toBe(PAGE_ID);
});

test("Get Page content", async () => {
    const dbId = String(process.env.NOTION_DB);
    const accessToken = String(process.env.NOTION_TOKEN);

    const client = new NotionCMS({ token: accessToken, db: dbId });

    const result = await client.getPageContent(PAGE_ID);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(PAGE_METADATA_AND_CONTENT.content.length);
});

test("Get Page metadata with content", async () => {
    const dbId = String(process.env.NOTION_DB);
    const accessToken = String(process.env.NOTION_TOKEN);

    const client = new NotionCMS({ token: accessToken, db: dbId });

    const result = await client.getPageWithContent(PAGE_ID);

    expect(result.id).toBe(PAGE_ID);
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBe(
        PAGE_METADATA_AND_CONTENT.content.length,
    );
});
