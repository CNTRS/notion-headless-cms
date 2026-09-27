## Why

`engines.node` declares `">=22.12.0"`, but that floor is **wrong**: `tsdown@0.23.0` and `rolldown-plugin-dts@0.28.6` both require `^22.18.0`, so the range advertises Node 22.12.0–22.17.x as supported when the build toolchain rejects it. Meanwhile the team already develops on Node 24.12.0, so the declaration understates reality rather than constraining it.

The gap is only visible because there is **no CI at all** — no `.github/workflows`, nothing that runs `build` or the test suites on a commit. A broken build or a lockfile/manifest drift can land unnoticed, and that is exactly the class of problem the `engines` misdeclaration represents.

Node 24 ("Krypton") is the current Latest LTS; Node 26 is still `Current` and is not yet an LTS release, so 24 is the right target. Since the package is `private: true` with no external consumers, dropping Node 22 costs nothing.

## What Changes

- **BREAKING**: Change `engines.node` from `">=22.12.0"` to `">=24.11.0"`, dropping Node 22. The package is `private: true`, so no published consumer is affected
- Move the build target from `node22.12.0` to `node24.11.0` as a consequence: `tsdown` derives its rolldown target from the *minimum* of `engines.node`. The floor is `24.11.0` rather than `24` deliberately — declaring `">=24"` would emit `target: node24.0.0`, which is below what `tsdown` itself requires
- Add a `.nvmrc` pinned to `24.21.0` (latest LTS at time of writing) so every developer and CI run resolves to the same Node version
- Add `.github/workflows/ci.yml` running `install` (frozen lockfile), `build`, `check`, `test:unit` and `test:integration` on a `24.x` / `26.x` matrix, with `fail-fast: false`
- The `26.x` lane is an early-warning signal for the next LTS, not a supported version — `engines.node` remains `">=24.11.0"`
- No changes to `src/`, the domain model, ports, or any existing spec requirement

## Capabilities

### New Capabilities

- `node-runtime-baseline`: The declared Node floor in `engines.node` and the developer-pinned version in `.nvmrc`, including the rule that the floor must be at least what the build toolchain requires
- `continuous-integration`: The CI workflow that gates every push and pull request by running the build, lint and test suites on a supported Node matrix

### Modified Capabilities

_(none — no existing capability's requirements change. The domain model, ports and test infrastructure are untouched.)_

## Impact

- `package.json` — `engines.node` floor raised to `>=24.11.0`
- `.nvmrc` (new) — pins `24.21.0`
- `.github/workflows/ci.yml` (new) — CI gate, 2-way Node matrix
- `dist/notion-headless-cms.mjs` / `dist/notion-headless-cms.d.mts` — regenerated with `target: node24.11.0`. The source is ES2020 and uses no post-ES2020 syntax, so the emitted bundle is expected to be byte-identical; any diff must be reviewed before proceeding
- `pnpm-lock.yaml` — expected to be unchanged; no dependency version moves
- No changes to `src/`, `biome.json`, `tsconfig.json`, `tsdown.config.ts` or `vitest.config.ts`

### Explicitly out of scope

- Fixing the 4 pre-existing Biome diagnostics outside `src/` (`examples/fetch-and-store.ts` `useNodejsImportProtocol`, missing trailing newline in `package.json`, `codegraph.json` trailing comma, `.opencode/package.json` indent). The project `check`/`lint` scripts only target `src/`, so these are invisible to the new CI gate
- Un-skipping the live-API smoke test (`src/cms.smoke.test.ts` is `describe.skip` and needs `NOTION_TOKEN`/`NOTION_DB` secrets). Wiring it as a separate credentialed job is a follow-up
