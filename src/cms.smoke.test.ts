import "dotenv/config";
import { describe, test, expect } from "vitest";
import { createDefaultCMS } from "./main";

function getEnvOrThrow(): { token: string; db: string } {
    const token = process.env.NOTION_TOKEN;
    const db = process.env.NOTION_DB;
    if (!token || !db) {
        throw new Error("NOTION_TOKEN and NOTION_DB must be set in .env");
    }
    return { token, db };
}

describe.skip("The NotionCMS", () => {
    test("lists pages from the real Notion API", async () => {
        const { token, db } = getEnvOrThrow();
        const cms = createDefaultCMS(token, db);

        const pages = await cms.listPages();

        expect(Array.isArray(pages)).toBe(true);
    });

    test("retrieves a single page from the real Notion API", async () => {
        const { token, db } = getEnvOrThrow();
        const cms = createDefaultCMS(token, db);
        const pages = await cms.listPages();
        expect(pages.length).toBeGreaterThan(0);

        const page = await cms.getPage(pages[0].id);

        expect(page).not.toBeNull();
    });

    test("retrieves page content from the real Notion API", async () => {
        const { token, db } = getEnvOrThrow();
        const cms = createDefaultCMS(token, db);
        const pages = await cms.listPages();
        expect(pages.length).toBeGreaterThan(0);

        const content = await cms.getPageContent(pages[0].id);

        expect(Array.isArray(content)).toBe(true);
    });

    test("retrieves page with content processing from the real Notion API", async () => {
        const { token, db } = getEnvOrThrow();
        const cms = createDefaultCMS(token, db);
        const pages = await cms.listPages();
        expect(pages.length).toBeGreaterThan(0);

        const result = await cms.getPageWithContent(pages[0].id);

        expect(result.id.equals(pages[0].id)).toBe(true);
    });
});
