# msw-test-infrastructure Specification

## Purpose
TBD - created by archiving change fix-spec-drift. Update Purpose after archive.
## Requirements
### Requirement: MSW test server

The system SHALL provide a shared MSW server instance for intercepting Notion API calls during tests.

- The MSW server SHALL be configured for Node.js (using `setupServer` from `msw/node`)
- The server SHALL be imported and started in test files via `beforeAll` / `afterAll` lifecycle hooks
- The server SHALL intercept all requests to `https://api.notion.com/*`

#### Scenario: Server intercepts Notion API calls

- **WHEN** a test makes a call to `api.notion.com`
- **THEN** the MSW server SHALL intercept it and return a controlled response

### Requirement: MSW handlers for Notion endpoints

The system SHALL provide MSW request handlers for each Notion API endpoint the system uses.

- A handler for `POST /v1/databases/:database_id/query` returning a list of pages
- A handler for `GET /v1/pages/:page_id` returning a single page
- A handler for `GET /v1/blocks/:block_id/children` returning page blocks
- Each handler SHALL read its response from a JSON fixture file in `src/test/msw/fixtures/`

#### Scenario: Database query handler

- **WHEN** the Notion SDK calls `databases.query()`
- **THEN** the handler SHALL return the fixture from `fixtures/databases.query.json`

### Requirement: Fixture files

The system SHALL store Notion API response fixtures as JSON files in `src/test/msw/fixtures/`.

- Each fixture file SHALL be named after the endpoint and scenario it represents
- Fixtures SHALL be hand-crafted from the official Notion API documentation shapes, verified against the OpenAPI schemas of `@notionhq/client`
- UUIDs SHALL be valid UUIDv4 format to pass `PageId.create()` validation
- Fixtures for the same page SHALL share consistent IDs across files (page IDs, parent IDs)

#### Scenario: Default handlers load standard fixtures

- **GIVEN** the default MSW handlers
- **WHEN** a Notion API request is made
- **THEN** the handler SHALL respond with:
  - `POST /v1/databases/{id}/query` → `fixtures/databases.query.json`
  - `GET /v1/pages/{id}` → `fixtures/pages.retrieve.json`
  - `GET /v1/blocks/{id}/children` → `fixtures/blocks.children.list.json`

#### Scenario: Specific tests override handlers with scenario fixtures

- **WHEN** a test registers a one-shot handler via `server.use()`
- **THEN** the test SHALL be able to load any fixture file to simulate:
  - Empty result: `databases.query.empty.json` / `blocks.children.list.empty.json`
  - Sparse data: `databases.query.sparse.json`
  - Minimal partial response: `pages.retrieve.minimal.json`
  - Pagination: `blocks.children.list.paginated.1.json` + `.2.json`
  - Unsupported block types: `blocks.children.list.unsupported.json`
  - Error responses (404, 429, etc.): inline `HttpResponse.json()` with status code

#### Fixture inventory

| File | Endpoint | Scenario | Blocks/Pages |
|---|---|---|---|
| `databases.query.json` | databases.query | Happy path | 2 pages |
| `databases.query.empty.json` | databases.query | Empty database | `results: []` |
| `databases.query.sparse.json` | databases.query | Optional props missing | 1 page without tags/author |
| `pages.retrieve.json` | pages.retrieve | Happy path | 1 page, status "published" |
| `pages.retrieve.minimal.json` | pages.retrieve | Partial response | Only `object` + `id` |
| `blocks.children.list.json` | blocks.children.list | Happy path | 15 blocks, all types |
| `blocks.children.list.empty.json` | blocks.children.list | Page without content | `results: []` |
| `blocks.children.list.paginated.1.json` | blocks.children.list | Pagination page 1 | 3 blocks, `has_more: true` |
| `blocks.children.list.paginated.2.json` | blocks.children.list | Pagination page 2 | 2 blocks, `has_more: false` |
| `blocks.children.list.unsupported.json` | blocks.children.list | Unsupported types | bookmark, table, unsupported |

