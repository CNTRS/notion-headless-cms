import { Client } from "@notionhq/client";
import { NotionPageRepository, HttpImageFetcher } from "./infrastructure";
import NotionCMS from "./cms";

export default NotionCMS;

export function createDefaultCMS(token: string, db: string): NotionCMS {
    const client = new Client({ auth: token });
    const repository = new NotionPageRepository(client, db);
    const imageFetcher = new HttpImageFetcher();
    return new NotionCMS(repository, imageFetcher);
}
