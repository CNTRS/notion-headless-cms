import type { StaticPage, PageId, PageBlock } from "../domain";

export interface IPageRepository {
    listPages(): Promise<StaticPage[]>;
    getPage(id: PageId): Promise<StaticPage | null>;
    getPageBlocks(id: PageId): Promise<PageBlock[]>;
}
