## Why

The old `NotionCMS` class creates its own Notion client internally and returns raw Notion SDK types. `helpers.ts` contains a mix of pure logic (which now lives in `src/domain/`) and I/O (which lives in `src/infrastructure/`). It's time to wire the new architecture together: refactor `NotionCMS` to use the ports and adapters, switch return types to domain types, and eliminate the old helper files.

## What Changes

- **BREAKING**: `NotionCMS` constructor changes — receives `IPageRepository` and `IImageFetcher` instead of `{ token, db }`
- **BREAKING**: `NotionCMS` methods return `StaticPage[]` and `PageBlock[]` instead of raw Notion SDK types
- `NotionCMS` orchestrates: calls repository → processes blocks (downloads images, groups lists) → returns domain types
- `main.ts` becomes the composition root, wiring adapters together
- `helpers.ts` deleted (logic migrated to domain/, I/O to infrastructure/)
- `helpers.mocks.ts` deleted (replaced by builders from domain-core)
- `helpers.test.ts` deleted (covered by domain tests)
- `cms.test.ts` updated for new constructor signature
- `examples/fetch-and-store.ts` updated for new API

## Capabilities

### New Capabilities

- `cms-orchestration`: The refactored `NotionCMS` that coordinates repository calls with image processing and block transformation

### Modified Capabilities

- *(none)*

## Impact

- **BREAKING**: Public API changes — constructor and return types
- 1 file rewritten (`cms.ts`)
- 1 file rewritten (`main.ts`)
- 3 files deleted (`helpers.ts`, `helpers.mocks.ts`, `helpers.test.ts`)
- 1 file updated (`examples/fetch-and-store.ts`)
- Version bump to 0.2.0
