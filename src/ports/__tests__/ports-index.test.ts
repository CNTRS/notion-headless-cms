import { describe, test, expect } from "vitest";
import type { IPageRepository, IImageFetcher } from "../index";

describe("The ports index", () => {
    test("re-exports IPageRepository type", () => {
        const _repo: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: () => Promise.resolve(null),
            getPageBlocks: () => Promise.resolve([]),
        };
        expect(_repo).toBeDefined();
    });

    test("re-exports IImageFetcher type", () => {
        const _fetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        expect(_fetcher).toBeDefined();
    });
});
