import { describe, test, expect } from "vitest";
import { PageId } from "../PageId";
import { InvalidPageIdError } from "../errors";

describe("PageId", () => {
    describe("create", () => {
        test("accepts a valid UUID", () => {
            const id = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

            expect(id).toBeInstanceOf(PageId);
        });

        test("rejects an invalid UUID", () => {
            expect(() => PageId.create("not-a-uuid")).toThrow(
                InvalidPageIdError,
            );
        });

        test("rejects an empty string", () => {
            expect(() => PageId.create("")).toThrow(InvalidPageIdError);
        });
    });

    describe("equals", () => {
        test("compares two equal PageIds", () => {
            const a = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
            const b = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

            expect(a.equals(b)).toBe(true);
        });

        test("compares two different PageIds", () => {
            const a = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");
            const b = PageId.create("7c0c0c0c-0c0c-0c0c-0c0c-0c0c0c0c0c0c");

            expect(a.equals(b)).toBe(false);
        });
    });

    describe("toString", () => {
        test("converts to string", () => {
            const id = PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba");

            expect(id.toString()).toBe("ad9bcf91-3a83-4504-91ba-e2503d90caba");
        });
    });
});
