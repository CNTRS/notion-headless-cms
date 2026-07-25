export class InvalidPageIdError extends Error {
    override name = "InvalidPageIdError" as const;
}

export class InvalidSlugError extends Error {
    override name = "InvalidSlugError" as const;
}

export class InvalidPageStatusError extends Error {
    override name = "InvalidPageStatusError" as const;
}

export class InvalidTagError extends Error {
    override name = "InvalidTagError" as const;
}
