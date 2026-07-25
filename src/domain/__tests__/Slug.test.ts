import { describe, test, expect } from "vitest";
import { Slug } from "../Slug";
import { InvalidSlugError } from "../errors";

describe("The Slug", () => {
    test("accepts a valid slug", () => {
        const slug = Slug.create("my-article-title");
        expect(slug).toBeInstanceOf(Slug);
    });

    test("rejects an invalid slug with uppercase", () => {
        expect(() => Slug.create("My Article Title!")).toThrow(
            InvalidSlugError,
        );
    });

    test("rejects an empty string", () => {
        expect(() => Slug.create("")).toThrow(InvalidSlugError);
    });

    test("compares two equal slugs", () => {
        const a = Slug.create("hello-world");
        const b = Slug.create("hello-world");
        expect(a.equals(b)).toBe(true);
    });

    test("compares two different slugs", () => {
        const a = Slug.create("hello-world");
        const b = Slug.create("goodbye-world");
        expect(a.equals(b)).toBe(false);
    });

    test("converts to string", () => {
        const slug = Slug.create("my-slug");
        expect(slug.toString()).toBe("my-slug");
    });
});
