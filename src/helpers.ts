import imageSize from "image-size";
import { randomUUID } from "crypto";

import {
    BlockObjectResponse,
    PartialBlockObjectResponse,
    ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

async function processImage(imageBuffer: Buffer) {
    const metadata = imageSize(imageBuffer);
    const processed = imageBuffer.toString("base64");

    return {
        metadata,
        processed,
    };
}

async function transformImageBock(block: ImageBlockObjectResponse) {
    const content = block.image;
    let src = "";
    if (content.type === "external") {
        src = content.external.url;
    }
    if (content.type === "file") {
        src = content.file.url;
    }

    const buffer = await fetch(src).then(async res =>
        Buffer.from(await res.arrayBuffer()),
    );

    const { metadata, processed } = await processImage(buffer);

    return {
        ...block,
        image: {
            ...block.image,
            size: {
                height: metadata.height,
                width: metadata.width,
            },
            format: metadata.type,
            base64: processed,
        },
    };
}

export async function transformBlockByType(block: any) {
    if (block.type === "image") {
        return transformImageBock(block);
    }
    return block;
}

export async function transformPageContent(
    pageContent: Array<BlockObjectResponse | PartialBlockObjectResponse>,
) {
    return Promise.all(pageContent.map(transformBlockByType)).then(blocks => {
        return blocks.reduce((acc, curr) => {
            if (curr.type === "bulleted_list_item") {
                if (acc[acc.length - 1]?.type === "bulleted_list") {
                    acc[acc.length - 1][
                        acc[acc.length - 1].type
                    ].children?.push(curr);
                } else {
                    acc.push({
                        type: "bulleted_list",
                        id: randomUUID(),
                        bulleted_list: { children: [curr] },
                    });
                }
            } else if (curr.type === "numbered_list_item") {
                if (acc[acc.length - 1]?.type === "numbered_list") {
                    acc[acc.length - 1][
                        acc[acc.length - 1].type
                    ].children?.push(curr);
                } else {
                    acc.push({
                        type: "numbered_list",
                        numbered_list: { children: [curr] },
                    });
                }
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);
    });
}
