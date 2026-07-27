import { describe, test, expect } from "vitest";
import type { IImageFetcher } from "../IImageFetcher";

describe("The IImageFetcher port", () => {
    test("fetches image by URL", async () => {
        const fetcher: IImageFetcher = {
            fetch: () => Promise.resolve(Buffer.from("")),
        };
        const result = await fetcher.fetch("https://example.com/image.jpg");
        expect(Buffer.isBuffer(result)).toBe(true);
    });
});
