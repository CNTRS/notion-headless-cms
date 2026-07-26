import { describe, test, expect } from "vitest";
import type { PageBlock, ListItem } from "../blocks";
import { RichText } from "../RichText";

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

    test("exhaustively narrows on type", () => {
        function describeBlock(block: PageBlock): string {
            switch (block.type) {
                case "text":
                    return "paragraph";
                case "heading_1":
                case "heading_2":
                case "heading_3":
                    return "heading";
                case "image":
                    return "image";
                case "callout":
                    return "callout";
                case "bulleted_list":
                    return "bulleted list";
                case "numbered_list":
                    return "numbered list";
                case "bulleted_list_item":
                    return "bulleted list item";
                case "numbered_list_item":
                    return "numbered list item";
                case "video":
                    return "video";
                case "code":
                    return "code";
                case "quote":
                    return "quote";
                case "divider":
                    return "divider";
            }
        }

        const text: PageBlock = { type: "text", richText: [] };
        const heading: PageBlock = { type: "heading_1", richText: [] };
        const image: PageBlock = {
            type: "image",
            url: "https://example.com/img.png",
        };
        const callout: PageBlock = { type: "callout", richText: [] };
        const bulleted: PageBlock = { type: "bulleted_list", items: [] };
        const numbered: PageBlock = { type: "numbered_list", items: [] };
        const bulletedItem: PageBlock = {
            type: "bulleted_list_item",
            richText: [],
        };
        const numberedItem: PageBlock = {
            type: "numbered_list_item",
            richText: [],
        };
        const video: PageBlock = {
            type: "video",
            url: "https://example.com/v.mp4",
        };
        const code: PageBlock = { type: "code", richText: [] };
        const quote: PageBlock = { type: "quote", richText: [] };
        const divider: PageBlock = { type: "divider" };

        expect(describeBlock(text)).toBe("paragraph");
        expect(describeBlock(heading)).toBe("heading");
        expect(describeBlock(image)).toBe("image");
        expect(describeBlock(callout)).toBe("callout");
        expect(describeBlock(bulleted)).toBe("bulleted list");
        expect(describeBlock(numbered)).toBe("numbered list");
        expect(describeBlock(bulletedItem)).toBe("bulleted list item");
        expect(describeBlock(numberedItem)).toBe("numbered list item");
        expect(describeBlock(video)).toBe("video");
        expect(describeBlock(code)).toBe("code");
        expect(describeBlock(quote)).toBe("quote");
        expect(describeBlock(divider)).toBe("divider");
    });

    test("accepts rich text content", () => {
        const richText = RichText.create({ content: "Hello world" });
        const block: PageBlock = { type: "text", richText: [richText] };
        expect(block.richText).toHaveLength(1);
        expect(block.richText[0].content).toBe("Hello world");
    });

    test("accepts heading level two", () => {
        const block: PageBlock = { type: "heading_2", richText: [] };
        expect(block.type).toBe("heading_2");
    });

    test("accepts heading level three", () => {
        const block: PageBlock = { type: "heading_3", richText: [] };
        expect(block.type).toBe("heading_3");
    });

    test("accepts optional alt text", () => {
        const block: PageBlock = {
            type: "image",
            url: "https://example.com/photo.png",
            alt: "A photo",
        };
        expect(block.alt).toBe("A photo");
    });

    test("accepts icon", () => {
        const block: PageBlock = {
            type: "callout",
            richText: [RichText.create({ content: "Note" })],
            icon: "💡",
        };
        expect(block.icon).toBe("💡");
    });

    test("groups list items", () => {
        const items: ListItem[] = [
            { richText: [RichText.create({ content: "Item 1" })] },
            { richText: [RichText.create({ content: "Item 2" })] },
        ];
        const bulleted: PageBlock = { type: "bulleted_list", items };
        expect(bulleted.items).toHaveLength(2);
        expect(bulleted.items[0].richText[0].content).toBe("Item 1");
    });

    test("accepts code block with language", () => {
        const block: PageBlock = {
            type: "code",
            richText: [RichText.create({ content: "const x = 1;" })],
            language: "typescript",
        };
        expect(block.language).toBe("typescript");
    });

    test("accepts quote block", () => {
        const block: PageBlock = {
            type: "quote",
            richText: [RichText.create({ content: "A wise quote" })],
        };
        expect(block.richText[0].content).toBe("A wise quote");
    });

    test("discriminates bulleted list item by type", () => {
        const block: PageBlock = {
            type: "bulleted_list_item",
            richText: [],
        };
        expect(block.type).toBe("bulleted_list_item");
    });

    test("discriminates numbered list item by type", () => {
        const block: PageBlock = {
            type: "numbered_list_item",
            richText: [],
        };
        expect(block.type).toBe("numbered_list_item");
    });

    test("accepts video url", () => {
        const block: PageBlock = {
            type: "video",
            url: "https://example.com/video.mp4",
        };
        expect(block.url).toBe("https://example.com/video.mp4");
    });

    test("accepts divider without content", () => {
        const block: PageBlock = { type: "divider" };
        expect(block.type).toBe("divider");
    });
});
