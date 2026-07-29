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

        let blocks = await this.repository.getPageBlocks(id);

        blocks = await Promise.all(
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

        blocks = PageBlockTransformer.groupConsecutiveItems(blocks);

        return page.withContent(blocks);
    }
    async getAllPagesContent(): Promise<StaticPage[]> {
        const result: StaticPage[] = [];
        const pages = await this.listPages();

        for (const page of pages) {
            const pageContent = await this.getPageContent(page.id);
            result.push(page.withContent(pageContent));
        }
        return result;
    }
}
