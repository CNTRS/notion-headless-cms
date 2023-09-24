import { test, expect } from "vitest";
import { transformBlockByType } from "./helpers";

import {
    PARAGRAPH_BLOCK,
    HEADING_1_BLOCK,
    IMAGE_EXTERNAL_URL_BLOCK,
    IMAGE_EXTERNAL_URL_BLOCK_RESULT,
} from "./helpers.mocks";

test("Transform Paragraph block:", async () => {
    expect(JSON.stringify(await transformBlockByType(PARAGRAPH_BLOCK))).toBe(
        JSON.stringify(PARAGRAPH_BLOCK),
    );
});

test("Transform Heading 1 block:", async () => {
    expect(JSON.stringify(await transformBlockByType(HEADING_1_BLOCK))).toBe(
        JSON.stringify(HEADING_1_BLOCK),
    );
});

test("Transform Image with external url", async () => {
    const result = await transformBlockByType(IMAGE_EXTERNAL_URL_BLOCK);

    expect(result.image.format).toBe(
        IMAGE_EXTERNAL_URL_BLOCK_RESULT.image.format,
    );
    expect(result.image.size.width).toBe(
        IMAGE_EXTERNAL_URL_BLOCK_RESULT.image.size.width,
    );
    expect(result.image.size.height).toBe(
        IMAGE_EXTERNAL_URL_BLOCK_RESULT.image.size.height,
    );
});

test("1+1 equals 2", () => {
    expect(1 + 1).toBe(2);
});
