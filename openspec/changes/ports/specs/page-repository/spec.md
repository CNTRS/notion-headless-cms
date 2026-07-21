## ADDED Requirements

### Requirement: IPageRepository interface

The system SHALL provide an `IPageRepository` interface that defines read-only access to pages and blocks.

- `IPageRepository` SHALL define the following methods:
  - `listPages(): Promise<StaticPage[]>` — retrieves all pages from the database
  - `getPage(id: PageId): Promise<StaticPage | null>` — retrieves a single page by ID, returns `null` if not found
  - `getPageBlocks(id: PageId): Promise<PageBlock[]>` — retrieves all content blocks for a page, with pagination fully handled internally

#### Scenario: List all pages

- **WHEN** `listPages()` is called
- **THEN** it SHALL return an array of `StaticPage` objects

#### Scenario: Get single page that exists

- **WHEN** `getPage(existingId)` is called with a valid existing ID
- **THEN** it SHALL return the corresponding `StaticPage`

#### Scenario: Get single page that does not exist

- **WHEN** `getPage(missingId)` is called
- **THEN** it SHALL return `null`

#### Scenario: Get page blocks

- **WHEN** `getPageBlocks(existingId)` is called
- **THEN** it SHALL return an array of `PageBlock` objects, with all paginated results flattened into a single array

### Requirement: Interface isolation from external SDKs

The system SHALL ensure that `IPageRepository` does not import or reference any types from `@notionhq/client` or any other external library.

- The file SHALL only import from `src/domain/`
- No `@notionhq/client` types SHALL appear in method signatures or return types

#### Scenario: SDK type audit

- **WHEN** inspecting `IPageRepository` imports
- **THEN** no types from `@notionhq/client` SHALL be present
