## Context

This is Change 4 in the 6-change sequence — the most impactful one. Changes 1-3 have been purely additive (new files, no modifications). Change 4 rewrites existing files, deletes old ones, and changes the public API. It's the payoff for the preparatory work.

**Before this change:** `cms.ts` creates `new Client()` internally, talks to Notion directly, and returns raw Notion types. `helpers.ts` has a mix of image processing and list grouping. The public API is `new NotionCMS({ token, db })`.

**After this change:** `cms.ts` receives `IPageRepository` and `IImageFetcher` via constructor, orchestrates calls, returns `StaticPage[]` and `PageBlock[]`. All I/O is in infrastructure adapters. All pure logic is in domain transformers.

## Goals / Non-Goals

**Goals:**
- Refactor `NotionCMS` constructor to receive `IPageRepository` and `IImageFetcher`
- Change return types from Notion SDK types to domain types (`StaticPage[]`, `PageBlock[]`)
- Wire `NotionCMS` to orchestrate: repository → image download → image transform → block grouping → `StaticPage`
- Rewrite `main.ts` as composition root that creates adapters and injects them
- Delete `helpers.ts`, `helpers.mocks.ts`, `helpers.test.ts`
- Update `cms.test.ts` for new constructor
- Update `examples/fetch-and-store.ts`

**Non-Goals:**
- No changes to domain (Change 1), ports (Change 2), or infrastructure adapters (Change 3)
- No MSW yet — `cms.test.ts` may continue using real API temporarily (Change 5 adds doubles)

## Decisions

### NotionCMS receives IPageRepository + IImageFetcher via constructor

**Decision:** Constructor signature becomes `constructor(repository: IPageRepository, imageFetcher: IImageFetcher)`.

**Rationale:** This is the core of dependency inversion. The class no longer creates its own Notion client, doesn't know about `@notionhq/client`, and can be tested with any `IPageRepository` implementation (fake, MSW-backed, etc.).

### NotionCMS orchestrates the full page-with-content flow

**Decision:** `getAllPagesContent()` (and `getPageWithContent()`) call the repository, then download images, apply `ImageTransform.process()`, and run `PageBlockTransformer.groupConsecutiveItems()` before returning.

```text
getPageWithContent(id)
  │
  ├─ repository.getPage(id)              → StaticPage (no content)
  ├─ repository.getPageBlocks(id)         → PageBlock[]
  ├─ for each ImageBlock:
  │     imageFetcher.fetch(url)          → Buffer
  │     ImageTransform.process(buffer)   → { base64, w, h, format }
  │     (mutate ImageBlock with result)
  ├─ PageBlockTransformer.groupConsecutiveItems(blocks)
  └─ page.withContent(processedBlocks)   → StaticPage (with content)
```

### Image processing happens in the CMS orchestration, not in the adapter

**Decision:** `NotionPageRepository` maps image blocks with their URL but does NOT download or process images. The CMS layer does that after fetching blocks.

**Rationale:** Separating concerns — the repository just retrieves data; the CMS layer coordinates what to do with it. This makes the repository usable for "raw" data retrieval (e.g., returning image metadata without downloading the actual image) and keeps the adapter simple.

### main.ts becomes the composition root

**Decision:** `main.ts` creates `NotionClient`, `NotionPageRepository`, `HttpImageFetcher`, assembles them, and exports `NotionCMS`.

**Rationale:** The consumer still gets a simple API (`new NotionCMS(...)`) — but behind the scenes, the composition root provides the wiring. If consumers want to customize (e.g., use a different repository), they can import the adapters directly and compose themselves.

After:
```typescript
// main.ts
const client = new Client({ auth: process.env.NOTION_TOKEN });
const repository = new NotionPageRepository(client, process.env.NOTION_DB);
const imageFetcher = new HttpImageFetcher();
const cms = new NotionCMS(repository, imageFetcher);
export default cms;
```

### Old interface capabilities dropped

**Decision:** Properties config (`timestamp`, `slug`, `status`) defined in the old `TNotionCMSOptions` are removed without replacement.

**Rationale:** They were declared but never used. If needed in the future, they would live in the repository adapter's configuration, not in the CMS class.

## Risks / Trade-offs

- **[Breaking API change]** Consumers using `new NotionCMS({ token, db })` must migrate. **Mitigation:** Version 0.1.0 — breaking changes are expected. Document migration path in the changelog.
- **[Example out of sync]** The example must be updated alongside the API change. **Mitigation:** Update `examples/fetch-and-store.ts` in the same change.
- **[Regression in type mapping]** The Notion-to-domain mapping in `NotionPageRepository` may miss edge cases. **Mitigation:** The MSW-backed tests from Change 3 cover the mapping. Run them before considering this change complete.
