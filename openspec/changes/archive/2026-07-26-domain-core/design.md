## Context

The project currently models pages and blocks through raw Notion SDK types (`PageObjectResponse`, `BlockObjectResponse`) scattered across `cms.ts` and `helpers.ts`. This creates tight coupling to the Notion API: changing the SDK version or migrating to a different CMS would require touching every file. The domain layer extracts and codifies what a "page" and a "block" mean in this project's context, free from any API representation.

This is the first change in a 6-change refactoring sequence toward a hexagonal architecture. It must not modify any existing file — only add new ones.

## Goals / Non-Goals

**Goals:**
- Create explicit, validated value objects for every domain primitive
- Define a sealed union type (`PageBlock`) for all supported content blocks
- Implement `StaticPage` entity with private constructor and static factory
- Extract pure image transformation logic (`ImageTransform`) from `helpers.ts`
- Extract pure list grouping logic (`PageBlockTransformer`) from `helpers.ts`
- Provide `StaticPageBuilder` fluent builder for tests
- Achieve zero external dependencies in `src/domain/`
- All new code covered by unit tests

**Non-Goals:**
- No changes to existing files (`cms.ts`, `helpers.ts`, `main.ts`, etc.)
- No ports, interfaces, or infrastructure yet
- No wiring or dependency injection
- No MSW or test doubles setup
- No changes to the public API consumed by library users

## Decisions

### Value Objects throw exceptions on invalid input (fail-fast)

**Decision:** VO constructors (e.g., `Slug.create()`) throw domain errors like `InvalidSlugError` instead of returning `Either<Error, Slug>`.

**Rationale:** These VOs guard invariants at the system boundary. By the time data reaches them, it should already be valid — the exception signals a programming error or corrupted data, not a recoverable business flow. Either would force every caller to handle validation even in paths where data is known-clean, adding ceremony without benefit.

**Alternatives considered:**
- *Either return type* — more expressive but penalizes the 95% case (valid data) for the 5% edge case
- *Constructor + guard* — same as factory but less semantic naming

### `StaticPage` uses private constructor + static `create()` factory

**Decision:** The entity is instantiated via `StaticPage.create(props)`; the constructor is private.

**Rationale:** Ensures that every `StaticPage` in the system has passed validation. The factory method can return a partially-built page with computed defaults (e.g., `createdAt: new Date()`) while keeping construction logic in one place. Follows the `convert-constructors-to-static-factories` pattern.

### `PageBlock` is a discriminated union, not a class hierarchy

**Decision:** `type PageBlock = TextBlock | HeadingBlock | ImageBlock | BulletedList | NumberedList | CalloutBlock | VideoBlock | ...` — each member is a plain object type with a discriminant `type` field.

**Rationale:** Blocks are data, not behavior. A union type with discriminated `type` gives exhaustive type narrowing in switch/if statements without the overhead of classes, `instanceof`, or visitor patterns. Simpler to serialize, simpler to test.

**Alternatives considered:**
- *Class hierarchy with abstract `Block`* — overkill for data-only types, adds `instanceof` ceremony
- *Single `Block` type with optional fields* — loses exhaustiveness and type safety

### `ImageTransform` is pure and synchronous

**Decision:** `ImageTransform.process(buffer: Buffer): ImageMeta` operates on an already-downloaded buffer, returns dimensions and base64 synchronously.

**Rationale:** Separates I/O (downloading the image — a responsibility of the infrastructure adapter) from processing (calculating dimensions, encoding). Makes the transform testable without network, fast, and deterministic. The I/O layer fetches the image and passes the buffer in.

### `PageBlockTransformer.groupConsecutiveItems()` is pure and synchronous

**Decision:** The transformer takes `PageBlock[]` and returns `PageBlock[]` with consecutive `bulleted_list_item` / `numbered_list_item` wrapped in `BulletedList` / `NumberedList` groups.

**Rationale:** Extracted directly from the reduce logic in `helpers.ts:transformPageContent`. Pure function — same input always produces same output. Testable without async, no I/O, no dependencies.

### `StaticPageBuilder` lives in test files, not production code

**Decision:** The builder is defined in `src/domain/__tests__/builders/`, not exported from production.

**Rationale:** Follows the `extract-fixtures-to-builder-pattern` skill guidance. Builders are test infrastructure — they should not ship to consumers. Using sensible defaults (valid but generic values) minimizes noise in tests.

## Risks / Trade-offs

- **[Duplication during migration]** The VOs and transformers exist alongside the old code in `helpers.ts`. During changes 1-3, the old and new types must be kept in sync manually. **Mitigation:** This is temporary — Change 4 removes the old code entirely.
- **[Over-engineering VOs]** Creating value objects for every primitive (e.g., `Tag`, `RichText`) may feel excessive for simple wrappers. **Mitigation:** Each VO captures a validation rule or behavioral concept. If a VO has no validation or behavior after implementation, it can be inlined — but start explicit and simplify only when proven unnecessary.
- **[Block type incompleteness]** The current code only handles paragraph, heading_1, image, bulleted_list_item, numbered_list_item, callout, and video. New Notion block types encountered later will require extending the `PageBlock` union. **Mitigation:** This is by design — the discriminated union makes adding types safe: the compiler flags all places that need updating via exhaustive switch checks.
