import { describe, test, expect } from "vitest";
import { Client } from "@notionhq/client";
import { NotionPageRepository } from "../NotionPageRepository";
import type { IPageRepository } from "../../ports";

describe("The NotionPageRepository", () => {
    test("accepts a Client and database ID via constructor", () => {
        const client = new Client({ auth: "test-token" });
        const repo = new NotionPageRepository(client, "test-db-id");

        expect(repo).toBeInstanceOf(NotionPageRepository);
    });

    test("implements IPageRepository", () => {
        const client = new Client({ auth: "test-token" });
        const repo: IPageRepository = new NotionPageRepository(
            client,
            "test-db-id",
        );

        expect(repo).toBeDefined();
    });
});
