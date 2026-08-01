import { describe, test, expect } from "vitest";
import { Tag } from "../Tag";
import { InvalidTagError } from "../errors";

describe("Tag", () => {
    describe("create", () => {
        test("accepts a valid tag", () => {
            const tag = Tag.create("off topic");

            expect(tag).toBeInstanceOf(Tag);
        });

        test("rejects an empty string", () => {
            expect(() => Tag.create("")).toThrow(InvalidTagError);
        });

        test("rejects whitespace-only string", () => {
            expect(() => Tag.create("   ")).toThrow(InvalidTagError);
        });

        test("trims whitespace from tag value", () => {
            const tag = Tag.create("  hello  ");

            expect(tag.toString()).toBe("hello");
        });
    });

    describe("equals", () => {
        test("compares two equal tags", () => {
            const a = Tag.create("javascript");
            const b = Tag.create("javascript");

            expect(a.equals(b)).toBe(true);
        });

        test("compares two different tags", () => {
            const a = Tag.create("javascript");
            const b = Tag.create("typescript");

            expect(a.equals(b)).toBe(false);
        });
    });

    describe("toString", () => {
        test("converts to string", () => {
            const tag = Tag.create("off topic");

            expect(tag.toString()).toBe("off topic");
        });
    });
});
