import { describe, test, expect } from "vitest";
import { RichText } from "../RichText";
import { InvalidRichTextError } from "../errors";

describe("RichText", () => {
    describe("create", () => {
        test("rejects empty content", () => {
            expect(() => RichText.create({ content: "" })).toThrow(
                InvalidRichTextError,
            );
        });

        test("rejects whitespace-only content", () => {
            expect(() => RichText.create({ content: "   " })).toThrow(
                InvalidRichTextError,
            );
        });

        test("creates plain rich text", () => {
            const rt = RichText.create({ content: "Hello" });

            expect(rt.content).toBe("Hello");
            expect(rt.bold).toBe(false);
            expect(rt.italic).toBe(false);
            expect(rt.strikethrough).toBe(false);
            expect(rt.underline).toBe(false);
            expect(rt.code).toBe(false);
        });

        test("creates rich text with formatting", () => {
            const rt = RichText.create({
                content: "Bold and italic",
                bold: true,
                italic: true,
            });

            expect(rt.bold).toBe(true);
            expect(rt.italic).toBe(true);
            expect(rt.strikethrough).toBe(false);
        });

        test("creates rich text with all formatting", () => {
            const rt = RichText.create({
                content: "All formatted",
                bold: true,
                italic: true,
                strikethrough: true,
                underline: true,
                code: true,
            });

            expect(rt.bold).toBe(true);
            expect(rt.italic).toBe(true);
            expect(rt.strikethrough).toBe(true);
            expect(rt.underline).toBe(true);
            expect(rt.code).toBe(true);
        });

        test("creates rich text with href", () => {
            const rt = RichText.create({
                content: "Link",
                href: "https://example.com",
            });

            expect(rt.href).toBe("https://example.com");
        });

        test("creates rich text with color", () => {
            const rt = RichText.create({
                content: "Red text",
                color: "red",
            });

            expect(rt.color).toBe("red");
        });

        test("preserves original content without trimming", () => {
            const rt = RichText.create({ content: "  spaced  " });

            expect(rt.content).toBe("  spaced  ");
        });
    });

    describe("equals", () => {
        test("compares two equal rich texts", () => {
            const a = RichText.create({
                content: "Hello",
                bold: true,
                color: "red",
            });
            const b = RichText.create({
                content: "Hello",
                bold: true,
                color: "red",
            });

            expect(a.equals(b)).toBe(true);
        });

        test("compares two different rich texts", () => {
            const a = RichText.create({ content: "Hello" });
            const b = RichText.create({ content: "World" });

            expect(a.equals(b)).toBe(false);
        });

        test("compares rich texts with different formatting", () => {
            const a = RichText.create({ content: "Hello", bold: true });
            const b = RichText.create({ content: "Hello", bold: false });

            expect(a.equals(b)).toBe(false);
        });
    });
});
