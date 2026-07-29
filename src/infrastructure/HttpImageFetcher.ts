import type { IImageFetcher } from "../ports";

export class HttpImageFetcher implements IImageFetcher {
    async fetch(_url: string): Promise<Buffer> {
        return Buffer.from("");
    }
}
