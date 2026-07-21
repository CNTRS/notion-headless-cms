## MODIFIED Requirements

### Requirement: NotionCMS constructor

The system SHALL provide a `NotionCMS` class whose constructor receives `IPageRepository` and `IImageFetcher`.

- `constructor(repository: IPageRepository, imageFetcher: IImageFetcher)` SHALL store both dependencies as private readonly fields
- The constructor SHALL NOT create any infrastructure objects (no `new Client()`, no `new NotionPageRepository`)
- The old constructor signature `constructor(options: { token: string; db: string; ... })` SHALL be removed

#### Scenario: Construct with repository

- **WHEN** `new NotionCMS(repository, imageFetcher)` is called with valid `IPageRepository` and `IImageFetcher`
- **THEN** the instance SHALL be created with no side effects

### Requirement: NotionCMS returns domain types

The system SHALL change all return types of `NotionCMS` methods from Notion SDK types to domain types.

- `listPages()` SHALL return `Promise<StaticPage[]>` (previously `TNotionPage[]`)
- `getPage(id)` SHALL accept `PageId | string` and return `Promise<StaticPage | null>` (previously `TNotionPage`)
- `getPageContent(id)` SHALL accept `PageId | string` and return `Promise<PageBlock[]>` (previously `Array<PartialBlockObjectResponse | BlockObjectResponse>`)
- `getPageWithContent(id)` SHALL accept `PageId | string` and return `Promise<StaticPage>` (previously `Promise<any>`)
- `getAllPagesContent()` SHALL return `Promise<StaticPage[]>` (previously `TNotionPage[]`)
- The `INotionCMS` interface SHALL be removed (no longer needed — the class is self-documenting)

#### Scenario: List pages returns domain types

- **WHEN** `listPages()` is called
- **THEN** it SHALL return `StaticPage[]`

#### Scenario: Get page content returns domain blocks

- **WHEN** `getPageContent(id)` is called
- **THEN** it SHALL return `PageBlock[]`

### Requirement: Page with content orchestration

The system SHALL orchestrate image downloading and block transformation when fetching page with content.

- `getPageWithContent(id)` SHALL:
  1. Fetch the page via `repository.getPage(id)`
  2. Fetch blocks via `repository.getPageBlocks(id)`
  3. For each `ImageBlock` in the blocks, download the image via `imageFetcher.fetch()` and process via `ImageTransform.process()`
  4. Group consecutive list items via `PageBlockTransformer.groupConsecutiveItems()`
  5. Return the page with processed blocks via `page.withContent()`
- `getAllPagesContent()` SHALL perform the same orchestration for every page

#### Scenario: Page with content processes images

- **WHEN** `getPageWithContent(id)` is called and the page has an image block
- **THEN** the returned `ImageBlock` SHALL have `base64`, `width`, `height`, and `format` populated

#### Scenario: Page with content groups list items

- **WHEN** `getPageWithContent(id)` is called and the page has consecutive bulleted list items
- **THEN** the returned blocks SHALL include a `BulletedList` grouping them
