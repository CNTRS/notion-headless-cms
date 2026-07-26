import { describe, test, expect } from "vitest";
import { StaticPage } from "../StaticPage";
import { PageId } from "../PageId";
import { Slug } from "../Slug";
import { PageStatus } from "../PageStatus";
import { Tag } from "../Tag";
import { InvalidStaticPageError } from "../errors";

describe("The StaticPage", () => {
    const pageId = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
    const slug = Slug.create("my-page");
    const status = PageStatus.create("draft");

    test("creates a page with minimum fields", () => {
        const page = StaticPage.create({
            id: pageId,
            slug,
            status,
            title: "My Page",
        });

        expect(page).toBeInstanceOf(StaticPage);
    });

    test("creates a page with all fields", () => {
        const tags = [Tag.create("news")];
        const createdAt = new Date("2025-01-01");
        const updatedAt = new Date("2025-06-01");

        const page = StaticPage.create({
            id: pageId,
            slug,
            status,
            title: "My Page",
            tags,
            author: "Alice",
            createdAt,
            updatedAt,
            content: [],
        });

        expect(page.title).toBe("My Page");
        expect(page.tags).toHaveLength(1);
        expect(page.author).toBe("Alice");
        expect(page.createdAt).toEqual(createdAt);
        expect(page.updatedAt).toEqual(updatedAt);
        expect(page.content).toEqual([]);
    });

    test("rejects creation when id is missing", () => {
        expect(() =>
            StaticPage.create({
                id: undefined as unknown as PageId,
                slug,
                status,
                title: "My Page",
            }),
        ).toThrow(InvalidStaticPageError);
    });

    test("rejects creation when slug is missing", () => {
        expect(() =>
            StaticPage.create({
                id: pageId,
                slug: undefined as unknown as Slug,
                status,
                title: "My Page",
            }),
        ).toThrow(InvalidStaticPageError);
    });

    test("rejects creation when status is missing", () => {
        expect(() =>
            StaticPage.create({
                id: pageId,
                slug,
                status: undefined as unknown as PageStatus,
                title: "My Page",
            }),
        ).toThrow(InvalidStaticPageError);
    });

    test("rejects creation when title is missing", () => {
        expect(() =>
            StaticPage.create({
                id: pageId,
                slug,
                status,
                title: "",
            }),
        ).toThrow(InvalidStaticPageError);
    });
});
