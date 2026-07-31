import { describe, test, expect } from "vitest";
import { StaticPage, PageId, Slug, PageStatus } from "../../domain";
import type { PageBlock } from "../../domain";
import { FakePageRepository } from "./FakePageRepository";

const PAGE_ID = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
const MISSING_ID = PageId.create("b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6");

function createPage(
    overrides?: Partial<{
        id: PageId;
        slug: Slug;
        status: PageStatus;
        title: string;
    }>,
): StaticPage {
    return StaticPage.create({
        id: overrides?.id ?? PAGE_ID,
        slug: overrides?.slug ?? Slug.create("test-page"),
        status: overrides?.status ?? PageStatus.create("draft"),
        title: overrides?.title ?? "Test Page",
    });
}

describe("The FakePageRepository", () => {
    test("lists seeded pages", async () => {
        const secondId = PageId.create("c2d3e4f5-a6b7-8c9d-0e1f-a2b3c4d5e6f7");
        const page1 = createPage();
        const page2 = createPage({
            id: secondId,
            slug: Slug.create("second-page"),
            title: "Second Page",
        });
        const repository = new FakePageRepository({
            pages: [page1, page2],
            blocks: new Map(),
        });

        const result = await repository.listPages();

        expect(result).toHaveLength(2);
    });

    test("accepts existing page id and returns the page", async () => {
        const page = createPage();
        const repository = new FakePageRepository({
            pages: [page],
            blocks: new Map(),
        });

        const result = await repository.getPage(PAGE_ID);

        expect(result).not.toBeNull();
        expect(result?.id.equals(PAGE_ID)).toBe(true);
    });

    test("accepts missing page id and returns null", async () => {
        const page = createPage();
        const repository = new FakePageRepository({
            pages: [page],
            blocks: new Map(),
        });

        const result = await repository.getPage(MISSING_ID);

        expect(result).toBeNull();
    });

    test("accepts existing page id and returns its blocks", async () => {
        const blocks: PageBlock[] = [
            { type: "text", richText: [] },
            { type: "divider" },
        ];
        const repository = new FakePageRepository({
            pages: [createPage()],
            blocks: new Map([[PAGE_ID, blocks]]),
        });

        const result = await repository.getPageBlocks(PAGE_ID);

        expect(result).toEqual(blocks);
    });

    test("accepts missing page id and returns empty blocks", async () => {
        const repository = new FakePageRepository({
            pages: [createPage()],
            blocks: new Map(),
        });

        const result = await repository.getPageBlocks(MISSING_ID);

        expect(result).toEqual([]);
    });
});
