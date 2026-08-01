## Why

The project currently depends on `@notionhq/client@^2.3.0`, which pins Notion API version `2022-06-28`. The latest SDK is `5.23.2`, which pins `2025-09-03` and introduces a multi-data-source model. Staying on v2 means we miss bugfixes (automatic retry on 529), new features (webhook signature verification, data source operations), and risk bit-rot as the old API version loses support. Since the architecture refactoring (Changes 1–5) already isolates all Notion SDK calls into a single adapter (`NotionPageRepository`), this upgrade is now safe and well-scoped: only the adapter and its tests change.

## What Changes

- **BREAKING**: Update `@notionhq/client` from `^2.3.0` to `^5.23.2` in `package.json`
- **BREAKING**: Replace `client.databases.query()` with `client.dataSources.query()` in `NotionPageRepository` — the v5 API moves page queries from the `/v1/databases/:id/query` path to `/v1/data_sources/:id/query`
- **BREAKING**: Add a discovery step in `NotionPageRepository` to resolve `database_id` → `data_source_id` via `client.databases.retrieve()` before querying, throwing `NotionDataSourceError` (defined in the infrastructure layer) when resolution fails
- Update MSW test handlers to intercept the new `/v1/data_sources/:id/query` URL pattern
- Update MSW fixtures if response shapes differ between v2 and v5
- No changes to domain types, port interfaces, or `NotionCMS` orchestration

## Capabilities

### New Capabilities

_(none — no new user-facing features. The existing domain contracts remain unchanged.)_

### Modified Capabilities

- `page-repository`: The `NotionPageRepository` adapter requirement changes — `listPages()` resolves `data_source_id` via `databases.retrieve()` and queries via `dataSources.query()` instead of `databases.query()`, throwing `NotionDataSourceError` when resolution fails

## Impact

- `package.json` — dependency version bump
- `src/infrastructure/errors.ts` (new) — `NotionDataSourceError` for data-source resolution failures
- `src/infrastructure/NotionPageRepository.ts` — query path changes from `databases.query()` to `dataSources.query()`; add `data_source_id` resolution
- `src/infrastructure/__tests__/NotionPageRepository.test.ts` — migrate inline handlers to `/v1/data_sources/:id/query`; add resolution and `NotionDataSourceError` tests
- `src/test/msw/handlers.ts` — add handler for `/v1/data_sources/:id/query` and for `GET /v1/databases/:id`
- `src/test/msw/__tests__/msw-server.test.ts` — repoint smoke assertion to the new data-source query URL (this file was not in the original impact scope)
- `src/test/msw/fixtures/` — verify/update fixture JSON files if response shapes changed
- No changes to `src/domain/`, `src/ports/`, `src/cms.ts`, `src/helpers.ts` (helpers are deleted in Change 4, before this change runs)
