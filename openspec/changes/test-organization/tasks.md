## 1. Vitest workspace config

- [x] 1.1 Create `vitest.workspace.ts` with 3 projects: `unit`, `integration`, `smoke`
- [x] 1.2 Update `package.json` scripts: add `test:unit`, `test:integration`, `test:smoke`

## 2. Reorganize domain tests

- [x] 2.1 Add nested `describe("EntityName")` / `describe("methodName")` in all domain test files
- [x] 2.2 Ensure test names describe the expected outcome

## 3. Property-based tests

- [x] 3.1 Install `fast-check` dev dependency
- [x] 3.2 Add idempotence property test for `PageBlockTransformer.groupConsecutiveItems()`
- [x] 3.3 Add "no orphaned consecutive list items" property test

## 4. Builder refinement

- [x] 4.1 Review `StaticPageBuilder` — add convenience methods if missing (`.withDefaultContent()`, etc.)
- [ ] 4.2 Ensure all domain tests use the builder instead of ad-hoc construction

## 5. Verification

- [ ] 5.1 Run `pnpm test:unit` — only domain tests run
- [ ] 5.2 Run `pnpm test:integration` — only non-domain tests run
- [ ] 5.3 Run `pnpm test` — all tests pass
- [ ] 5.4 Run `pnpm lint` — no errors
- [ ] 5.5 Run `pnpm build` — compilation succeeds
