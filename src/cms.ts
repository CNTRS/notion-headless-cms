import type { PageId, StaticPage, PageBlock } from "./domain";
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
    async getPageWithContent(id: string): Promise<any> {
        const pageResult = await this.getPage(id);
        const contentResult = await this.getPageContent(id);

        return {
            ...pageResult,
            content: contentResult,
        };
    }
    async getAllPagesContent(): Promise<TNotionPage[]> {
        const result = [];
        const pages = await this.listPages();

        for (const page of pages) {
            const pageContent = await this.getPageContent(page.id);
            result.push({
                ...page,
                content: pageContent,
            });
        }
        return result;
    }
}
