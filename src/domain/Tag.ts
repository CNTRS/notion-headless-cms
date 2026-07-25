import { InvalidTagError } from "./errors";

export class Tag {
    private constructor(private readonly value: string) {}

    static create(value: string): Tag {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new InvalidTagError(value);
        }
        return new Tag(trimmed);
    }

    equals(other: Tag): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
