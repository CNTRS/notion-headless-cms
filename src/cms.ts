import { Client } from "@notionhq/client";

type TNotionCMSOptions = {
    token: string;
    db: string;
    timestamp?: TTimestampPropertyConfig;
    slug?: TSlugPropertyConfig;
    status?: TStatusPropertyConfig;
};

type TTimestampPropertyConfig = {
    key: string;
    alowedValues: string[];
};

type TSlugPropertyConfig = {
    key: string;
};

type TStatusPropertyConfig = {
    key: string;
};

type TNotionDbEntry = {
    id: string;
};

type TNotionEntryId = string;

interface INotionCMS {
    listPages(): Promise<TNotionDbEntry[]>;
    getPage(id: TNotionEntryId): Promise<TNotionDbEntry>;
    getPageContent(id: TNotionEntryId): Promise<any>;
    getAllPagesContent(): Promise<TNotionDbEntry[]>;
}

export default class NotionCMS implements INotionCMS {
    private client: Client;
    private db: string;
    constructor(options: TNotionCMSOptions) {
        this.client = new Client({ auth: options.token });
        this.db = options.db;
    }
    async listPages(): Promise<TNotionDbEntry[]> {
        const result = await this.client.databases.query({
            database_id: this.db,
        });
        return result.results;
    }
    async getPage(id: string): Promise<TNotionDbEntry> {
        const result = await this.client.pages.retrieve({ page_id: id });
        return result;
    }
    async getPageContent(id: string): Promise<any> {
        const result = await this.client.blocks.children.list({ block_id: id });
        return result;
    }
    async getPageWithContent(id: string): Promise<any> {
        const pageResult = await this.getPage(id);
        const contentResult = await this.getPageContent(id);

        return {
            ...pageResult,
            content: contentResult,
        };
    }
    async getAllPagesContent(): Promise<TNotionDbEntry[]> {
        return [];
    }
}
