import type { IImageFetcher } from "../ports";

export class HttpImageFetcher implements IImageFetcher {
    async fetch(url: string): Promise<Buffer> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch image from ${url}: ${response.status}`,
            );
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}
