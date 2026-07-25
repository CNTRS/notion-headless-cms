import { describe, test, expect } from "vitest";
import {
    InvalidPageIdError,
    InvalidSlugError,
    InvalidPageStatusError,
    InvalidTagError,
} from "../errors";

describe("The domain errors", () => {
    test("creates InvalidPageIdError with name and message", () => {
        const error = new InvalidPageIdError("bad id");
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("InvalidPageIdError");
        expect(error.message).toBe("bad id");
    });

    test("creates InvalidSlugError with name and message", () => {
        const error = new InvalidSlugError("bad slug");
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("InvalidSlugError");
        expect(error.message).toBe("bad slug");
    });

    test("creates InvalidPageStatusError with name and message", () => {
        const error = new InvalidPageStatusError("bad status");
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("InvalidPageStatusError");
        expect(error.message).toBe("bad status");
    });

    test("creates InvalidTagError with name and message", () => {
        const error = new InvalidTagError("bad tag");
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("InvalidTagError");
        expect(error.message).toBe("bad tag");
    });
});
