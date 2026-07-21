## ADDED Requirements

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

- A handler for `GET /v1/databases/:database_id/query` returning a list of pages
- A handler for `GET /v1/pages/:page_id` returning a single page
- A handler for `GET /v1/blocks/:block_id/children` returning page blocks
- Each handler SHALL read its response from a JSON fixture file in `src/test/msw/fixtures/`

#### Scenario: Database query handler

- **WHEN** the Notion SDK calls `databases.query()`
- **THEN** the handler SHALL return the fixture from `fixtures/databases.query.json`

### Requirement: Fixture files (PENDING — to be captured from real API)

The system SHALL store Notion API response fixtures as JSON files in `src/test/msw/fixtures/`.

- Each fixture file SHALL be named after the endpoint it represents (e.g., `databases.query.json`, `pages.retrieve.json`, `blocks.children.list.json`)
- Fixtures SHALL be captured from real Notion API responses, then trimmed to relevant fields
- **Status**: PENDING — requires the developer to run against their Notion database and capture responses

#### Scenario: Fixture directory structure

- **WHEN** inspecting `src/test/msw/fixtures/`
- **THEN** it SHALL exist with placeholder files for each endpoint
