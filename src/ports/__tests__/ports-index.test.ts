import { describe, test, expect } from "vitest";
import type { IPageRepository, IImageFetcher } from "../index";

describe("The ports index", () => {
    test("exposes page repository contract", () => {
        const _repo: IPageRepository = {
            listPages: () => Promise.resolve([]),
            getPage: () => Promise.resolve(null),
            getPageBlocks: () => Promise.resolve([]),
        };
        expect(_repo).toBeDefined();
    });

    test("exposes image fetcher contract", () => {
        const _fetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        expect(_fetcher).toBeDefined();
    });
});
