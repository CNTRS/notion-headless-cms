import { InvalidPageIdError } from "./errors";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class PageId {
    private constructor(private readonly value: string) {}

    static create(value: string): PageId {
        if (!UUID_REGEX.test(value)) {
            throw new InvalidPageIdError(value);
        }
        return new PageId(value);
    }

    equals(other: PageId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
