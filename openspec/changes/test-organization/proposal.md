## Why

After 5 changes the code is well-structured, but the test suite still lacks organization. Domain tests, integration tests, and smoke tests are mixed in the same directory. There's no way to run "just unit tests" or "just integration tests". Tests aren't grouped by context, and property-based tests could strengthen coverage of the block grouping logic. Organizing the test suite makes it faster, more readable, and CI-friendly.

## What Changes

- Configure Vitest workspace with 3 projects: `unit`, `integration`, `smoke`
- Add `package.json` scripts: `test:unit`, `test:integration`, `test:smoke`
- Reorganize domain tests with nested `describe` blocks by context
- Add property-based tests for `PageBlockTransformer` (idempotence)
- Refine builders and test fixtures for readability

## Capabilities

### New Capabilities

- `test-suite-organization`: Vitest workspace configuration and categorized test scripts
- `property-based-block-testing`: Property-based tests for block grouping invariants

### Modified Capabilities

- *(none)*

## Impact

- 1 new file: `vitest.workspace.ts` (or update `vite.config.ts`)
- Modified: `package.json` (new scripts)
- Modified: Domain test files (reorganization)
- No changes to production code
