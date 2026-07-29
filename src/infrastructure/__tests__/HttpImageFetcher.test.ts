import { describe, test, expect, vi, beforeEach } from "vitest";
import { HttpImageFetcher } from "../HttpImageFetcher";
import type { IImageFetcher } from "../../ports";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("The HttpImageFetcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("accepts no constructor arguments", () => {
        const fetcher = new HttpImageFetcher();

        expect(fetcher).toBeInstanceOf(HttpImageFetcher);
    });

    test("implements IImageFetcher", () => {
        const fetcher: IImageFetcher = new HttpImageFetcher();

        expect(fetcher).toBeDefined();
    });

    test("fetch returns a Buffer containing the image bytes", async () => {
        const imageBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            arrayBuffer: () => Promise.resolve(imageBytes.buffer),
        });
        const fetcher = new HttpImageFetcher();

        const result = await fetcher.fetch("https://example.com/image.png");

        expect(mockFetch).toHaveBeenCalledWith("https://example.com/image.png");
        expect(result).toBeInstanceOf(Buffer);
        expect(result).toEqual(Buffer.from(imageBytes));
    });

    test("fetch throws an error containing the URL and status code", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found",
        });
        const fetcher = new HttpImageFetcher();

        await expect(
            fetcher.fetch("https://example.com/missing.png"),
        ).rejects.toThrow(/404/);
    });
});
