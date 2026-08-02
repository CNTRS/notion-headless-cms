import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "../server";

describe("The MSW server", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("intercepts HTTP requests to api.notion.com", async () => {
        const response = await fetch(
            "https://api.notion.com/v1/data_sources/test/query",
            { method: "POST" },
        );
        expect(response.status).toBe(200);
    });

    test("reports the data sources that back a database", async () => {
        const response = await fetch(
            "https://api.notion.com/v1/databases/test",
        );

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.data_sources).toHaveLength(1);
    });
});
