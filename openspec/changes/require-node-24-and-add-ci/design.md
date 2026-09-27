## Context

The project declares `engines.node: ">=22.12.0"`. Investigation showed this floor is factually wrong rather than merely conservative: `tsdown@0.23.0` and `rolldown-plugin-dts@0.28.6` both declare `engines.node: "^22.18.0 || ^24.11.0 || >=26.0.0"`, so a developer on Node 22.12.0–22.17.x passes our own declaration but is rejected by the build toolchain. Nobody noticed because there is no CI — `.github/workflows/` does not exist, so no commit is automatically verified.

Three facts shaped the decisions:

1. **Local development already runs Node 24.12.0.** The whole toolchain (`pnpm build`, 134 tests, Biome) has been exercised on Node 24 in this session, so the upgrade is a codification of reality rather than an untested jump.
2. **`tsdown` derives its bundle target from `engines.node`.** Source (`tsdown/dist/target-DgdLrXba.mjs`):

   ```js
   function resolvePackageTarget(pkg) {
     const nodeVersion = pkg?.engines?.node;
     const nodeMinVersion = findMinimumForRange(nodeVersion);
     return `node${normalize(nodeMinVersion)}`;
   }
   ```

   The `engines` range is therefore **not metadata** — it silently determines the emitted bundle's syntax level.
3. **The package is `private: true`.** There is no published consumer, so dropping Node 22 is not a semver-major event and carries no ecosystem cost.

Release status at time of writing: Node 24 "Krypton" is Latest LTS (24.21.0); Node 22 "Jod" is LTS; Node 26 is `Current` and has no announced codename. Node's own policy states *"Production applications should only use Active LTS or Maintenance LTS releases."*

## Goals / Non-Goals

**Goals:**

- Make `engines.node` truthful: no advertised runtime that the toolchain rejects
- Set the floor on the latest LTS line, with the build target following it deliberately
- Pin a reproducible local Node version
- Add the missing verification gate so build, lint and test regressions cannot land unnoticed

**Non-Goals:**

- Adopting Node 26 as a supported version
- Modernising the source to use post-ES2020 syntax or Node-24-only APIs (none are needed)
- Fixing the 4 pre-existing Biome diagnostics outside `src/`
- Un-skipping the live-API smoke test or wiring credentialed CI jobs
- Adding a `packageManager` field to `package.json`

## Decisions

### D1: Floor is `>=24.11.0`, not `>=24` and not `^24.11.0`

**Decision:** `">=24.11.0"`.

Because `resolvePackageTarget` takes the *minimum* of the range, the floor's precision directly sets the bundle target. Verified empirically against the installed `verkit`:

```
engines.node                            -> target tsdown/rolldown
>=22.12.0                               -> node22.12.0   (current)
>=24                                    -> node24.0.0    <-- rejected
>=24.11.0                               -> node24.11.0   <-- chosen
>=26                                    -> node26.0.0
^22.18.0 || ^24.11.0 || >=26.0.0        -> node22.18.0
```

Writing `">=24"` looks natural but produces `target: node24.0.0` — a target *below* the `>=24.11.0` that `tsdown` itself requires. The floor must be stated at the same precision as the toolchain's own requirement.

**Alternative considered — `^24.11.0`:** rejected. It pins the major, so a future Node 25 (which reaches EOL in ~6 months) would be accepted. A `>=` floor keeps working across majors; patch precision costs nothing.

**Alternative considered — `>=24.0.0`:** rejected for the reason above.

### D2: Node 24, not Node 26

**Decision:** floor on 24; include 26 in the CI matrix only as a non-blocking signal.

Node 26 is `Current`, not LTS, and Node's policy explicitly restricts production use to Active/Maintenance LTS. It entered Current on 2026-05-05 and reaches LTS around November 2026 — roughly five months out. Declaring `">=26.0.0"` would also break the bundle for every Node 24 consumer with no compensating gain: the source is ES2020 and uses no modern Node API.

**Alternative considered — `>=24.11.0 || >=26.0.0`:** rejected. `findMinimumForRange` still yields 24.11.0, so it would only add ambiguity without changing the target.

**Alternative considered — mirror tsdown's own range `^22.18.0 || ^24.11.0 || >=26.0.0`:** rejected. It preserves Node 22, but the package is private with no consumers, so preserving Node 22 buys nothing and would leave the target at `node22.18.0` — i.e. no modernisation at all.

### D3: `.nvmrc` pins an exact patch release

**Decision:** `24.21.0`.

**Alternative considered — `24`:** also works with `nvm use` and auto-tracks LTS patches, but resolution then depends on *when* it is read, which reintroduces the drift the file exists to prevent. The exact pin is what makes `engines.node` and the local runtime agree.

### D4: CI matrix runs both 24.x and 26.x with `fail-fast: false`

**Decision:** `strategy.fail-fast: false`, `matrix.node: ['24.x', '26.x']`.

The floor stays at 24; the `26.x` lane exists so that breakage in the next LTS surfaces *now* rather than in November when 26 is adopted. `fail-fast: false` ensures a `26.x` failure does not mask the `24.x` result, which is the one that actually gates.

### D5: Workflow runs the project's own commands

**Decision:** the job invokes `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm check`, `pnpm test:unit --run`, `pnpm test:integration --run`. No bespoke lint or test logic.

Three details are load-bearing and were verified against the repo:

- **`pnpm/action-setup` must precede `actions/setup-node`** — the latter's `cache: pnpm` needs pnpm already on `PATH`.
- **The pnpm version must be pinned explicitly** — the project declares no `packageManager` field, so `pnpm/action-setup` would otherwise resolve an unpinned version. The `preinstall: npx only-allow pnpm` guard means an accidental `npm ci` would fail the run.
- **`--run` is required on the test steps** — bare `vitest` enters watch mode; relying on `CI=true` detection alone is fragile.

### D6: Smoke suite excluded from CI

**Decision:** no step runs `pnpm test:smoke`.

`src/cms.smoke.test.ts` is `describe.skip`, needs `NOTION_TOKEN`/`NOTION_DB` secrets, and hits the live Notion API. Including it would make the workflow unrunnable on forks and introduce credential management. It is left as a follow-up, deliberately out of scope so the main gate stays secretless.

## Risks / Trade-offs

- **The `26.x` lane is unsupported and may break for reasons unrelated to this project** → `fail-fast: false` keeps it from blocking, and the floor is not widened to match it. A persistent `26.x` failure can be triaged without pressure to change `engines.node`.

- **Raising the floor breaks contributors still on Node 22** → acceptable: the package is private, the toolchain already required `^22.18.0`, and local development already runs Node 24. The commit message states the floor explicitly so the requirement is discoverable at the point of change.

- **Changing `engines.node` silently changes the bundle output** → the tasks require diffing `dist/` against the pre-change build and treating any difference as a defect requiring review, rather than committing an unexplained artifact change.

- **CI becomes a gate that can block unrelated work** → the workflow uses `continue-on-error` nowhere and is limited to 5 fast steps; the full suite runs in a few seconds locally, so a red build signals a real regression.

- **Two sources of truth for the Node version** (`.nvmrc` and `engines.node`) can drift → the spec requires the `.nvmrc` value to satisfy `engines.node`, and task verification checks it explicitly.

- **Fixing the out-of-scope Biome debt later will surface in CI** → accepted and documented: the `check` script only targets `src/`, so the 4 pre-existing diagnostics outside it stay invisible to the gate. This is a deliberate deferral, tracked as follow-up work.

## Migration Plan

1. Raise `engines.node` to `">=24.11.0"` in `package.json`
2. Run `pnpm install`; confirm no dependency version moves and no engine warnings appear
3. Run `pnpm build`; confirm the log now reports `target: node24.11.0`
4. Diff `dist/` against the pre-change build; expect no change, investigate any difference
5. Add `.nvmrc` with `24.21.0`
6. Add `.github/workflows/ci.yml`
7. Re-run `pnpm check`, `pnpm test:unit --run`, `pnpm test:integration --run` locally
8. Commit, then push and confirm the workflow runs green on the new branch

**Rollback:** revert the single commit. There is no data migration, no lockfile churn and no consumer impact, so rollback is complete and immediate.

## Open Questions

- Should a `packageManager` field be added to `package.json` so the pnpm version is declared in-repo rather than only in the workflow? Left out of scope here; it is a one-line follow-up that would also make local Corepack usage deterministic.
- Should the 4 out-of-scope Biome diagnostics be fixed and `check` widened beyond `src/` so the new CI gate covers the whole repo? Requires a decision on whether `examples/` should be linted as strictly as `src/`.
- Should the live-API smoke test become a scheduled credentialed job once valid `NOTION_TOKEN`/`NOTION_DB` are available? The existing `.env` dates from 2023 and the suite remains `describe.skip`.
