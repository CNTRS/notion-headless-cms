import { describe, test, expect } from "vitest";
import { ImageTransform } from "../../domain/ImageTransform";
import { FakeImageFetcher } from "./FakeImageFetcher";

const VALID_JPEG = Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYI5Q4WnF0UkZSuCUmKPGQ0eH/xAAbAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUGB//EACsRAAICAgEDAgQHAQAAAAAAAAABAhEDIRIxQVEEYQUTcZEUIjKBofDx4f/aAAwDAQACEQMRAD8A3+uf6//Z",
    "base64",
);

describe("The FakeImageFetcher", () => {
    test("fetches image returning predefined buffer for any URL", async () => {
        const fetcher = new FakeImageFetcher(VALID_JPEG);

        const result = await fetcher.fetch("https://any.url/image.jpg");

        expect(Buffer.isBuffer(result)).toBe(true);
    });

    test("returns buffer decodable by ImageTransform", async () => {
        const fetcher = new FakeImageFetcher(VALID_JPEG);

        const buffer = await fetcher.fetch("https://any.url/image.jpg");
        const meta = ImageTransform.process(buffer);

        expect(meta.width).toBe(1);
        expect(meta.height).toBe(1);
        expect(meta.format).toBe("jpg");
        expect(meta.base64).toEqual(expect.any(String));
    });
});
