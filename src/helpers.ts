import { getPlaiceholder } from "plaiceholder";
import { v1 as uuid } from "uuid";

import {
    BlockObjectResponse,
    PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function transformBlockByType(block: any) {
    if (block.type === "image") {
        const content = block[block.type];

        const src = content[content.type].url;
        const buffer = await fetch(src).then(async res =>
            Buffer.from(await res.arrayBuffer()),
        );

        const {
            base64,
            metadata: { height, width },
        } = await getPlaiceholder(buffer, { size: 64 });

        block.image.size = { height, width };
        block.image.placeholder = base64;
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
                        id: uuid(),
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
