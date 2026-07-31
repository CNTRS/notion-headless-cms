## Context

With Changes 1-4 complete, `NotionCMS` depends on `IPageRepository` and `IImageFetcher` via constructor injection. This makes it trivially testable: create fakes that implement these interfaces, inject them, and test the orchestration logic without any network calls.

This is Change 5 in the 6-change sequence. It depends on the refactored `cms.ts` from Change 4 being in place.

## Goals / Non-Goals

**Goals:**
- Create `FakePageRepository` with configurable in-memory data (`StaticPage[]`, `PageBlock[]`)
- Create `FakeImageFetcher` that returns a static `Buffer` for any URL
- Rewrite `cms.test.ts` to test:
  - `listPages()` returns all pages from fake
  - `getPage()` returns page or null
  - `getPageContent()` returns blocks
  - `getPageWithContent()` processes images and groups lists
  - `getAllPagesContent()` processes all pages
- Keep 0-1 smoke tests for real Notion API (`.skip` by default, needs `.env`)

**Non-Goals:**
- No changes to production code
- No changes to domain, ports, or infrastructure

## Decisions

### Fakes over mocks

**Decision:** Use hand-written fake classes (`FakePageRepository`, `FakeImageFetcher`) rather than a mocking library (vitest.mock, sinon, etc.).

**Rationale:** Fakes are thin, explicit, and don't require framework-specific API knowledge. They serve as living documentation of the contract. When a test fails with a fake, the cause is obvious — no mock setup/verify confusion.

### FakePageRepository stores data in a Map

**Decision:** `FakePageRepository` uses internal `Map<PageId, StaticPage>` and `Map<PageId, PageBlock[]>` to store seeded data.

**Rationale:** Simple, fast, and mirrors `getPage` → `null` semantics naturally (Map.get returns undefined → null).

### Smoke test is optional and skippable

**Decision:** One `cms.smoke.test.ts` file that exercises the real `NotionPageRepository` against the actual Notion API. Marked with `test.skip` by default. Renamed with `.smoke.test.ts` pattern so it can be filtered with `pnpm test:smoke`.

**Rationale:** Provides confidence that the adapter works end-to-end. Not run in CI (no credentials), but explicit opt-in for developers.

## Risks / Trade-offs

- **[Fake-CMS divergence]** If the real `NotionPageRepository` behavior changes (e.g., new mapping logic) but the fakes aren't updated, tests pass while production breaks. **Mitigation:** Run the smoke test before releasing. Keep smoke test data close to the fixture files used in MSW tests.
