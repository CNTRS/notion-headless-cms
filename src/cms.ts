import type { PageId, StaticPage, PageBlock, ImageBlock } from "./domain";
import { ImageTransform, PageBlockTransformer } from "./domain";
import type { IPageRepository } from "./ports";
import type { IImageFetcher } from "./ports";

export default class NotionCMS {
    constructor(
        private readonly repository: IPageRepository,
        private readonly imageFetcher: IImageFetcher,
    ) {}
    async listPages(): Promise<StaticPage[]> {
        return this.repository.listPages();
    }
    async getPage(id: PageId): Promise<StaticPage | null> {
        return this.repository.getPage(id);
    }
    async getPageContent(id: PageId): Promise<PageBlock[]> {
        return this.repository.getPageBlocks(id);
    }
    async getPageWithContent(id: PageId): Promise<StaticPage> {
        const page = await this.repository.getPage(id);

        if (!page) {
            throw new Error(`Page not found: ${id}`);
        }

        const blocks = await this.repository.getPageBlocks(id);

        return page.withContent(await this.processBlocks(blocks));
    }
    private async processBlocks(blocks: PageBlock[]): Promise<PageBlock[]> {
        const processed = await Promise.all(
            blocks.map(async block => {
                if (block.type !== "image") return block;

                const imageBlock = block as ImageBlock;
                const buffer = await this.imageFetcher.fetch(imageBlock.url);
                const meta = ImageTransform.process(buffer);

                return {
                    ...imageBlock,
                    base64: meta.base64,
                    width: meta.width,
                    height: meta.height,
                    format: meta.format,
                } as ImageBlock;
            }),
        );

        return PageBlockTransformer.groupConsecutiveItems(processed);
    }
    async getAllPagesContent(): Promise<StaticPage[]> {
        const pages = await this.listPages();

        return Promise.all(pages.map(page => this.getPageWithContent(page.id)));
    }
}
