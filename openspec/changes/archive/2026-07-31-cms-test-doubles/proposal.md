## Why

The `cms.test.ts` currently requires a real Notion API (`.env` with `NOTION_TOKEN` and `NOTION_DB`) to run. This makes tests slow, non-deterministic, and impossible to run in CI without credentials. By creating fake implementations of `IPageRepository` and `IImageFetcher`, the `NotionCMS` class can be tested entirely in memory — sub-50ms per test, deterministic, and CI-friendly.

## What Changes

- Create `FakePageRepository` — in-memory implementation of `IPageRepository` with seeded data
- Create `FakeImageFetcher` — returns a predefined buffer for any URL
- Rewrite `cms.test.ts` to use fakes instead of the real Notion API
- Optionally create 1 smoke test (`.smoke.test.ts`) that hits the real API, marked as `skip` by default
- No changes to production code

## Capabilities

### New Capabilities

- `cms-fake-repository`: In-memory fake implementations of `IPageRepository` and `IImageFetcher` for tests
- `cms-unit-tests`: Fast, deterministic tests for `NotionCMS` using test doubles

### Modified Capabilities

- *(none)*

## Impact

- 2 new test files (fakes)
- 1 file rewritten (`cms.test.ts`)
- Optionally 1 new smoke test file
- No changes to production code
