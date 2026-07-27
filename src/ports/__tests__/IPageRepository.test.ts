import { describe, test, expect } from "vitest";
import type { IPageRepository } from "../IPageRepository";

describe("The IPageRepository port", () => {
    test("lists all pages", async () => {
        const repo: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: () => Promise.resolve(null),
            getPageBlocks: () => Promise.resolve([]),
        };
        const pages = await repo.listPages();
        expect(pages).toEqual([]);
    });
});
