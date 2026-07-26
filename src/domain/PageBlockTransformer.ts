import type { PageBlock, ListItem } from "./blocks";

export const PageBlockTransformer = {
    groupConsecutiveItems(blocks: PageBlock[]): PageBlock[] {
        const result: PageBlock[] = [];
        let i = 0;

        while (i < blocks.length) {
            const current = blocks[i];

            if (current.type === "bulleted_list_item") {
                const items: ListItem[] = [{ richText: current.richText }];
                i++;
                while (i < blocks.length) {
                    const next = blocks[i];
                    if (next.type !== "bulleted_list_item") break;
                    items.push({ richText: next.richText });
                    i++;
                }
                result.push({ type: "bulleted_list", items });
            } else if (current.type === "numbered_list_item") {
                const items: ListItem[] = [{ richText: current.richText }];
                i++;
                while (i < blocks.length) {
                    const next = blocks[i];
                    if (next.type !== "numbered_list_item") break;
                    items.push({ richText: next.richText });
                    i++;
                }
                result.push({ type: "numbered_list", items });
            } else {
                result.push(current);
                i++;
            }
        }

        return result;
    },
};
