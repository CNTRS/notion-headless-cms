## ADDED Requirements

### Requirement: PageId value object

The system SHALL provide an immutable `PageId` value object that wraps a valid UUID string.

- `PageId.create(value: string): PageId` SHALL validate that `value` is a non-empty UUID string
- `PageId.create()` SHALL throw `InvalidPageIdError` for invalid formats
- `PageId.equals(other: PageId): boolean` SHALL compare by value, not reference
- `PageId.toString(): string` SHALL return the wrapped UUID

#### Scenario: Create valid PageId

- **WHEN** `PageId.create("ad9bcf91-3a83-4504-91ba-e2503d90caba")` is called
- **THEN** it SHALL return a `PageId` instance with that UUID

#### Scenario: Reject invalid UUID

- **WHEN** `PageId.create("not-a-uuid")` is called
- **THEN** it SHALL throw `InvalidPageIdError`

### Requirement: Slug value object

The system SHALL provide an immutable `Slug` value object that wraps a URL-safe slug string.

- `Slug.create(value: string): Slug` SHALL validate that `value` matches the pattern `[a-z0-9]+(?:-[a-z0-9]+)*`
- `Slug.create()` SHALL throw `InvalidSlugError` for invalid formats
- `Slug.equals(other: Slug): boolean` SHALL compare by value

#### Scenario: Create valid slug

- **WHEN** `Slug.create("my-article-title")` is called
- **THEN** it SHALL return a `Slug` instance with value "my-article-title"

#### Scenario: Reject invalid slug

- **WHEN** `Slug.create("My Article Title!")` is called
- **THEN** it SHALL throw `InvalidSlugError`

#### Scenario: Reject empty slug

- **WHEN** `Slug.create("")` is called
- **THEN** it SHALL throw `InvalidSlugError`

### Requirement: PageStatus value object

The system SHALL provide an immutable `PageStatus` value object representing the publication status of a page.

- `PageStatus` SHALL be a finite set: `"draft"`, `"published"`, `"archived"`
- `PageStatus.create(value: string): PageStatus` SHALL accept only these three values
- `PageStatus.create()` SHALL throw for any other value

#### Scenario: Accepted status values

- **WHEN** `PageStatus.create("draft")`, `PageStatus.create("published")`, or `PageStatus.create("archived")` is called
- **THEN** it SHALL return a `PageStatus` instance

#### Scenario: Reject invalid status

- **WHEN** `PageStatus.create("deleted")` is called
- **THEN** it SHALL throw

### Requirement: Tag value object

The system SHALL provide an immutable `Tag` value object representing a content tag.

- `Tag.create(value: string): Tag` SHALL validate that `value` is a non-empty trimmed string
- `Tag.create()` SHALL throw for empty or whitespace-only strings

#### Scenario: Create valid tag

- **WHEN** `Tag.create("off topic")` is called
- **THEN** it SHALL return a `Tag` instance with value "off topic"

#### Scenario: Reject empty tag

- **WHEN** `Tag.create("")` is called
- **THEN** it SHALL throw

### Requirement: StaticPage entity

The system SHALL provide a `StaticPage` entity with identity (by `PageId`) and a private constructor accessible only through a static factory.

- `StaticPage.create(props)` SHALL accept `{ id, slug, status, title, tags?, author?, createdAt?, updatedAt?, content? }`
- `StaticPage.create()` SHALL validate all required fields and throw on invalid input
- `StaticPage` SHALL be immutable — all fields are `readonly`
- `StaticPage` SHALL expose `.withContent(blocks: PageBlock[]): StaticPage` returning a new instance with the given content

#### Scenario: Create page with minimum fields

- **WHEN** `StaticPage.create({ id: pageId, slug: slug, status: status, title: "Hello" })` is called
- **THEN** it SHALL return a `StaticPage` with default `createdAt`, empty `tags`, empty `content`

#### Scenario: Create page with all fields

- **WHEN** `StaticPage.create({ id, slug, status, title, tags, author, createdAt, updatedAt, content })` is called
- **THEN** it SHALL return a `StaticPage` with all fields set

#### Scenario: Page equality by id

- **WHEN** two `StaticPage` instances have the same `PageId`
- **THEN** `equals()` SHALL return `true`

### Requirement: StaticPageBuilder for tests

The system SHALL provide a fluent `StaticPageBuilder` in the test directory that constructs valid `StaticPage` instances with sensible defaults.

- `new StaticPageBuilder().withSlug("x").withTitle("X").build()` SHALL return a valid `StaticPage`
- Each `with<Field>(value)` method SHALL return `this` for chaining
- `.build()` SHALL always produce a valid page (defaults for omitted fields)

#### Scenario: Build page with minimum overrides

- **WHEN** `new StaticPageBuilder().withTitle("Custom").build()` is called
- **THEN** it SHALL return a page with title "Custom" and default values for all other fields
