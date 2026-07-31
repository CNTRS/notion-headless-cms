import { describe, test, expect } from "vitest";
import { PageStatus } from "../PageStatus";
import { InvalidPageStatusError } from "../errors";

describe("The PageStatus", () => {
    describe("create", () => {
        test("accepts 'draft'", () => {
            const status = PageStatus.create("draft");

            expect(status).toBeInstanceOf(PageStatus);
        });

        test("accepts 'published'", () => {
            const status = PageStatus.create("published");

            expect(status).toBeInstanceOf(PageStatus);
        });

        test("accepts 'archived'", () => {
            const status = PageStatus.create("archived");

            expect(status).toBeInstanceOf(PageStatus);
        });

        test("rejects an invalid status", () => {
            expect(() => PageStatus.create("deleted")).toThrow(
                InvalidPageStatusError,
            );
        });

        test("rejects an empty string", () => {
            expect(() => PageStatus.create("")).toThrow(InvalidPageStatusError);
        });
    });

    describe("equals", () => {
        test("compares two equal statuses", () => {
            const a = PageStatus.create("draft");
            const b = PageStatus.create("draft");

            expect(a.equals(b)).toBe(true);
        });

        test("compares two different statuses", () => {
            const a = PageStatus.create("draft");
            const b = PageStatus.create("published");

            expect(a.equals(b)).toBe(false);
        });
    });

    describe("toString", () => {
        test("converts to string", () => {
            const status = PageStatus.create("published");

            expect(status.toString()).toBe("published");
        });
    });
});
