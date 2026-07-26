## Context

This change runs AFTER the five architecture-refactoring changes (domain-core → ports → infrastructure-repository → wire-up → cms-test-doubles → test-organization). By then, all Notion SDK usage is isolated in a single adapter class: `NotionPageRepository` in `src/infrastructure/`. The `NotionCMS` class and domain types are completely decoupled from `@notionhq/client`.

**Current state after refactoring:**
- `NotionPageRepository` uses `client.databases.query()` (v2 SDK API)
- MSW handlers intercept `/v1/databases/:id/query`
- Fixtures captured from Notion API responses follow the `2022-06-28` format

**Target state:**
- `NotionPageRepository` uses `client.dataSources.query()` (v5 SDK API, `Notion-Version: 2025-09-03`)
- An initial `databases.retrieve()` call resolves `database_id` → `data_source_id`
- MSW handlers intercept `/v1/data_sources/:id/query`
- Fixtures reflect the `2025-09-03` response shape

## Goals / Non-Goals

**Goals:**
- Upgrade `@notionhq/client` from `^2.3.0` to `^5.23.2`
- Update `NotionPageRepository.listPages()` to use the v5 data-source-based query path
- Ensure all tests pass with the new SDK and API version
- Keep the `IPageRepository` interface unchanged
- Keep the `StaticPage` and `PageBlock` domain types unchanged
- Update MSW test infrastructure (handlers, fixtures) for the new API routing

**Non-Goals:**
- No changes to domain types, port interfaces, or CMS orchestration
- No new features beyond what the existing adapter already provides
- No changes to `HttpImageFetcher` (it uses `fetch()`, not the Notion SDK)
- No changes to example scripts (they compose through `main.ts`, never use Notion SDK directly)

## Decisions

### One-step resolution of data_source_id in the adapter

**Decision:** `NotionPageRepository.listPages()` will call `client.databases.retrieve()` once in the constructor to obtain the `data_source_id` from the database response, store it, and use it for all subsequent `client.dataSources.query()` calls. The constructor signature does not change — it still receives `database_id`.

```typescript
// Constructor
constructor(client: Client, databaseId: string) {
    this.client = client;
    this.databaseId = databaseId;
    // dataSourceId resolved lazily or in an init method
}

// Option A: Lazy resolution
async listPages(): Promise<StaticPage[]> {
    const dataSourceId = await this.resolveDataSourceId();
    const response = await this.client.dataSources.query({
        data_source_id: dataSourceId,
    });
    return response.results.map(this.mapToStaticPage);
}

// Option B: Eager resolution in constructor
// (Not viable — constructor is synchronous, client call is async)
```

**Rationale:** A multi-database scenario (the reason for the v5 API change) is unlikely for this project (single Notion DB as CMS), but the SDK v5 enforces the new path. The resolution step is a one-time cost of one extra API call. Lazy resolution with caching avoids the call if `listPages()` is never invoked and avoids the async-constructor problem.

**Alternatives considered:**
- Accept `data_source_id` directly in the constructor instead of `database_id` → breaks the existing `IPageRepository` interface and shifts the resolution burden to the composition root.
- Keep using `client.databases.query()` (still exists in v5 for database-level operations) → this endpoint no longer returns pages; it returns data-source metadata. Would silently return wrong results.

### MSW handler routing changes

**Decision:** Update the existing handler for database query to route `/v1/data_sources/:id/query` instead of `/v1/databases/:id/query`. Also add a handler for `GET /v1/databases/:id` (used by the resolution step).

**Rationale:** The MSW interceptors must match the URLs the v5 SDK calls. The resolution step (`databases.retrieve()`) is a new HTTP interaction that needs its own handler and fixture.

### Fixture updates for 2025-09-03 response format

**Decision:** Re-capture the Notion API responses after the upgrade to verify the response shape, then update or replace the fixture JSON files. The `data_sources[]` field in database responses is the main structural addition.

**Rationale:** The fixtures are the source of truth for tests. Running against the real API once after upgrade is the only way to guarantee they reflect actual responses.

### NotionPageRepository test structure unchanged

**Decision:** The test file `src/infrastructure/__tests__/NotionPageRepository.test.ts` is modified in place — same file, updated handlers and fixtures. No new test files.

**Rationale:** The test scenarios (list pages returns mapped StaticPage[], getPage returns page or null, getPageBlocks handles pagination) are unchanged. Only the wire-up changes.

## Risks / Trade-offs

- **[Resolution failure]** If `databases.retrieve()` returns no `data_sources` or the database doesn't exist, `listPages()` would fail with a cryptic error. **Mitigation:** Throw a descriptive `NotionDataSourceError` (or similar) when the data sources array is empty.
- **[Extra API call]** Each `NotionPageRepository` instance makes one extra API call (retrieve database) on first use. **Mitigation:** A single DB instance means this is a one-time cost. Cache the resolved `data_source_id` per instance.
- **[Fixture drift]** Re-captured fixtures may differ from the existing ones in subtle ways, causing test regressions. **Mitigation:** Run the full test suite after updating fixtures and diff the old vs new fixtures to understand the delta.
- **[MSW compatibility]** MSW must support intercepting the URLs that the v5 SDK calls. The SDK uses `fetch` internally (v3+), so MSW should intercept transparently. **Mitigation:** Verify with a smoke test during implementation.
- **[Rollback]** If v5 has a critical issue, we need to revert the upgrade. **Mitigation:** This change only modifies the adapter and test files — reverting `package.json` and the adapter restores the previous state with no other code changes needed.
