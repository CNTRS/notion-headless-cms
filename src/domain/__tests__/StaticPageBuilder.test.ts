import { describe, test, expect } from "vitest";
import { StaticPageBuilder } from "./builders/StaticPageBuilder";
import { StaticPage } from "../StaticPage";

describe("StaticPageBuilder", () => {
    describe("build", () => {
        test("builds a page with an overridden title", () => {
            const page = new StaticPageBuilder().withTitle("Custom").build();

            expect(page.title).toBe("Custom");
        });

        test("builds a valid page when no overrides provided", () => {
            const page = new StaticPageBuilder().build();

            expect(page).toBeInstanceOf(StaticPage);
            expect(page.title).toBeTruthy();
            expect(page.content).toEqual([]);
        });

        test("creates pages with distinct identities per builder call", () => {
            const a = new StaticPageBuilder().withTitle("A").build();
            const b = new StaticPageBuilder().withTitle("B").build();

            expect(a.equals(b)).toBe(false);
        });
    });

    describe("withDefaultContent", () => {
        test("builds a page with representative content blocks", () => {
            const page = new StaticPageBuilder().withDefaultContent().build();

            expect(page.content.length).toBeGreaterThan(0);
            expect(page.content.some(block => block.type === "heading_1")).toBe(
                true,
            );
            expect(page.content.some(block => block.type === "text")).toBe(
                true,
            );
        });

        test("still respects explicit content overrides", () => {
            const page = new StaticPageBuilder()
                .withDefaultContent()
                .withContent([{ type: "divider" }])
                .build();

            expect(page.content).toEqual([{ type: "divider" }]);
        });
    });

    describe("with-field methods", () => {
        test("applies all builder overrides to the built page", () => {
            const page = new StaticPageBuilder()
                .withSlug("my-slug")
                .withTitle("My Title")
                .withStatus("published")
                .withAuthor("Alice")
                .build();

            expect(page.title).toBe("My Title");
            expect(page.author).toBe("Alice");
        });
    });
});
