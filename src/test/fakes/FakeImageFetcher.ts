import type { IImageFetcher } from "../../ports";

export class FakeImageFetcher implements IImageFetcher {
    private readonly buffer: Buffer;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    async fetch(_url: string): Promise<Buffer> {
        return this.buffer;
    }
}
