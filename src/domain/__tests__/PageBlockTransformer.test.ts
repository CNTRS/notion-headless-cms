import { describe, test, expect } from "vitest";
import { PageBlockTransformer } from "../PageBlockTransformer";
import { RichText } from "../RichText";
import type { PageBlock } from "../blocks";

describe("The PageBlockTransformer", () => {
    test("groups consecutive bulleted items into a single BulletedList", () => {
        const richTextA = RichText.create({ content: "A" });
        const richTextB = RichText.create({ content: "B" });

        const result = PageBlockTransformer.groupConsecutiveItems([
            { type: "text", richText: [] },
            { type: "bulleted_list_item", richText: [richTextA] },
            { type: "bulleted_list_item", richText: [richTextB] },
            { type: "text", richText: [] } as PageBlock,
        ]);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({ type: "text", richText: [] });
        expect(result[1]).toEqual({
            type: "bulleted_list",
            items: [{ richText: [richTextA] }, { richText: [richTextB] }],
        });
        expect(result[2]).toEqual({ type: "text", richText: [] });
    });

    test("groups consecutive numbered items into a single NumberedList", () => {
        const richTextA = RichText.create({ content: "A" });
        const richTextB = RichText.create({ content: "B" });

        const result = PageBlockTransformer.groupConsecutiveItems([
            { type: "numbered_list_item", richText: [richTextA] },
            { type: "numbered_list_item", richText: [richTextB] },
        ]);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: "numbered_list",
            items: [{ richText: [richTextA] }, { richText: [richTextB] }],
        });
    });

    test("preserves non-consecutive list items as separate groups", () => {
        const richTextA = RichText.create({ content: "A" });
        const richTextB = RichText.create({ content: "B" });

        const result = PageBlockTransformer.groupConsecutiveItems([
            { type: "bulleted_list_item", richText: [richTextA] },
            { type: "text", richText: [] },
            { type: "bulleted_list_item", richText: [richTextB] } as PageBlock,
        ]);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
            type: "bulleted_list",
            items: [{ richText: [richTextA] }],
        });
        expect(result[1]).toEqual({ type: "text", richText: [] });
        expect(result[2]).toEqual({
            type: "bulleted_list",
            items: [{ richText: [richTextB] }],
        });
    });

    test("passes non-list blocks through unchanged", () => {
        const richText = RichText.create({ content: "Hello" });

        const input: PageBlock[] = [
            { type: "heading_1", richText: [richText] },
            { type: "text", richText: [richText] },
            { type: "callout", richText: [richText], icon: "💡" },
            { type: "divider" },
            {
                type: "image",
                url: "https://example.com/img.png",
            },
        ];

        const result = PageBlockTransformer.groupConsecutiveItems(input);

        expect(result).toEqual(input);
    });

    test("handles bulleted and numbered lists separately without merging", () => {
        const richTextA = RichText.create({ content: "A" });
        const richTextB = RichText.create({ content: "B" });
        const richTextC = RichText.create({ content: "C" });

        const result = PageBlockTransformer.groupConsecutiveItems([
            { type: "bulleted_list_item", richText: [richTextA] },
            { type: "numbered_list_item", richText: [richTextB] },
            { type: "numbered_list_item", richText: [richTextC] },
        ]);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            type: "bulleted_list",
            items: [{ richText: [richTextA] }],
        });
        expect(result[1]).toEqual({
            type: "numbered_list",
            items: [{ richText: [richTextB] }, { richText: [richTextC] }],
        });
    });

    test("is idempotent — applying twice produces the same result", () => {
        const richTextA = RichText.create({ content: "A" });
        const richTextB = RichText.create({ content: "B" });
        const richTextC = RichText.create({ content: "C" });

        const input: PageBlock[] = [
            { type: "bulleted_list_item", richText: [richTextA] },
            { type: "bulleted_list_item", richText: [richTextB] },
            { type: "text", richText: [] },
            { type: "numbered_list_item", richText: [richTextC] } as PageBlock,
        ];

        const once = PageBlockTransformer.groupConsecutiveItems(input);
        const twice = PageBlockTransformer.groupConsecutiveItems(once);

        expect(twice).toEqual(once);
    });

    test("returns empty array given empty input", () => {
        const result = PageBlockTransformer.groupConsecutiveItems([]);
        expect(result).toEqual([]);
    });
});
