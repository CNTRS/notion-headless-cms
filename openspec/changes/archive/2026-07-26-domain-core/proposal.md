## Why

The CMS domain concepts (pages, blocks, slugs, statuses) are implicit — embedded as raw Notion API types and loose strings throughout `cms.ts` and `helpers.ts`. This makes the code hard to reason about, test, and evolve. We need explicit domain model that captures the business concepts with proper validation, immutability, and type safety, independent of any external API.

## What Changes

- Create `src/domain/` directory with pure domain model
- New value objects: `PageId`, `Slug`, `PageStatus`, `Tag`, `RichText`
- New entity: `StaticPage` with private constructor and static factory method
- New union type: `PageBlock` — discriminated union of all supported block types
- New pure transformers: `ImageTransform` (buffer → base64 + dimensions), `PageBlockTransformer` (list grouping)
- New domain errors: `InvalidSlugError`, `InvalidPageIdError`, etc.
- New test fixtures: `StaticPageBuilder` fluent builder for tests
- No existing code is modified or deleted

## Capabilities

### New Capabilities

- `page-model`: Core domain entities and value objects for representing Notion CMS pages
- `block-model`: Discriminated union types for all supported content blocks
- `image-transform`: Pure image processing (base64 encoding, dimension extraction)
- `block-grouping`: Logic for grouping consecutive bulleted/numbered list items

### Modified Capabilities

- *(none — first change in the project)*

## Impact

- **New files only** — zero changes to existing code
- Build and existing tests continue passing unchanged
- ~12 new files under `src/domain/` (production) + `src/domain/__tests__/` (test)
- No new dependencies — domain is pure TypeScript/JavaScript
