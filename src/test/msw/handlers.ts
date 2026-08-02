import { http, HttpResponse } from "msw";
import databasesRetrieve from "./fixtures/databases.retrieve.json";
import dataSourcesQuery from "./fixtures/dataSources.query.json";
import pagesRetrieve from "./fixtures/pages.retrieve.json";
import blocksChildrenList from "./fixtures/blocks.children.list.json";

const NOTION_API = "https://api.notion.com";

export const handlers = [
    http.get(`${NOTION_API}/v1/databases/:databaseId`, () => {
        return HttpResponse.json(databasesRetrieve);
    }),

    http.post(`${NOTION_API}/v1/data_sources/:dataSourceId/query`, () => {
        return HttpResponse.json(dataSourcesQuery);
    }),

    http.get(`${NOTION_API}/v1/pages/:pageId`, ({ params }) => {
        if (params.pageId === "00000000-0000-0000-0000-000000000000") {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(pagesRetrieve);
    }),

    http.get(`${NOTION_API}/v1/blocks/:blockId/children`, () => {
        return HttpResponse.json(blocksChildrenList);
    }),
];
