## Why

The `NotionCMS` class currently talks directly to the Notion SDK, and `helpers.ts` calls `fetch()` directly for images. There's no abstraction boundary between business logic and infrastructure. Port interfaces define the contracts that decouple domain from I/O — without changing anything that uses them yet.

## What Changes

- Create `src/ports/` directory with two interfaces
- `IPageRepository`: contract for reading pages and blocks from any data source
- `IImageFetcher`: contract for fetching image data from a URL
- Both interfaces use only domain types from `src/domain/` — zero Notion SDK types
- No existing code is modified or deleted

## Capabilities

### New Capabilities

- `page-repository`: Interface for retrieving pages and blocks from a CMS data source
- `image-fetcher`: Interface for fetching image binary data from URLs

### Modified Capabilities

- *(none)*

## Impact

- 3 new files under `src/ports/`
- No changes to existing code
- No new dependencies
