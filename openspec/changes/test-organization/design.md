## Context

This is the final change in the 6-change sequence. All architecture work is done — this change focuses entirely on the test developer experience. The goal is a test suite that is fast, organized, and expressive.

Project currently uses Vitest 3.x. It supports workspaces natively.

## Goals / Non-Goals

**Goals:**
- Vitest workspace with 3 projects:
  - `unit`: `src/domain/**/*.test.ts` — pure logic, no I/O, ultra-fast
  - `integration`: `src/**/*.test.ts` excluding domain and smoke — uses MSW, still fast
  - `smoke`: `src/**/*.smoke.test.ts` — real Notion API, skipped by default
- `package.json` scripts: `test:unit`, `test:integration`, `test:smoke`, `test` (runs all)
- Domain tests reorganized with nested `describe()` by context
- Property-based tests for `PageBlockTransformer.groupConsecutiveItems()` using `fast-check`
- Builders refined for expressiveness

**Non-Goals:**
- No changes to production code
- No changes to the test infrastructure from Change 3 (MSW) or Change 5 (fakes)

## Decisions

### Vitest workspace via vitest.workspace.ts

**Decision:** Create `vitest.workspace.ts` with 3 projects that share the same Vite config but have different `include` patterns.

**Rationale:** Native Vitest workspace support. Each project can have independent `include`, `exclude`, and `setupFiles`. Tests don't need to know which project they belong to — it's determined by file path.

### Property-based tests with fast-check

**Decision:** Install `fast-check` and add property-based tests for `PageBlockTransformer.groupConsecutiveItems()`.

**Rationale:** The grouping function has a clear invariant: idempotence. Property-based tests generate hundreds of block arrays and verify that applying the function twice gives the same result as applying it once. This catches edge cases that example-based tests miss (e.g., mixed list types, single-item groups, interleaved non-list blocks).

### Domain test reorganization: describe per entity

**Decision:** Each domain test file uses a top-level `describe("EntityName")` with nested `describe("methodName")` blocks.

**Rationale:** Follows `regroup-test-suites-by-context` skill. Makes test output readable (`StaticPage > create > rejects invalid slug`) and allows sharing context-specific `beforeEach` config.

Structure:
```typescript
describe("StaticPage", () => {
  describe("create", () => {
    // tests for StaticPage.create()
  })
  describe("withContent", () => {
    // tests for withContent()
  })
})
```

## Risks / Trade-offs

- **[Workspace complexity]** Workspaces add a config file. Simple projects might not need them. **Mitigation:** The workspace config is ~20 lines and provides clear value (separate test commands).
- **[fast-check dependency]** Another dev dependency. **Mitigation:** It's a well-maintained library by the Vitest ecosystem.
