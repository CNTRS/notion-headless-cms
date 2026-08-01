## 1. Version bump

- [ ] 1.1 Update `version` from `0.1.0` to `0.2.0` in `package.json`
- [ ] 1.2 Confirm no other files (README, examples) reference the old version

## 2. Remove the redundant `development` status

- [ ] 2.1 Remove `"development"` from `ALLOWED_STATUSES` in `src/domain/PageStatus.ts`
- [ ] 2.2 Confirm no tests, fixtures, or examples reference the `development` status (grep)
- [ ] 2.3 Confirm `PageStatus.test.ts` only asserts `draft`, `published`, `archived` — matching the archived `page-model` spec
- [ ] 2.4 Delete the obsolete delta spec `specs/page-model/spec.md` from the change

## 3. msw-test-infrastructure spec reconciliation

- [ ] 3.1 Confirm the delta spec at `specs/msw-test-infrastructure/spec.md` reproduces the archived requirements (already written)
- [ ] 3.2 Verify the database-query handler method is documented as `POST` (not `GET`)

## 4. Verification

- [ ] 4.1 Run `openspec validate` — all artifacts valid
- [ ] 4.2 Run `pnpm test` — all tests pass
- [ ] 4.3 Run `pnpm lint` — no errors
- [ ] 4.4 Run `pnpm build` — compilation succeeds
- [ ] 4.5 Archive the change to sync the `msw-test-infrastructure` spec into `openspec/specs/`
