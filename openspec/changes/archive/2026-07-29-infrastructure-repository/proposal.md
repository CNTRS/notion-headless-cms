## Why

The `IPageRepository` and `IImageFetcher` ports need implementations. These adapters bridge the Notion API and HTTP fetch world into the clean domain types. Without them, the new architecture exists only as interfaces and domain models — it doesn't actually work.

## What Changes

- Create `NotionPageRepository` implementing `IPageRepository` — wraps `@notionhq/client`, maps Notion API responses to domain types
- Create `HttpImageFetcher` implementing `IImageFetcher` — wraps `fetch()` to download image buffers
- Create MSW (Mock Service Worker) test infrastructure for intercepting Notion API calls
- MSW fixtures are **pending** — need to capture real Notion API responses first
- Create tests for both adapters using MSW handlers
- No existing code is modified or deleted

## Capabilities

### New Capabilities

- `notion-page-adapter`: Adapts the Notion SDK to the `IPageRepository` port, including type mapping from Notion response types to domain types
- `http-image-adapter`: Adapts the `fetch` API to the `IImageFetcher` port
- `msw-test-infrastructure`: MSW server setup and handlers for testing adapters with controlled API responses

### Modified Capabilities

- *(none)*

## Impact

- 4+ new files under `src/infrastructure/` (production)
- 3-4 new files under `src/test/msw/` (test infrastructure)
- `src/test/msw/fixtures/` — directory created but fixtures left as TODOs (need real API capture)
- New dev dependency: `msw`
- No changes to existing code
