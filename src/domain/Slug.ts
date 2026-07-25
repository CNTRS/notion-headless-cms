import { InvalidSlugError } from "./errors";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class Slug {
    private constructor(private readonly value: string) {}

    static create(value: string): Slug {
        if (!SLUG_REGEX.test(value)) {
            throw new InvalidSlugError(value);
        }
        return new Slug(value);
    }

    equals(other: Slug): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
