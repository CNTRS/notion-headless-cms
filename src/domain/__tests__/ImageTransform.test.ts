import { describe, test, expect } from "vitest";
import { ImageTransform } from "../ImageTransform";

describe("The ImageTransform", () => {
    const pngBuffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIW2P8z8BQz8BQz8BQz8BQzwAAjAMH+WHu5QAAAABJRU5ErkJggg==",
        "base64",
    );

    const jpegBuffer = Buffer.from(
        "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYI5Q4WnF0UkZSuCUmKPGQ0eH/xAAbAQEBAQEBAQEBAAAAAAAAAAAAAQIDBAUGB//EACsRAAICAgEDAgQHAQAAAAAAAAABAhEDIRIxQVEEYQUTcZEUIjKBofDx4f/aAAwDAQACEQMRAD8A3+uf6//Z",
        "base64",
    );

    test("processes a PNG buffer returning base64, dimensions and format", () => {
        const result = ImageTransform.process(pngBuffer);

        expect(result.base64).toBe(pngBuffer.toString("base64"));
        expect(result.width).toBe(2);
        expect(result.height).toBe(2);
        expect(result.format).toBe("png");
    });

    test("processes a JPEG buffer returning correct dimensions and format", () => {
        const result = ImageTransform.process(jpegBuffer);

        expect(result.base64).toBe(jpegBuffer.toString("base64"));
        expect(result.width).toBe(1);
        expect(result.height).toBe(1);
        expect(result.format).toBe("jpg");
    });

    test("extracts base64 encoding of the buffer", () => {
        const result = ImageTransform.process(pngBuffer);

        expect(result.base64).toEqual(expect.any(String));
        expect(result.base64.length).toBeGreaterThan(0);
    });
});
