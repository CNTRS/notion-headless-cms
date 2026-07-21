## Context

The infrastructure layer implements the ports defined in Change 2. This is where the "dirty work" happens: calling the Notion SDK, making HTTP requests, and translating messy API responses into clean domain types. This change also introduces MSW for testing these adapters without hitting the real Notion API.

This is Change 3 in the 6-change sequence. The adapters created here will be wired into `cms.ts` in Change 4.

## Goals / Non-Goals

**Goals:**
- Implement `NotionPageRepository` that translates `@notionhq/client` responses into `StaticPage` and `PageBlock` domain types
- Implement `HttpImageFetcher` that downloads image bytes via `fetch()`
- Set up MSW server for intercepting Notion API calls in tests
- Test both adapters with MSW handlers using fixture JSON responses
- Ensure the adapter tests cover pagination, image blocks, error states

**Non-Goals:**
- No changes to existing production code
- No wiring into `cms.ts` yet — that's Change 4
- No real API calls during tests — MSW handles everything

## Decisions

### NotionPageRepository handles all mapping internally

**Decision:** The repository class receives the Notion `Client` and the database ID via constructor, and translates every Notion response type to domain types internally. No mapping logic leaks outside.

**Rationale:** The translation from `PageObjectResponse` → `StaticPage` and `BlockObjectResponse` → `PageBlock` is the adapter's sole responsibility. Keeping it contained means:
- If the Notion API changes, only this file changes
- If we switch CMS providers, we write a new adapter with the same mapping logic
- Testing is straightforward: feed it Notion-shaped JSON, expect domain types

### MSW over test doubles

**Decision:** Use MSW to intercept HTTP calls from `@notionhq/client` rather than creating `FakePageRepository` or mocking the Notion SDK directly.

**Rationale:** MSW intercepts at the network layer, which means:
- The ENTIRE stack is tested: adapter → SDK → HTTP → MSW handler
- Fixture JSON files serve as both test data and documentation of API responses
- No need to mock SDK internals (which change between SDK versions)

**Trade-off:** Slightly more setup than direct fakes. But the fidelity gain (testing the actual HTTP parsing) is worth it.

### Fixture JSON files are recorded from real API, then curated

**Decision:** Capture real Notion API responses once, save as JSON fixtures, then trim irrelevant fields for readability.

**Rationale:** Real responses guarantee structural accuracy. Manually writing fixtures risks missing fields or getting types wrong. The capture step is a one-time cost.

**Status:** Fixture capture is PENDING in the tasks — the user needs to run against their Notion DB first.

### MSW handlers switch on URL patterns

**Decision:** Handlers match Notion API endpoints (`/v1/databases/:id/query`, `/v1/blocks/:id/children`, `/v1/pages/:id`) and return the appropriate fixture.

**Rationale:** The `@notionhq/client` SDK calls these REST endpoints directly. URL-based matching is deterministic and doesn't depend on SDK internals.

## Risks / Trade-offs

- **[Fixture drift]** If the Notion API changes its response format, fixtures become outdated. **Mitigation:** Run the capture script periodically or when SDK is updated.
- **[MSW compatibility with Node.js]** MSW requires Node.js 18+ fetch API. **Mitigation:** Already satisfied (project engines >=18.16).
- **[Mapping complexity]** The `PageObjectResponse` → `StaticPage` mapping involves parsing Notion property types (title, rich_text, status, multi_select, etc.). Some blocks may not map cleanly. **Mitigation:** Start with the blocks currently used in `helpers.ts` (paragraph, heading_1, image, bulleted_list_item, numbered_list_item, callout, video). Add block types as needed.
