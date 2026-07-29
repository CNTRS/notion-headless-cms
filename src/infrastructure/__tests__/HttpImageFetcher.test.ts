import { describe, test, expect } from "vitest";
import { HttpImageFetcher } from "../HttpImageFetcher";
import type { IImageFetcher } from "../../ports";

describe("The HttpImageFetcher", () => {
    test("accepts no constructor arguments", () => {
        const fetcher = new HttpImageFetcher();

        expect(fetcher).toBeInstanceOf(HttpImageFetcher);
    });

    test("implements IImageFetcher", () => {
        const fetcher: IImageFetcher = new HttpImageFetcher();

        expect(fetcher).toBeDefined();
    });
});
