import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { Client } from "@notionhq/client";
import { http, HttpResponse } from "msw";
import { server } from "../../test/msw/server";
import { NotionPageRepository } from "../NotionPageRepository";
import type { IPageRepository } from "../../ports";
import { PageId } from "../../domain/PageId";
import { Slug } from "../../domain/Slug";
import { PageStatus } from "../../domain/PageStatus";
import { Tag } from "../../domain/Tag";

import databasesQuery from "../../test/msw/fixtures/databases.query.json";
import databasesQueryEmpty from "../../test/msw/fixtures/databases.query.empty.json";
import pagesRetrieve from "../../test/msw/fixtures/pages.retrieve.json";
import blocksPaginated1 from "../../test/msw/fixtures/blocks.children.list.paginated.1.json";
import blocksPaginated2 from "../../test/msw/fixtures/blocks.children.list.paginated.2.json";

const NOTION_API = "https://api.notion.com";

function createClient(): Client {
    return new Client({ auth: "test-token" });
}

describe("The NotionPageRepository", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("accepts a Client and database ID via constructor", () => {
        const repo = new NotionPageRepository(createClient(), "test-db-id");

        expect(repo).toBeInstanceOf(NotionPageRepository);
    });

    test("implements IPageRepository", () => {
        const repo: IPageRepository = new NotionPageRepository(
            createClient(),
            "test-db-id",
        );

        expect(repo).toBeDefined();
    });

    test("listPages queries the database and maps results to StaticPage[]", async () => {
        server.use(
            http.post(`${NOTION_API}/v1/databases/:databaseId/query`, () => {
                return HttpResponse.json(databasesQuery);
            }),
        );
        const repo = new NotionPageRepository(
            createClient(),
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );

        const pages = await repo.listPages();

        expect(pages).toHaveLength(2);
        expect(pages[0].title).toBe("One more time");
        expect(
            pages[0].id.equals(
                PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba"),
            ),
        ).toBe(true);
        expect(pages[0].slug.equals(Slug.create("one-more-time"))).toBe(true);
        expect(pages[0].status.equals(PageStatus.create("published"))).toBe(
            true,
        );
        expect(pages[0].tags).toHaveLength(2);
        expect(pages[0].tags[0].equals(Tag.create("music"))).toBe(true);
        expect(pages[0].tags[1].equals(Tag.create("review"))).toBe(true);
    });

    test("listPages returns empty array when database is empty", async () => {
        server.use(
            http.post(`${NOTION_API}/v1/databases/:databaseId/query`, () => {
                return HttpResponse.json(databasesQueryEmpty);
            }),
        );
        const repo = new NotionPageRepository(
            createClient(),
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );

        const pages = await repo.listPages();

        expect(pages).toEqual([]);
    });

    test("getPage returns a mapped StaticPage for an existing page ID", async () => {
        server.use(
            http.get(`${NOTION_API}/v1/pages/:pageId`, () => {
                return HttpResponse.json(pagesRetrieve);
            }),
        );
        const repo = new NotionPageRepository(
            createClient(),
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );
        const pageId = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

        const page = await repo.getPage(pageId);

        expect(page).not.toBeNull();
        expect(page?.title).toBe("One more time");
    });

    test("getPage returns null when the page does not exist", async () => {
        server.use(
            http.get(`${NOTION_API}/v1/pages/:pageId`, () => {
                return new HttpResponse(null, { status: 404 });
            }),
        );
        const repo = new NotionPageRepository(
            createClient(),
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );
        const pageId = PageId.create("00000000-0000-0000-0000-000000000000");

        const page = await repo.getPage(pageId);

        expect(page).toBeNull();
    });

    test("getPageBlocks fetches blocks with pagination and maps to PageBlock[]", async () => {
        server.use(
            http.get(
                `${NOTION_API}/v1/blocks/:blockId/children`,
                ({ request }) => {
                    const url = new URL(request.url);
                    const cursor = url.searchParams.get("start_cursor");
                    if (cursor === "d2b5c3a4-6e7f-8a9b-0c1d-2e3f4a5b6c7d") {
                        return HttpResponse.json(blocksPaginated2);
                    }
                    return HttpResponse.json(blocksPaginated1);
                },
            ),
        );
        const repo = new NotionPageRepository(
            createClient(),
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );
        const pageId = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

        const blocks = await repo.getPageBlocks(pageId);

        expect(blocks).toHaveLength(5);
        expect(blocks[0].type).toBe("text");
        expect(blocks[3].type).toBe("text");
    });
});
