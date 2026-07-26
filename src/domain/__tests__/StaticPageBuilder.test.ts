import { describe, test, expect } from "vitest";
import { StaticPageBuilder } from "./builders/StaticPageBuilder";
import { StaticPage } from "../StaticPage";

describe("The StaticPageBuilder", () => {
    test("builds a page with minimum overrides", () => {
        const page = new StaticPageBuilder().withTitle("Custom").build();

        expect(page.title).toBe("Custom");
    });

    test("builds a valid page when no overrides provided", () => {
        const page = new StaticPageBuilder().build();

        expect(page).toBeInstanceOf(StaticPage);
        expect(page.title).toBeTruthy();
        expect(page.content).toEqual([]);
    });

    test("chains every with-field method", () => {
        const page = new StaticPageBuilder()
            .withSlug("my-slug")
            .withTitle("My Title")
            .withStatus("published")
            .withAuthor("Alice")
            .build();

        expect(page.title).toBe("My Title");
        expect(page.author).toBe("Alice");
    });

    test("creates pages with distinct identities per builder call", () => {
        const a = new StaticPageBuilder().withTitle("A").build();
        const b = new StaticPageBuilder().withTitle("B").build();

        expect(a.equals(b)).toBe(false);
    });
});
