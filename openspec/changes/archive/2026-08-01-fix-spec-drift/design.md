## Context

The six architecture-refactoring changes (domain-core → ports → infrastructure-repository → wire-up → cms-test-doubles → test-organization) are archived and the code ships. During the post-refactor review three drifts were found:

1. `package.json` still reports `0.1.0` although the wire-up change's impact section promised a `0.2.0` bump for its **BREAKING** API changes.
2. `src/domain/PageStatus.ts` accepts four values (`draft`, `published`, `archived`, `development` — `development` added in commit `92b5d96`), but the archived `page-model` spec documents only `draft | published | archived`. `development` is redundant with `draft` and no code path, test, or fixture uses it.
3. The infrastructure-repository change archived a `msw-test-infrastructure` capability spec, but it was never synced into `openspec/specs/`, so the main spec suite has no home for the MSW server/handlers/fixtures requirements.

This change reconciles the package metadata and the code with the already-archived specs. The MSW infrastructure already ships and must not change behavior; only the `development` status value is removed.

## Goals / Non-Goals

**Goals:**
- Honor the promised BREAKING version bump (`0.2.0`)
- Remove the redundant `development` status so `PageStatus` matches the archived `page-model` spec
- Restore the `msw-test-infrastructure` capability in the main specs, corrected where needed

**Non-Goals:**
- No new features, no interface changes, no changes to `IPageRepository` / `IImageFetcher`
- No re-architecting of MSW or the domain model
- No changes to the `page-model` spec (the archived values are correct)
- No touching the archived change directories (they are immutable records)
- No changes to the `upgrade-notion-sdk` plan (handled separately)

## Decisions

### Version bump is metadata-only

**Decision:** Update `package.json` `version` to `0.2.0`. No `dist/`, README, or example references it (verified: only `package.json` carries the version).

**Rationale:** The wire-up change marked its public API changes as **BREAKING** and explicitly listed "Version bump to 0.2.0" under Impact; applying it now makes the release metadata match the already-shipped breaking API. Semver practice: breaking changes require a minor-version bump.

**Alternatives considered:** Leave at `0.1.0` → keeps the repo inconsistent with its own archived plan; bump to `1.0.0` → over-claims stability for a private library (`"private": true`) still in active refactoring.

### Remove the redundant `development` status from the code

**Decision:** Delete `"development"` from `ALLOWED_STATUSES` in `src/domain/PageStatus.ts`. No `page-model` delta spec is created — the archived spec is already correct and stays as-is.

**Rationale:** `development` was added in commit `92b5d96` without a spec update and is semantically a duplicate of `draft`. Grep confirms it appears nowhere except `PageStatus.ts` (no fixtures, tests, or examples), so removing it restores the spec/code contract with zero blast radius.

**Alternatives considered:** Keep `development` and document it in the `page-model` spec → rejected: it would enshrine a redundant state in the spec; keep it undocumented → rejected: leaves the drift unresolved.

### msw-test-infrastructure delta is reproduced from the archived spec, corrected

**Decision:** Recreate the `msw-test-infrastructure` delta spec from the archived infrastructure-repository spec, with one correction: the database-query handler requirement says `GET /v1/databases/:database_id/query`, but the real endpoint is `POST`. The delta spec states `POST`.

**Rationale:** The capability genuinely exists in the codebase (`src/test/msw/server.ts`, `handlers.ts`, `fixtures/`); it was only lost in the spec-sync step. Correcting the HTTP method keeps the spec truthful without re-capturing anything new.

## Risks / Trade-offs

- [Hidden dependency on `development`] Removing a status value could break code that relies on it. → Mitigation: grep shows `development` appears only in `PageStatus.ts`; the unit tests assert the accepted set; CI (`pnpm test`) will catch any missed usage.
- [Version bump side effects] A consumer relying on `0.1.0` would see a new minor version with minimal behavioral delta. → Mitigation: `"private": true`; the bump is internal bookkeeping to match the archived plan.
- [Recreating the MSW spec introduces new drift] The reproduced spec could differ from the archived original. → Mitigation: copy the archived requirements verbatim except for the documented `GET`→`POST` correction, then validate with `openspec validate`.

## Migration Plan

1. Write the `msw-test-infrastructure` delta spec under `changes/fix-spec-drift/specs/` (done)
2. Remove `development` from `src/domain/PageStatus.ts` and delete the obsolete `page-model` delta spec from the change
3. Bump `package.json` version to `0.2.0`
4. Run `pnpm test`, `pnpm lint`, `pnpm build`
5. On completion, archive the change to sync the `msw-test-infrastructure` spec into `openspec/specs/`
6. Rollback, if ever needed: restore `development` in `PageStatus.ts` and revert the version field; the MSW infra is untouched
