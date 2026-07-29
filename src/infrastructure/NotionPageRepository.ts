import type { Client } from "@notionhq/client";
import type { IPageRepository } from "../ports";
import type { StaticPage, PageId, PageBlock } from "../domain";

export class NotionPageRepository implements IPageRepository {
    // biome-ignore lint/correctness/noUnusedPrivateClassMembers: stub — will be used in 1.2
    private client: Client;
    // biome-ignore lint/correctness/noUnusedPrivateClassMembers: stub — will be used in 1.2
    private databaseId: string;

    constructor(client: Client, databaseId: string) {
        this.client = client;
        this.databaseId = databaseId;
        void this.client;
        void this.databaseId;
    }

    async listPages(): Promise<StaticPage[]> {
        return [];
    }

    async getPage(_id: PageId): Promise<StaticPage | null> {
        return null;
    }

    async getPageBlocks(_id: PageId): Promise<PageBlock[]> {
        return [];
    }
}
