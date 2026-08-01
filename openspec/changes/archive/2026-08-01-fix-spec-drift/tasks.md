## 1. Version bump

- [x] 1.1 Update `version` from `0.1.0` to `0.2.0` in `package.json`
- [x] 1.2 Confirm no other files (README, examples) reference the old version

## 2. Remove the redundant `development` status

- [x] 2.1 Remove `"development"` from `ALLOWED_STATUSES` in `src/domain/PageStatus.ts`
- [x] 2.2 Confirm no tests, fixtures, or examples reference the `development` status (grep)
- [x] 2.3 Confirm `PageStatus.test.ts` only asserts `draft`, `published`, `archived` — matching the archived `page-model` spec

## 3. msw-test-infrastructure spec reconciliation

- [x] 3.1 Confirm the delta spec at `specs/msw-test-infrastructure/spec.md` reproduces the archived requirements (already written)
- [x] 3.2 Verify the database-query handler method is documented as `POST` (not `GET`)

## 4. Verification

- [x] 4.1 Run `openspec validate` — all artifacts valid
- [x] 4.2 Run `pnpm test` — all tests pass
- [x] 4.3 Run `pnpm lint` — no errors
- [x] 4.4 Run `pnpm build` — compilation succeeds
- [x] 4.5 Archive the change to sync the `msw-test-infrastructure` spec into `openspec/specs/`
