import type { IPageRepository } from "../../ports";
import type { StaticPage, PageBlock, PageId } from "../../domain";

interface SeedData {
    pages: StaticPage[];
    blocks: Map<string, PageBlock[]>;
}

export class FakePageRepository implements IPageRepository {
    private readonly pages: Map<string, StaticPage>;
    private readonly blocks: Map<string, PageBlock[]>;

    constructor(seed: SeedData) {
        this.pages = new Map(
            seed.pages.map(page => [page.id.toString(), page]),
        );
        this.blocks = new Map(seed.blocks);
    }

    async listPages(): Promise<StaticPage[]> {
        return Array.from(this.pages.values());
    }

    async getPage(id: PageId): Promise<StaticPage | null> {
        return this.pages.get(id.toString()) ?? null;
    }

    async getPageBlocks(id: PageId): Promise<PageBlock[]> {
        return this.blocks.get(id.toString()) ?? [];
    }
}
