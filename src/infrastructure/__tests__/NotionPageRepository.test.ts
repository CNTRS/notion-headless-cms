import { describe, test, expect, vi } from "vitest";
import { NotionPageRepository } from "../NotionPageRepository";
import type { IPageRepository } from "../../ports";
import { PageId } from "../../domain/PageId";
import { Slug } from "../../domain/Slug";
import { PageStatus } from "../../domain/PageStatus";
import { Tag } from "../../domain/Tag";

class NotFoundError extends Error {
    status: number;
    constructor() {
        super("Not found");
        this.status = 404;
    }
}

function mockClient() {
    return {
        databases: {
            query: vi.fn().mockResolvedValue({
                object: "list",
                results: [
                    {
                        object: "page",
                        id: "ad9bcf91-3a83-4504-91ba-e2503d90caba",
                        created_time: "2023-06-26T14:05:00.000Z",
                        last_edited_time: "2023-09-23T15:43:00.000Z",
                        created_by: {
                            object: "user",
                            id: "cb4decf1-fcbd-45bf-99aa-81d265a1aec7",
                        },
                        properties: {
                            title: {
                                id: "title",
                                type: "title",
                                title: [
                                    {
                                        type: "text",
                                        text: {
                                            content: "One more time",
                                            link: null,
                                        },
                                        plain_text: "One more time",
                                    },
                                ],
                            },
                            slug: {
                                id: "eaX",
                                type: "rich_text",
                                rich_text: [
                                    {
                                        type: "text",
                                        text: {
                                            content: "one-more-time",
                                            link: null,
                                        },
                                        plain_text: "one-more-time",
                                    },
                                ],
                            },
                            status: {
                                id: "EhOD",
                                type: "status",
                                status: {
                                    id: "Co",
                                    name: "published",
                                    color: "green",
                                },
                            },
                            Tags: {
                                id: "jNg",
                                type: "multi_select",
                                multi_select: [
                                    {
                                        id: "a58d",
                                        name: "music",
                                        color: "orange",
                                    },
                                    {
                                        id: "b68e",
                                        name: "review",
                                        color: "blue",
                                    },
                                ],
                            },
                            author: {
                                id: "NOtQ",
                                type: "created_by",
                                created_by: {
                                    object: "user",
                                    id: "cb4decf1-fcbd-45bf-99aa-81d265a1aec7",
                                },
                            },
                            created: {
                                id: "Txnn",
                                type: "created_time",
                                created_time: "2023-06-26T14:05:00.000Z",
                            },
                            updated: {
                                id: "kfC",
                                type: "last_edited_time",
                                last_edited_time: "2023-09-23T15:43:00.000Z",
                            },
                        },
                    },
                ],
                next_cursor: null,
                has_more: false,
            }),
        },
        pages: {
            retrieve: vi.fn().mockResolvedValue({
                object: "page",
                id: "ad9bcf91-3a83-4504-91ba-e2503d90caba",
                created_time: "2023-06-26T14:05:00.000Z",
                last_edited_time: "2023-09-23T15:43:00.000Z",
                created_by: {
                    object: "user",
                    id: "cb4decf1-fcbd-45bf-99aa-81d265a1aec7",
                },
                properties: {
                    title: {
                        id: "title",
                        type: "title",
                        title: [
                            {
                                type: "text",
                                text: { content: "One more time", link: null },
                                plain_text: "One more time",
                            },
                        ],
                    },
                    slug: {
                        id: "eaX",
                        type: "rich_text",
                        rich_text: [
                            {
                                type: "text",
                                text: { content: "one-more-time", link: null },
                                plain_text: "one-more-time",
                            },
                        ],
                    },
                    status: {
                        id: "EhOD",
                        type: "status",
                        status: { id: "Co", name: "published", color: "green" },
                    },
                    Tags: {
                        id: "jNg",
                        type: "multi_select",
                        multi_select: [
                            { id: "a58d", name: "music", color: "orange" },
                            { id: "b68e", name: "review", color: "blue" },
                        ],
                    },
                    author: {
                        id: "NOtQ",
                        type: "created_by",
                        created_by: {
                            object: "user",
                            id: "cb4decf1-fcbd-45bf-99aa-81d265a1aec7",
                        },
                    },
                    created: {
                        id: "Txnn",
                        type: "created_time",
                        created_time: "2023-06-26T14:05:00.000Z",
                    },
                    updated: {
                        id: "kfC",
                        type: "last_edited_time",
                        last_edited_time: "2023-09-23T15:43:00.000Z",
                    },
                },
            }),
        },
    };
}

describe("The NotionPageRepository", () => {
    test("accepts a Client and database ID via constructor", () => {
        const repo = new NotionPageRepository({} as never, "test-db-id");

        expect(repo).toBeInstanceOf(NotionPageRepository);
    });

    test("implements IPageRepository", () => {
        const repo: IPageRepository = new NotionPageRepository(
            {} as never,
            "test-db-id",
        );

        expect(repo).toBeDefined();
    });

    test("listPages queries the database and maps results to StaticPage[]", async () => {
        const client = mockClient();
        const repo = new NotionPageRepository(
            client as never,
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );

        const pages = await repo.listPages();

        expect(client.databases.query).toHaveBeenCalledWith({
            database_id: "7431d3ba-b390-4418-ae50-e68277a29263",
        });
        expect(pages).toHaveLength(1);
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

    test("getPage returns a mapped StaticPage for an existing page ID", async () => {
        const client = mockClient();
        const repo = new NotionPageRepository(
            client as never,
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );
        const pageId = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

        const page = await repo.getPage(pageId);

        expect(client.pages.retrieve).toHaveBeenCalledWith({
            page_id: "ad9bcf91-3a83-4504-91ba-e2503d90caba",
        });
        expect(page).not.toBeNull();
        expect(page?.title).toBe("One more time");
    });

    test("getPage returns null when the page does not exist", async () => {
        const client = mockClient();
        client.pages.retrieve = vi.fn().mockRejectedValue(new NotFoundError());
        const repo = new NotionPageRepository(
            client as never,
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );
        const pageId = PageId.create("00000000-0000-0000-0000-000000000000");

        const page = await repo.getPage(pageId);

        expect(page).toBeNull();
    });

    test("getPageBlocks fetches blocks with pagination and maps to PageBlock[]", async () => {
        const client = mockClient() as Record<string, unknown>;
        const blocksList = vi
            .fn()
            .mockResolvedValueOnce({
                object: "list",
                type: "block",
                results: [
                    {
                        object: "block",
                        id: "c1000001-0000-4000-8000-000000000001",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: { content: "First page", link: null },
                                    plain_text: "First page",
                                },
                            ],
                            color: "default",
                        },
                    },
                ],
                next_cursor: "cursor-2",
                has_more: true,
            })
            .mockResolvedValueOnce({
                object: "list",
                type: "block",
                results: [
                    {
                        object: "block",
                        id: "c2000001-0000-4000-8000-000000000001",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: "Second page",
                                        link: null,
                                    },
                                    plain_text: "Second page",
                                },
                            ],
                            color: "default",
                        },
                    },
                ],
                next_cursor: null,
                has_more: false,
            });
        (client as Record<string, unknown>).blocks = {
            children: { list: blocksList },
        };
        const repo = new NotionPageRepository(
            client as never,
            "7431d3ba-b390-4418-ae50-e68277a29263",
        );
        const pageId = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

        const blocks = await repo.getPageBlocks(pageId);

        expect(blocksList).toHaveBeenCalledTimes(2);
        expect(blocksList).toHaveBeenNthCalledWith(1, {
            block_id: "ad9bcf91-3a83-4504-91ba-e2503d90caba",
        });
        expect(blocksList).toHaveBeenNthCalledWith(2, {
            block_id: "ad9bcf91-3a83-4504-91ba-e2503d90caba",
            start_cursor: "cursor-2",
        });
        expect(blocks).toHaveLength(2);
        expect(blocks[0].type).toBe("text");
        expect(blocks[1].type).toBe("text");
    });
});
