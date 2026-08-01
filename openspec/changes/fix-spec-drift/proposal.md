## Why

After archiving the six refactoring changes, the shipped code, the main specs, and the archived change plans have drifted in three places: the wire-up change promised a **BREAKING** version bump to `0.2.0` that was never applied; the `PageStatus` value object accepts `development`, which is redundant with `draft` and contradicts the archived `page-model` spec (`draft | published | archived`); and the `msw-test-infrastructure` capability created in the infrastructure-repository change was never synced into `openspec/specs/`. This change reconciles the package metadata and the code with the already-archived specs.

## What Changes

- **BREAKING**: Bump `package.json` `version` from `0.1.0` to `0.2.0`, honoring the version bump promised in the wire-up change
- Remove `development` from the `PageStatus` allowed values in `src/domain/PageStatus.ts` — it is redundant with `draft`, and removing it aligns the code with the archived `page-model` spec (no spec delta is created; the archived spec is already correct)
- Add `openspec/specs/msw-test-infrastructure/spec.md` (via delta spec), syncing the capability created in the infrastructure-repository change and correcting the database-query handler method from `GET` to `POST`
- The only production behavior change is the removal of the redundant `development` status

## Capabilities

### New Capabilities

- `msw-test-infrastructure`: Shared MSW server, request handlers, and JSON fixtures for intercepting Notion API calls in adapter tests

### Modified Capabilities

_(none — the `page-model` spec stays as archived; the `development` value is removed from the code instead.)_

## Impact

- `package.json` — `version` field `0.1.0` → `0.2.0`
- `src/domain/PageStatus.ts` — remove `development` from `ALLOWED_STATUSES`
- `openspec/specs/msw-test-infrastructure/spec.md` — new capability spec (synced on archive)
- No fixtures, tests, or examples use `development` (verified by grep) — `PageStatus.test.ts` already only asserts `draft`, `published`, `archived`
