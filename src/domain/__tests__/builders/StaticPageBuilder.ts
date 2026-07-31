import { StaticPage } from "../../StaticPage";
import { PageId } from "../../PageId";
import { Slug } from "../../Slug";
import { PageStatus } from "../../PageStatus";
import { RichText } from "../../RichText";
import type { Tag } from "../../Tag";
import type { PageBlock } from "../../blocks";

const DEFAULT_CONTENT: PageBlock[] = [
    { type: "heading_1", richText: [RichText.create({ content: "Hello" })] },
    { type: "text", richText: [RichText.create({ content: "World" })] },
];

export class StaticPageBuilder {
    private id: string | undefined;
    private slug: string | undefined;
    private status: string | undefined;
    private title: string | undefined;
    private tags: Tag[] | undefined;
    private author: string | undefined;
    private createdAt: Date | undefined;
    private updatedAt: Date | undefined;
    private content: PageBlock[] | undefined;

    withId(value: string): this {
        this.id = value;
        return this;
    }

    withSlug(value: string): this {
        this.slug = value;
        return this;
    }

    withStatus(value: string): this {
        this.status = value;
        return this;
    }

    withTitle(value: string): this {
        this.title = value;
        return this;
    }

    withTags(value: Tag[]): this {
        this.tags = value;
        return this;
    }

    withAuthor(value: string): this {
        this.author = value;
        return this;
    }

    withCreatedAt(value: Date): this {
        this.createdAt = value;
        return this;
    }

    withUpdatedAt(value: Date): this {
        this.updatedAt = value;
        return this;
    }

    withContent(value: PageBlock[]): this {
        this.content = value;
        return this;
    }

    withDefaultContent(): this {
        this.content = DEFAULT_CONTENT;
        return this;
    }

    build(): StaticPage {
        return StaticPage.create({
            id: PageId.create(this.id ?? crypto.randomUUID()),
            slug: Slug.create(this.slug ?? "default-slug"),
            status: PageStatus.create(this.status ?? "draft"),
            title: this.title ?? "Default Title",
            tags: this.tags,
            author: this.author,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            content: this.content,
        });
    }
}
