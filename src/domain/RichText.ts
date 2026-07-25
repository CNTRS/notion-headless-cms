import { InvalidRichTextError } from "./errors";

export class RichText {
    readonly content: string;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly strikethrough: boolean;
    readonly underline: boolean;
    readonly code: boolean;
    readonly color?: string;
    readonly href?: string;

    private constructor(props: {
        content: string;
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color?: string;
        href?: string;
    }) {
        this.content = props.content;
        this.bold = props.bold;
        this.italic = props.italic;
        this.strikethrough = props.strikethrough;
        this.underline = props.underline;
        this.code = props.code;
        this.color = props.color;
        this.href = props.href;
    }

    static create(props: {
        content: string;
        bold?: boolean;
        italic?: boolean;
        strikethrough?: boolean;
        underline?: boolean;
        code?: boolean;
        color?: string;
        href?: string;
    }): RichText {
        const trimmed = props.content.trim();
        if (trimmed.length === 0) {
            throw new InvalidRichTextError(props.content);
        }
        return new RichText({
            content: props.content,
            bold: props.bold ?? false,
            italic: props.italic ?? false,
            strikethrough: props.strikethrough ?? false,
            underline: props.underline ?? false,
            code: props.code ?? false,
            color: props.color,
            href: props.href,
        });
    }

    equals(other: RichText): boolean {
        return (
            this.content === other.content &&
            this.bold === other.bold &&
            this.italic === other.italic &&
            this.strikethrough === other.strikethrough &&
            this.underline === other.underline &&
            this.code === other.code &&
            this.color === other.color &&
            this.href === other.href
        );
    }
}
