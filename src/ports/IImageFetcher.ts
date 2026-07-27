export interface IImageFetcher {
    fetch(url: string): Promise<Buffer>;
}
