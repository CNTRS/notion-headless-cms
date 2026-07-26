import { describe, test, expect } from "vitest";
import type { PageBlock } from "../blocks";

describe("The PageBlock", () => {
    test("discriminates text block by type", () => {
        const block: PageBlock = { type: "text", richText: [] };
        expect(block.type).toBe("text");
    });

    test("discriminates heading block by type", () => {
        const block: PageBlock = { type: "heading_1", richText: [] };
        expect(block.type).toBe("heading_1");
    });

    test("discriminates image block by type", () => {
        const block: PageBlock = {
            type: "image",
            url: "https://example.com/img.png",
        };
        expect(block.type).toBe("image");
    });

    test("discriminates callout block by type", () => {
        const block: PageBlock = { type: "callout", richText: [] };
        expect(block.type).toBe("callout");
    });

    test("discriminates divider block by type", () => {
        const block: PageBlock = { type: "divider" };
        expect(block.type).toBe("divider");
    });

    test("narrows heading to subtype", () => {
        const blocks: PageBlock[] = [
            { type: "heading_1", richText: [] },
            { type: "heading_2", richText: [] },
            { type: "heading_3", richText: [] },
        ];
        for (const block of blocks) {
            if (block.type === "heading_1") {
                expect(block.richText).toEqual([]);
            }
        }
    });

    test("discriminates video block by type", () => {
        const block: PageBlock = {
            type: "video",
            url: "https://example.com/video.mp4",
        };
        expect(block.type).toBe("video");
    });

    test("discriminates code block by type", () => {
        const block: PageBlock = { type: "code", richText: [] };
        expect(block.type).toBe("code");
    });

    test("discriminates quote block by type", () => {
        const block: PageBlock = { type: "quote", richText: [] };
        expect(block.type).toBe("quote");
    });

    test("discriminates bulleted list block by type", () => {
        const block: PageBlock = { type: "bulleted_list", items: [] };
        expect(block.type).toBe("bulleted_list");
    });

    test("discriminates numbered list block by type", () => {
        const block: PageBlock = { type: "numbered_list", items: [] };
        expect(block.type).toBe("numbered_list");
    });
});
