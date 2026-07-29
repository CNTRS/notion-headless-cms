import { describe, test, expect } from "vitest";
import NotionCMS from "./main";

describe("The main composition root", () => {
    test("exports NotionCMS class as default export", () => {
        expect(NotionCMS).toBeDefined();
        expect(typeof NotionCMS).toBe("function");
    });

    test("provides a factory that creates a configured NotionCMS instance", async () => {
        const { createDefaultCMS } = await import("./main");
        const cms = createDefaultCMS("test-token", "test-db");
        expect(cms).toBeInstanceOf(NotionCMS);
    });
});
