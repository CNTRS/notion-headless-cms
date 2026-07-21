## Context

The ports layer defines the contracts (interfaces) that the domain depends on but does not implement. These are the "output ports" in hexagonal architecture terminology — they describe what the application needs from the outside world, not how to get it.

This is Change 2 in the 6-change sequence. It depends on `domain-core` (Change 1) for its types and will be implemented by `infrastructure-repository` (Change 3).

## Goals / Non-Goals

**Goals:**
- Define `IPageRepository` with methods for listing pages, retrieving single pages, and fetching page blocks
- Define `IImageFetcher` with a method for downloading image data from a URL
- Both interfaces exclusively use domain types (`StaticPage`, `PageBlock`, `PageId`, etc.)
- Maintain zero leakage of Notion SDK or `fetch` types into port signatures

**Non-Goals:**
- No implementations — those come in Change 3
- No changes to existing files
- No breaking changes to the public API

## Decisions

### IPageRepository returns domain types, not raw Notion types

**Decision:** Every method on `IPageRepository` returns or accepts types from `src/domain/` only.

**Rationale:** This is the fundamental decoupling mechanism. The domain calls `IPageRepository.listPages()` and gets `StaticPage[]`. It never sees `PageObjectResponse` or `QueryDatabaseResponse`. This means:
- Swapping Notion for another CMS requires only a new adapter
- Domain logic never depends on Notion SDK internals
- Tests can use simple in-memory fakes

### IPageRepository does not include save/update methods

**Decision:** The interface is read-only (`listPages`, `getPage`, `getPageBlocks`). No write operations.

**Rationale:** The current system only reads from Notion. Write capability is not needed. Following YAGNI — adding write methods later is not breaking; removing them would be.

### IImageFetcher is a single-method interface

**Decision:** `IImageFetcher.fetch(url: string): Promise<Buffer>` — minimal contract.

**Rationale:** Fetching an image is a single operation with a clear input/output contract. A richer interface with progress, caching, or retries would be premature. The adapter (Change 3) can add these internally.

### Interfaces are defined in `src/ports/`, not co-located with domain or infrastructure

**Decision:** Separate directory.

**Rationale:** Clear physical separation reinforces the architectural boundary. It answers "where do I find the contract?" without ambiguity.

## Risks / Trade-offs

- **[Abstraction mismatch]** The interface may not perfectly fit the Notion API, making the adapter awkward. **Mitigation:** Design interfaces based on domain needs first, then assess adapter complexity. If a mismatch is severe, adjust the interface before implementing.
