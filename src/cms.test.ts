import { describe, test, expect } from "vitest";
import "dotenv/config";
import NotionCMS from "./cms";
import type { IPageRepository } from "./ports";
import type { IImageFetcher } from "./ports";
import { StaticPage, PageId, Slug, PageStatus } from "./domain";
import type { PageBlock, ImageBlock } from "./domain";

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
        expect((cms as unknown as Record<string, unknown>).repository).toBe(
            repository,
        );
        expect((cms as unknown as Record<string, unknown>).imageFetcher).toBe(
            imageFetcher,
        );
    });

    test("retrieves page from repository by id", async () => {
        const id = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
        const page = StaticPage.create({
            id,
            slug: Slug.create("test-page"),
            status: PageStatus.create("draft"),
            title: "Test Page",
        });
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id) ? page : null),
            getPageBlocks: () => Promise.resolve([]),
        };
        const imageFetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        const cms = new NotionCMS(repository, imageFetcher);

        const result = await cms.getPage(id);

        expect(result).toBeInstanceOf(StaticPage);
        expect(result?.id.equals(id)).toBe(true);
    });

    test("lists pages from repository", async () => {
        const page = StaticPage.create({
            id: PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba"),
            slug: Slug.create("test-page"),
            status: PageStatus.create("draft"),
            title: "Test Page",
        });
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([page]),
            getPage: () => Promise.resolve(null),
            getPageBlocks: () => Promise.resolve([]),
        };
        const imageFetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        const cms = new NotionCMS(repository, imageFetcher);

        const pages = await cms.listPages();

        expect(pages).toHaveLength(1);
        expect(pages[0]).toBeInstanceOf(StaticPage);
        expect(pages[0].id.equals(page.id)).toBe(true);
    });

    test("retrieves page content from repository by id", async () => {
        const id = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
        const blocks: PageBlock[] = [
            { type: "text", richText: [] },
            { type: "image", url: "https://example.com/img.png" },
        ];
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: () => Promise.resolve(null),
            getPageBlocks: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id) ? blocks : []),
        };
        const imageFetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        const cms = new NotionCMS(repository, imageFetcher);

        const result = await cms.getPageContent(id);

        expect(result).toEqual(blocks);
    });

    test("orchestrates all pages content with image processing and list grouping", async () => {
        const id1 = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
        const id2 = PageId.create("b1c2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6");
        const page1 = StaticPage.create({
            id: id1,
            slug: Slug.create("page-one"),
            status: PageStatus.create("draft"),
            title: "Page One",
        });
        const page2 = StaticPage.create({
            id: id2,
            slug: Slug.create("page-two"),
            status: PageStatus.create("published"),
            title: "Page Two",
        });
        const pngBuffer = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIW2P8z8BQz8BQz8BQz8BQzwAAjAMH+WHu5QAAAABJRU5ErkJggg==",
            "base64",
        );
        const blocks1: PageBlock[] = [
            { type: "text", richText: [] } as PageBlock,
            {
                type: "image",
                url: "https://example.com/img1.png",
            } as ImageBlock,
        ];
        const blocks2: PageBlock[] = [
            { type: "text", richText: [] } as PageBlock,
        ];
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([page1, page2]),
            getPage: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id1) ? page1 : page2),
            getPageBlocks: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id1) ? blocks1 : blocks2),
        };
        const imageFetcher: IImageFetcher = {
            fetch: (url: string) =>
                url === "https://example.com/img1.png"
                    ? Promise.resolve(pngBuffer)
                    : Promise.reject(new Error("unexpected URL")),
        };
        const cms = new NotionCMS(repository, imageFetcher);

        const result = await cms.getAllPagesContent();

        expect(result).toHaveLength(2);
        expect(result[0].id.equals(id1)).toBe(true);
        expect(result[0].content).toHaveLength(2);
        const imageBlock = result[0].content[1] as ImageBlock;
        expect(imageBlock.type).toBe("image");
        expect(imageBlock.base64).toBe(pngBuffer.toString("base64"));
        expect(imageBlock.width).toBe(2);
        expect(imageBlock.height).toBe(2);
        expect(imageBlock.format).toBe("png");
        expect(result[1].id.equals(id2)).toBe(true);
        expect(result[1].content).toHaveLength(1);
    });

    test("orchestrates page retrieval with image processing and list grouping", async () => {
        const id = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
        const page = StaticPage.create({
            id,
            slug: Slug.create("test-page"),
            status: PageStatus.create("draft"),
            title: "Test Page",
        });
        const pngBuffer = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIW2P8z8BQz8BQz8BQz8BQzwAAjAMH+WHu5QAAAABJRU5ErkJggg==",
            "base64",
        );
        const blocks: PageBlock[] = [
            { type: "text", richText: [] } as PageBlock,
            { type: "image", url: "https://example.com/img.png" } as ImageBlock,
        ];
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id) ? page : null),
            getPageBlocks: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id) ? blocks : []),
        };
        const imageFetcher: IImageFetcher = {
            fetch: (url: string) =>
                url === "https://example.com/img.png"
                    ? Promise.resolve(pngBuffer)
                    : Promise.reject(new Error("unexpected URL")),
        };
        const cms = new NotionCMS(repository, imageFetcher);

        const result = await cms.getPageWithContent(id);

        expect(result).toBeInstanceOf(StaticPage);
        expect(result.id.equals(id)).toBe(true);
        expect(result.content).toHaveLength(2);
        expect(result.content[0]).toEqual({ type: "text", richText: [] });
        const imageBlock = result.content[1] as ImageBlock;
        expect(imageBlock.type).toBe("image");
        expect(imageBlock.base64).toBe(pngBuffer.toString("base64"));
        expect(imageBlock.width).toBe(2);
        expect(imageBlock.height).toBe(2);
        expect(imageBlock.format).toBe("png");
    });

    test("retrieves page content with images processed and lists grouped", async () => {
        const id = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
        const page = StaticPage.create({
            id,
            slug: Slug.create("test-page"),
            status: PageStatus.create("draft"),
            title: "Test Page",
        });
        const pngBuffer = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIW2P8z8BQz8BQz8BQz8BQzwAAjAMH+WHu5QAAAABJRU5ErkJggg==",
            "base64",
        );
        const blocks: PageBlock[] = [
            { type: "text", richText: [] } as PageBlock,
            { type: "image", url: "https://example.com/img.png" } as ImageBlock,
            { type: "text", richText: [] } as PageBlock,
        ];
        const repository: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id) ? page : null),
            getPageBlocks: (pageId: PageId) =>
                Promise.resolve(pageId.equals(id) ? blocks : []),
        };
        const imageFetcher: IImageFetcher = {
            fetch: (url: string) =>
                url === "https://example.com/img.png"
                    ? Promise.resolve(pngBuffer)
                    : Promise.reject(new Error("unexpected URL")),
        };
        const cms = new NotionCMS(repository, imageFetcher);

        const result = await cms.getPageWithContent(id);

        expect(result.content).toHaveLength(3);
        expect(result.content[0]).toEqual({ type: "text", richText: [] });
        const imageBlock = result.content[1] as ImageBlock;
        expect(imageBlock.type).toBe("image");
        expect(imageBlock.base64).toBe(pngBuffer.toString("base64"));
        expect(imageBlock.width).toBe(2);
        expect(imageBlock.height).toBe(2);
        expect(imageBlock.format).toBe("png");
        expect(result.content[2]).toEqual({ type: "text", richText: [] });
    });
});
