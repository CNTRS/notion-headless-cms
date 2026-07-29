## ADDED Requirements

### Requirement: NotionPageRepository implements IPageRepository

The system SHALL provide a `NotionPageRepository` class that implements `IPageRepository` by wrapping `@notionhq/client`.

- `NotionPageRepository` SHALL receive the Notion `Client` instance and database ID via constructor
- `listPages()` SHALL call `client.databases.query()` with the configured database ID and return the results as `StaticPage[]`
- `getPage(id)` SHALL call `client.pages.retrieve()` and return a `StaticPage` or `null`
- `getPageBlocks(id)` SHALL call `client.blocks.children.list()` with full pagination handling and return `PageBlock[]`

#### Scenario: List all pages from the database

- **WHEN** `listPages()` is called
- **THEN** it SHALL call `databases.query()` with the configured database ID
- **AND** return each result mapped to a `StaticPage` via `StaticPage.create()`

#### Scenario: Get single page that exists

- **WHEN** `getPage(existingId)` is called
- **THEN** it SHALL call `pages.retrieve()` with that ID
- **AND** return the mapped `StaticPage`

#### Scenario: Get single page that does not exist

- **WHEN** `getPage(missingId)` is called and the API returns a 404
- **THEN** it SHALL return `null`

#### Scenario: Get page blocks with pagination

- **WHEN** `getPageBlocks(id)` is called and the blocks response has `has_more: true`
- **THEN** it SHALL continue fetching with `start_cursor` until `has_more` is `false`
- **AND** return all blocks flattened into a single `PageBlock[]`

### Requirement: Notion-to-domain type mapping

The system SHALL map Notion API response types to domain types within `NotionPageRepository`.

- `PageObjectResponse.properties` SHALL be parsed to extract: title (from the title property), slug (from the slug rich_text property), status (from the status property), tags (from multi_select), author (from created_by), timestamps (from created_time / last_edited_time)
- Each `BlockObjectResponse` SHALL be mapped by its `type` field to the corresponding `PageBlock` variant
- Image blocks SHALL NOT download images during mapping — image download is handled separately by `IImageFetcher` + `ImageTransform`

#### Scenario: Map page properties

- **WHEN** mapping a `PageObjectResponse` with title, slug, status, tags, created_time
- **THEN** the resulting `StaticPage` SHALL have the corresponding fields populated

#### Scenario: Map image block without downloading

- **WHEN** mapping an image `BlockObjectResponse`
- **THEN** the resulting `ImageBlock` SHALL have the image URL but SHALL NOT download or process the image
