## 1. Update dependency

- [ ] 1.1 Update `@notionhq/client` from `^2.3.0` to `^5.23.2` in `package.json`
- [ ] 1.2 Run `pnpm install` to install new version and verify lockfile

## 2. Update NotionPageRepository

- [ ] 2.1 Add `resolveDataSourceId()` private method that calls `client.databases.retrieve()` and extracts `data_source_id`
- [ ] 2.2 Add `NotionDataSourceError` to `src/domain/errors.ts` for when resolution returns no data sources
- [ ] 2.3 Replace `client.databases.query()` with `client.dataSources.query()` in `listPages()`, resolving `data_source_id` first
- [ ] 2.4 Verify `pages.retrieve()` and `blocks.children.list()` still compile with v5 types (no changes expected)

## 3. Update MSW test infrastructure

- [ ] 3.1 Add MSW handler for `GET /v1/databases/:id` (used by the resolution step) returning `data_sources[]`
- [ ] 3.2 Update existing database query handler from `/v1/databases/:id/query` to `/v1/data_sources/:id/query`
- [ ] 3.3 Verify all existing handlers for pages and blocks still match v5 URL patterns

## 4. Update test fixtures

- [ ] 4.1 Re-capture or update the `databases.retrieve()` fixture to include `data_sources[]` (2025-09-03 format)
- [ ] 4.2 Re-capture or update the query fixture to reflect the data source response shape
- [ ] 4.3 Run existing adapter tests and fix any fixture mismatches

## 5. Verification

- [ ] 5.1 Run `pnpm build` (tsc + vite build) — compilation succeeds
- [ ] 5.2 Run `pnpm test` — all adapter tests pass
- [ ] 5.3 Run `pnpm lint` — no lint errors
- [ ] 5.4 Run example script (requires `.env`) to confirm real API integration works with v5
