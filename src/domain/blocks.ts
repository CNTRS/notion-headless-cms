import type { RichText } from "./RichText";

export interface ListItem {
    richText: RichText[];
}

export interface BulletedListItem {
    type: "bulleted_list_item";
    richText: RichText[];
}

export interface NumberedListItem {
    type: "numbered_list_item";
    richText: RichText[];
}

export interface TextBlock {
    type: "text";
    richText: RichText[];
}

export interface HeadingBlock {
    type: "heading_1" | "heading_2" | "heading_3";
    richText: RichText[];
}

export interface ImageBlock {
    type: "image";
    url: string;
    alt?: string;
    base64?: string;
    width?: number;
    height?: number;
    format?: string;
}

export interface CalloutBlock {
    type: "callout";
    richText: RichText[];
    icon?: string;
}

export interface BulletedList {
    type: "bulleted_list";
    items: ListItem[];
}

export interface NumberedList {
    type: "numbered_list";
    items: ListItem[];
}

export interface VideoBlock {
    type: "video";
    url: string;
}

export interface CodeBlock {
    type: "code";
    richText: RichText[];
    language?: string;
}

export interface QuoteBlock {
    type: "quote";
    richText: RichText[];
}

export interface DividerBlock {
    type: "divider";
}

export type PageBlock =
    | TextBlock
    | HeadingBlock
    | ImageBlock
    | CalloutBlock
    | BulletedList
    | NumberedList
    | BulletedListItem
    | NumberedListItem
    | VideoBlock
    | CodeBlock
    | QuoteBlock
    | DividerBlock;
