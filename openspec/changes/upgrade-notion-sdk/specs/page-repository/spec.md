## MODIFIED Requirements

### Requirement: NotionPageRepository implements IPageRepository

The system SHALL provide a `NotionPageRepository` class that implements `IPageRepository` by wrapping `@notionhq/client`.

- `NotionPageRepository` SHALL receive the Notion `Client` instance and database ID via constructor
- `listPages()` SHALL resolve the `data_source_id` from the configured database via `client.databases.retrieve()`, then call `client.dataSources.query()` with it and return the results as `StaticPage[]`
- `listPages()` SHALL throw `NotionDataSourceError` when `databases.retrieve()` returns no data sources
- `getPage(id)` SHALL call `client.pages.retrieve()` and return a `StaticPage` or `null`
- `getPageBlocks(id)` SHALL call `client.blocks.children.list()` with full pagination handling and return `PageBlock[]`

#### Scenario: List all pages from the data source

- **WHEN** `listPages()` is called
- **THEN** it SHALL resolve the `data_source_id` via `databases.retrieve()`
- **AND** call `dataSources.query()` with the resolved `data_source_id`
- **AND** return each result mapped to a `StaticPage` via `StaticPage.create()`

#### Scenario: Fail when the database has no data sources

- **WHEN** `listPages()` is called and `databases.retrieve()` returns no data sources
- **THEN** it SHALL throw `NotionDataSourceError`

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
