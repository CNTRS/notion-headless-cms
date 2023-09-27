import { Client } from "@notionhq/client";
import {
    PageObjectResponse,
    PartialPageObjectResponse,
    DatabaseObjectResponse,
    PartialDatabaseObjectResponse,
    BlockObjectResponse,
    PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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

type TNotionPage = (
    | PartialPageObjectResponse
    | PageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
) & {
    content?: Array<PartialBlockObjectResponse | BlockObjectResponse>;
};

type TNotionEntryId = string;

interface INotionCMS {
    listPages(): Promise<TNotionPage[]>;
    getPage(id: TNotionEntryId): Promise<TNotionPage>;
    getPageContent(
        id: TNotionEntryId,
    ): Promise<Array<PartialBlockObjectResponse | BlockObjectResponse>>;
    getAllPagesContent(): Promise<TNotionPage[]>;
}

export default class NotionCMS implements INotionCMS {
    private client: Client;
    private db: string;
    constructor(options: TNotionCMSOptions) {
        this.client = new Client({ auth: options.token });
        this.db = options.db;
    }
    async listPages(): Promise<Array<TNotionPage>> {
        const result = await this.client.databases.query({
            database_id: this.db,
        });
        return result.results;
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
