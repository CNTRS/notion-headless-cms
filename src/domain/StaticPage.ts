import type { PageBlock } from "./blocks";
import type { PageId } from "./PageId";
import type { Slug } from "./Slug";
import type { PageStatus } from "./PageStatus";
import type { Tag } from "./Tag";
import { InvalidStaticPageError } from "./errors";

export interface StaticPageProps {
    id: PageId;
    slug: Slug;
    status: PageStatus;
    title: string;
    tags?: Tag[];
    author?: string;
    createdAt?: Date;
    updatedAt?: Date;
    content?: PageBlock[];
}

export class StaticPage {
    readonly id: PageId;
    readonly slug: Slug;
    readonly status: PageStatus;
    readonly title: string;
    readonly tags: Tag[];
    readonly author?: string;
    readonly createdAt: Date;
    readonly updatedAt?: Date;
    readonly content: PageBlock[];

    private constructor(props: StaticPageProps) {
        this.id = props.id;
        this.slug = props.slug;
        this.status = props.status;
        this.title = props.title;
        this.tags = props.tags ?? [];
        this.author = props.author;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt;
        this.content = props.content ?? [];
    }

    static create(props: StaticPageProps): StaticPage {
        if (!props.id || !props.slug || !props.status || !props.title) {
            throw new InvalidStaticPageError("Missing required fields");
        }
        return new StaticPage(props);
    }

    withContent(content: PageBlock[]): StaticPage {
        return new StaticPage({
            id: this.id,
            slug: this.slug,
            status: this.status,
            title: this.title,
            tags: this.tags,
            author: this.author,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            content,
        });
    }
}
