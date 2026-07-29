import { ImageTransform, PageBlockTransformer, PageId } from "./domain";
import type { StaticPage, PageBlock, ImageBlock } from "./domain";
import type { IPageRepository } from "./ports";
import type { IImageFetcher } from "./ports";

function toPageId(id: PageId | string): PageId {
    return typeof id === "string" ? PageId.create(id) : id;
}

export default class NotionCMS {
    constructor(
        private readonly repository: IPageRepository,
        private readonly imageFetcher: IImageFetcher,
    ) {}
    async listPages(): Promise<StaticPage[]> {
        return this.repository.listPages();
    }
    async getPage(id: PageId | string): Promise<StaticPage | null> {
        return this.repository.getPage(toPageId(id));
    }
    async getPageContent(id: PageId | string): Promise<PageBlock[]> {
        return this.repository.getPageBlocks(toPageId(id));
    }
    async getPageWithContent(id: PageId | string): Promise<StaticPage> {
        const pageId = toPageId(id);
        const page = await this.repository.getPage(pageId);

        if (!page) {
            throw new Error(`Page not found: ${id}`);
        }

        const blocks = await this.repository.getPageBlocks(pageId);

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
