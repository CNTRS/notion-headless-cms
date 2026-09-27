## 1. Capture the pre-change baseline

- [x] 1.1 Record the current `dist/` output so it can be diffed after the `engines.node` change: run `pnpm build` and save `git diff --stat` output showing a clean tree (baseline kept outside the repo tree, since `dist` is gitignored: sha256 `ebb831b4…` for `notion-headless-cms.d.mts` and `93ef8227…` for `notion-headless-cms.mjs`; `git diff --stat` and `git status --short` both empty)
- [x] 1.2 Confirm the current build target by reading the `target:` line from the `pnpm build` log (expected: `node22.12.0`) — the build log reports `ℹ target: node22.12.0`, derived by `tsdown` from the current `engines.node` of `>=22.12.0`
- [x] 1.3 Confirm the full local suite is green on Node 24 before changing anything: `pnpm check`, `pnpm test:unit --run`, `pnpm test:integration --run` (expected: 94 unit + 40 integration passing) — verified on `node -v` = `v24.12.0` / `pnpm -v` = `10.34.1`: `biome ci src/` checked 58 files with no diagnostics, 94 unit tests passed (11 files), 40 integration tests passed (10 files); `pnpm build` still reports `target: node22.12.0` and the `dist/` shas match the 1.1 baseline (`ebb831b4…` / `93ef8227…`)

## 2. Raise the declared Node floor

- [ ] 2.1 Change `engines.node` from `">=22.12.0"` to `">=24.11.0"` in `package.json` (use `24.11.0`, not `24` — see design D1)
- [ ] 2.2 Run `pnpm install` and confirm no dependency versions changed in `pnpm-lock.yaml` and no unsupported-engine warnings were emitted
- [ ] 2.3 Run `pnpm build` and confirm the log now reports `target: node24.11.0`
- [ ] 2.4 Verify the floor satisfies the build toolchain: confirm `tsdown@0.23.0` and `rolldown-plugin-dts@0.28.6` (both `^22.18.0 || ^24.11.0 || >=26.0.0`) accept `>=24.11.0`
- [ ] 2.5 Diff `dist/` against the baseline from task 1.1 — expect no change since the source is ES2020; if `dist/` differs, STOP and investigate before continuing

## 3. Pin the developer Node version

- [ ] 3.1 Create `.nvmrc` containing `24.21.0` (exact patch, not the `24` major)
- [ ] 3.2 Verify the pinned version satisfies `engines.node` — `24.21.0 >= 24.11.0`
- [ ] 3.3 Confirm `.nvmrc` is not gitignored (`git check-ignore .nvmrc` should report nothing)

## 4. Add the CI workflow

- [ ] 4.1 Create `.github/workflows/ci.yml` triggering on pull requests and pushes to the default branch
- [ ] 4.2 Add the `verify` job on `ubuntu-latest` with `strategy.fail-fast: false` and `matrix.node: ['24.x', '26.x']`
- [ ] 4.3 Add the steps in this order: `actions/checkout@v5`, `pnpm/action-setup@v4` (with `version: 10.34.1`), `actions/setup-node@v5` (with `node-version: ${{ matrix.node }}` and `cache: pnpm`)
- [ ] 4.4 Add the verification steps: `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm check`, `pnpm test:unit --run`, `pnpm test:integration --run`
- [ ] 4.5 Confirm the workflow references no `secrets.*` and contains no `pnpm test:smoke` step
- [ ] 4.6 Validate the YAML parses and assert the `pnpm/action-setup` step precedes `actions/setup-node` in the step list

## 5. Final verification

- [ ] 5.1 Run `pnpm build` — compilation succeeds
- [ ] 5.2 Run `pnpm check` — Biome reports no diagnostics in `src/`
- [ ] 5.3 Run `pnpm test:unit --run` — 94 tests pass
- [ ] 5.4 Run `pnpm test:integration --run` — 40 tests pass
- [ ] 5.5 Run `git status --short` and confirm the change set is exactly: `package.json`, `.nvmrc` (new), `.github/workflows/ci.yml` (new)
- [ ] 5.6 Commit and push, then confirm the workflow runs green on both matrix legs
