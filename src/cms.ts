import type { StaticPage } from "./domain";
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
    async getPage(id: string): Promise<TNotionPage> {
        return await this.client.pages.retrieve({ page_id: id });
    }
    async getPageContent(
        id: TNotionEntryId,
    ): Promise<Array<PartialBlockObjectResponse | BlockObjectResponse>> {
        let has_more = true,
            start_cursor: undefined | string;

        const content = [];

        while (has_more) {
            const result = await this.client.blocks.children.list({
                block_id: id,
                start_cursor: start_cursor,
            });
            content.push(...result.results);
            has_more = result.has_more;
            if (has_more && result.next_cursor != null) {
                start_cursor = result.next_cursor;
            }
        }
        return content;
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
