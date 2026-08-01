## Why

After archiving the six refactoring changes, the shipped code, the main specs, and the archived change plans have drifted in three places: the wire-up change promised a **BREAKING** version bump to `0.2.0` that was never applied; the `PageStatus` value object accepts `development` but the `page-model` spec still documents only `draft | published | archived`; and the `msw-test-infrastructure` capability created in the infrastructure-repository change was never synced into `openspec/specs/`. This change reconciles the package metadata and the spec suite with the code that already ships.

## What Changes

- **BREAKING**: Bump `package.json` `version` from `0.1.0` to `0.2.0`, honoring the version bump promised in the wire-up change
- Update `openspec/specs/page-model/spec.md` (via delta spec) to include `development` in the `PageStatus` allowed values
- Add `openspec/specs/msw-test-infrastructure/spec.md` (via delta spec), syncing the capability created in the infrastructure-repository change and correcting the database-query handler method from `GET` to `POST`
- Add a unit test asserting `PageStatus.create("development")` is accepted, closing the coverage gap left by the code change that introduced the status
- No production behavior changes — the code already implements all of the above

## Capabilities

### New Capabilities

- `msw-test-infrastructure`: Shared MSW server, request handlers, and JSON fixtures for intercepting Notion API calls in adapter tests

### Modified Capabilities

- `page-model`: `PageStatus` accepted values include `development`

## Impact

- `package.json` — `version` field `0.1.0` → `0.2.0`
- `openspec/specs/page-model/spec.md` — `PageStatus` requirement updated to include `development`
- `openspec/specs/msw-test-infrastructure/spec.md` — new capability spec (synced on archive)
- `src/domain/__tests__/PageStatus.test.ts` — one added acceptance test for `development`
- No production source files change
