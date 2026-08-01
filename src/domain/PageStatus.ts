import { InvalidPageStatusError } from "./errors";

const ALLOWED_STATUSES = ["draft", "published", "archived"] as const;

export type PageStatusValue = (typeof ALLOWED_STATUSES)[number];

export class PageStatus {
    private constructor(private readonly value: PageStatusValue) {}

    static create(value: string): PageStatus {
        if (!ALLOWED_STATUSES.includes(value as PageStatusValue)) {
            throw new InvalidPageStatusError(value);
        }
        return new PageStatus(value as PageStatusValue);
    }

    equals(other: PageStatus): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
