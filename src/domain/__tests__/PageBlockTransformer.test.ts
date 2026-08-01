import fc from "fast-check";
import { describe, test, expect } from "vitest";
import { PageBlockTransformer } from "../PageBlockTransformer";
import { RichText } from "../RichText";
import type { PageBlock } from "../blocks";

describe("PageBlockTransformer", () => {
    describe("groupConsecutiveItems", () => {
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
                {
                    type: "bulleted_list_item",
                    richText: [richTextB],
                } as PageBlock,
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
                {
                    type: "numbered_list_item",
                    richText: [richTextC],
                } as PageBlock,
            ];

            const once = PageBlockTransformer.groupConsecutiveItems(input);
            const twice = PageBlockTransformer.groupConsecutiveItems(once);

            expect(twice).toEqual(once);
        });

        test("ignores empty input", () => {
            const result = PageBlockTransformer.groupConsecutiveItems([]);

            expect(result).toEqual([]);
        });
    });

    describe("groupConsecutiveItems property tests", () => {
        const richTextArbitrary = fc
            .string({ minLength: 1 })
            .filter(content => content.trim().length > 0)
            .map(content => RichText.create({ content }));

        const blockArbitrary: fc.Arbitrary<PageBlock> = fc.oneof(
            fc.record({
                type: fc.constant("text"),
                richText: fc.array(richTextArbitrary),
            }),
            fc.record({
                type: fc.constant("heading_1"),
                richText: fc.array(richTextArbitrary),
            }),
            fc.record({
                type: fc.constant("bulleted_list_item"),
                richText: fc.array(richTextArbitrary),
            }),
            fc.record({
                type: fc.constant("numbered_list_item"),
                richText: fc.array(richTextArbitrary),
            }),
            fc.record({
                type: fc.constant("callout"),
                richText: fc.array(richTextArbitrary),
                icon: fc.string(),
            }),
            fc.record({ type: fc.constant("image"), url: fc.string() }),
            fc.record({ type: fc.constant("video"), url: fc.string() }),
        );

        test("remains idempotent for every generated block array", () => {
            fc.assert(
                fc.property(fc.array(blockArbitrary), blocks => {
                    const once =
                        PageBlockTransformer.groupConsecutiveItems(blocks);
                    const twice =
                        PageBlockTransformer.groupConsecutiveItems(once);

                    expect(twice).toEqual(once);
                }),
                { numRuns: 100 },
            );
        });

        test("leaves no orphaned consecutive list items in any generated block array", () => {
            fc.assert(
                fc.property(fc.array(blockArbitrary), blocks => {
                    const result =
                        PageBlockTransformer.groupConsecutiveItems(blocks);

                    for (let i = 0; i < result.length - 1; i++) {
                        const current = result[i];
                        const next = result[i + 1];

                        const bothBulleted =
                            current.type === "bulleted_list_item" &&
                            next.type === "bulleted_list_item";
                        const bothNumbered =
                            current.type === "numbered_list_item" &&
                            next.type === "numbered_list_item";

                        expect(bothBulleted || bothNumbered).toBe(false);
                    }
                }),
                { numRuns: 100 },
            );
        });
    });
});
