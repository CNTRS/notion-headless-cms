## 1. Update dependency

- [ ] 1.1 Update `@notionhq/client` from `^2.3.0` to `^5.23.2` in `package.json`
- [ ] 1.2 Run `pnpm install` to install new version and verify lockfile

## 2. Update NotionPageRepository

- [ ] 2.1 Add `resolveDataSourceId()` private method that calls `client.databases.retrieve()` and extracts `data_source_id`, caching the result per instance
- [ ] 2.2 Add `NotionDataSourceError` in `src/infrastructure/errors.ts` (infrastructure layer, NOT `src/domain/errors.ts`) for when resolution returns no data sources
- [ ] 2.3 Replace `client.databases.query()` with `client.dataSources.query()` in `listPages()`, resolving `data_source_id` first
- [ ] 2.4 Verify `pages.retrieve()` and `blocks.children.list()` still compile with v5 types (no changes expected)

## 3. Update MSW test infrastructure

- [ ] 3.1 Add MSW handler for `GET /v1/databases/:id` (used by the resolution step) returning `data_sources[]`
- [ ] 3.2 Update existing database query handler from `/v1/databases/:id/query` to `/v1/data_sources/:id/query`
- [ ] 3.3 Verify all existing handlers for pages and blocks still match v5 URL patterns
- [ ] 3.4 Update `src/test/msw/__tests__/msw-server.test.ts` — its assertion targets `POST /v1/databases/test/query`, which no longer has a handler after 3.2; repoint it to `POST /v1/data_sources/test/query` and add a `GET /v1/databases/test` check for the resolution step

## 4. Create v5 test fixtures

Copy from `infrastructure-repository/fixtures/` with v5 transformations. All fixtures live in `openspec/changes/upgrade-notion-sdk/fixtures/`.

### Transformations applied

- **dataSources.query.\*.json** (3 files): Add `"type": "page_or_data_source"` and `"page_or_data_source": {}` to root; rename from `databases.query.\*`; remove `"archived"` from each page result.
- **databases.retrieve.json** (new): Create with `"data_sources": [{ "id": "ds_ad9bcf91", "name": "Headless CMS Data Source" }]`.
- **pages.\* / blocks.\*.json** (7 files): Copy identically then remove `"archived"` field from each page/block object. `pages.retrieve.minimal.json` and `blocks.children.list.empty.json` have no `archived` field to remove.

### File inventory

| File | Origin | Changes |
|---|---|---|
| `dataSources.query.json` | `databases.query.json` | Rename + wrapper + remove `archived` |
| `dataSources.query.empty.json` | `databases.query.empty.json` | Rename + wrapper |
| `dataSources.query.sparse.json` | `databases.query.sparse.json` | Rename + wrapper + remove `archived` |
| `databases.retrieve.json` | **New** | Includes `data_sources[]` |
| `pages.retrieve.json` | Copy from infra-repo | Remove `archived` |
| `pages.retrieve.minimal.json` | Copy as-is | — |
| `blocks.children.list.json` | Copy from infra-repo | Remove `archived` from each block |
| `blocks.children.list.empty.json` | Copy as-is | — |
| `blocks.children.list.paginated.1.json` | Copy from infra-repo | Remove `archived` from each block |
| `blocks.children.list.paginated.2.json` | Copy from infra-repo | Remove `archived` from each block |
| `blocks.children.list.unsupported.json` | Copy from infra-repo | Remove `archived` from each block |

### Verification

- [ ] 4.1 Confirm all 11 fixture files exist in `openspec/changes/upgrade-notion-sdk/fixtures/`
- [ ] 4.2 Verify no fixture contains the v2-only field `"archived"`
- [ ] 4.3 Confirm that `dataSources.query.*.json` and `databases.retrieve.json` reference the same `data_source_id`

## 5. Update adapter tests

- [ ] 5.1 Migrate inline `server.use()` overrides in `src/infrastructure/__tests__/NotionPageRepository.test.ts` from `/v1/databases/:id/query` to `/v1/data_sources/:id/query`, registering a `GET /v1/databases/:id` handler for the resolution step
- [ ] 5.2 Add test: `listPages()` resolves the `data_source_id` via `databases.retrieve()` before querying
- [ ] 5.3 Add test: `listPages()` throws `NotionDataSourceError` when the database has no data sources
- [ ] 5.4 Copy the 11 v5 fixtures from `openspec/changes/upgrade-notion-sdk/fixtures/` into `src/test/msw/fixtures/` and delete the obsolete `databases.query.*.json`

## 6. Verification

- [ ] 6.1 Run `pnpm build` (tsc + vite build) — compilation succeeds
- [ ] 6.2 Run `pnpm test` — all adapter tests pass
- [ ] 6.3 Run `pnpm lint` — no lint errors
- [ ] 6.4 Run example script (requires `.env`) to confirm real API integration works with v5
