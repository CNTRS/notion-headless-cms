## Context

The six architecture-refactoring changes (domain-core → ports → infrastructure-repository → wire-up → cms-test-doubles → test-organization) are archived and the code ships. During the post-refactor review three drifts were found:

1. `package.json` still reports `0.1.0` although the wire-up change's impact section promised a `0.2.0` bump for its **BREAKING** API changes.
2. `src/domain/PageStatus.ts` accepts four values (`draft`, `published`, `archived`, `development` — `development` added in commit `92b5d96`), but `openspec/specs/page-model/spec.md` documents only three and `PageStatus.test.ts` never asserts `development`.
3. The infrastructure-repository change archived a `msw-test-infrastructure` capability spec, but it was never synced into `openspec/specs/`, so the main spec suite has no home for the MSW server/handlers/fixtures requirements.

This change is documentation-and-metadata reconciliation: the production behavior is already correct and must not change.

## Goals / Non-Goals

**Goals:**
- Honor the promised BREAKING version bump (`0.2.0`)
- Bring `page-model` spec in line with the shipped `PageStatus` value set
- Restore the `msw-test-infrastructure` capability in the main specs, corrected where needed
- Close the `development` test coverage gap

**Non-Goals:**
- No production behavior changes — no new features, no interface changes
- No re-architecting of MSW or the domain model
- No touching the archived change directories (they are immutable records)
- No changes to the `upgrade-notion-sdk` plan (handled separately)

## Decisions

### Version bump is metadata-only

**Decision:** Update `package.json` `version` to `0.2.0`. No `dist/`, README, or example references it (verified: only `package.json` carries the version).

**Rationale:** The wire-up change marked its public API changes as **BREAKING** and explicitly listed "Version bump to 0.2.0" under Impact; applying it now makes the release metadata match the already-shipped breaking API. Semver practice: breaking changes require a minor-version bump.

**Alternatives considered:** Leave at `0.1.0` → keeps the repo inconsistent with its own archived plan; bump to `1.0.0` → over-claims stability for a private library (`"private": true`) still in active refactoring.

### page-model delta documents the shipped status set

**Decision:** The delta spec for `page-model` adds `development` to the `PageStatus` allowed values and a matching acceptance scenario. The main spec is updated on sync/archive.

**Rationale:** Specs must describe behavior the code actually has. The code change (`92b5d96`) predates the spec update; this change is retroactive documentation, not new behavior.

### msw-test-infrastructure delta is reproduced from the archived spec, corrected

**Decision:** Recreate the `msw-test-infrastructure` delta spec from the archived infrastructure-repository spec, with one correction: the database-query handler requirement says `GET /v1/databases/:database_id/query`, but the real endpoint is `POST`. The delta spec states `POST`.

**Rationale:** The capability genuinely exists in the codebase (`src/test/msw/server.ts`, `handlers.ts`, `fixtures/`); it was only lost in the spec-sync step. Correcting the HTTP method keeps the spec truthful without re-capturing anything new.

## Risks / Trade-offs

- [Spec fix looks like a feature] Someone reading the `page-model` delta could think `development` is new behavior. → Mitigation: the proposal and this design state explicitly that the code already ships with these behaviors; the change only reconciles specs/metadata.
- [Version bump side effects] A consumer relying on `0.1.0` would see a new minor version with no behavioral delta. → Mitigation: `"private": true`; the bump is internal bookkeeping to match the archived plan.
- [Recreating the MSW spec introduces new drift] The reproduced spec could differ from the archived original. → Mitigation: copy the archived requirements verbatim except for the documented `GET`→`POST` correction, then validate with `openspec validate`.

## Migration Plan

1. Write the two delta specs under `changes/fix-spec-drift/specs/`
2. Bump `package.json` version and add the `development` acceptance test
3. Run `pnpm test` (must stay green — no behavior change) and `pnpm lint`
4. On completion, archive the change to sync both specs into `openspec/specs/`
5. Rollback, if ever needed: revert the version field and delete the two synced specs; the domain code and MSW infra are untouched
