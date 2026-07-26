import imageSize from "image-size";

export interface ImageMeta {
    base64: string;
    width: number;
    height: number;
    format: string;
}

export const ImageTransform = {
    process(buffer: Buffer): ImageMeta {
        const { width, height, type } = imageSize(buffer);

        if (width === undefined || height === undefined || type === undefined) {
            throw new Error("Unable to determine image dimensions or format");
        }

        return {
            base64: buffer.toString("base64"),
            width,
            height,
            format: type,
        };
    },
};
