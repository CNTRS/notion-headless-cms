import { describe, test, expect } from "vitest";
import {
    InvalidPageIdError,
    InvalidSlugError,
    InvalidPageStatusError,
    InvalidTagError,
} from "../errors";

describe("The domain errors", () => {
    describe("InvalidPageIdError", () => {
        test("creates with name and message", () => {
            const error = new InvalidPageIdError("bad id");

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe("InvalidPageIdError");
            expect(error.message).toBe("bad id");
        });
    });

    describe("InvalidSlugError", () => {
        test("creates with name and message", () => {
            const error = new InvalidSlugError("bad slug");

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe("InvalidSlugError");
            expect(error.message).toBe("bad slug");
        });
    });

    describe("InvalidPageStatusError", () => {
        test("creates with name and message", () => {
            const error = new InvalidPageStatusError("bad status");

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe("InvalidPageStatusError");
            expect(error.message).toBe("bad status");
        });
    });

    describe("InvalidTagError", () => {
        test("creates with name and message", () => {
            const error = new InvalidTagError("bad tag");

            expect(error).toBeInstanceOf(Error);
            expect(error.name).toBe("InvalidTagError");
            expect(error.message).toBe("bad tag");
        });
    });
});
