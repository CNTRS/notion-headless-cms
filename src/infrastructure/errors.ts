export class NotionDataSourceError extends Error {
    constructor(databaseId: string) {
        super(
            `Database "${databaseId}" returned no data sources to query against`,
        );
        this.name = "NotionDataSourceError";
    }
}
