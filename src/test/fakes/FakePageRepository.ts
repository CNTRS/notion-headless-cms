import type { IPageRepository } from "../../ports";
import type { StaticPage, PageBlock, PageId } from "../../domain";

interface SeedData {
    pages: StaticPage[];
    blocks: Map<PageId, PageBlock[]>;
}

export class FakePageRepository implements IPageRepository {
    private readonly pages: Map<PageId, StaticPage>;
    private readonly blocks: Map<PageId, PageBlock[]>;

    constructor(seed: SeedData) {
        this.pages = new Map(seed.pages.map(page => [page.id, page]));
        this.blocks = new Map(seed.blocks);
    }

    async listPages(): Promise<StaticPage[]> {
        return Array.from(this.pages.values());
    }

    async getPage(id: PageId): Promise<StaticPage | null> {
        return this.find(this.pages, id) ?? null;
    }

    async getPageBlocks(id: PageId): Promise<PageBlock[]> {
        return this.find(this.blocks, id) ?? [];
    }

    private find<T>(map: Map<PageId, T>, id: PageId): T | undefined {
        for (const [key, value] of map) {
            if (key.equals(id)) return value;
        }
        return undefined;
    }
}
