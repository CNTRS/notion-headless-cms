import { expect, test } from "vitest";
import { add, sub } from "./main";

test("adds 1 + 2 to equal 3", () => {
    expect(add(1, 2)).toBe(3);
});

test("sub 4 + 1 to equal 3", () => {
    expect(sub(4, 1)).toBe(3);
});
