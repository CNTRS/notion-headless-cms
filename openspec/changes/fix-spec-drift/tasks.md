## 1. Version bump

- [ ] 1.1 Update `version` from `0.1.0` to `0.2.0` in `package.json`
- [ ] 1.2 Confirm no other files (README, examples) reference the old version

## 2. page-model spec reconciliation

- [ ] 2.1 Confirm the delta spec at `specs/page-model/spec.md` includes `development` in the `PageStatus` allowed values (already written)
- [ ] 2.2 Add acceptance test in `src/domain/__tests__/PageStatus.test.ts` asserting `PageStatus.create("development")` returns an instance

## 3. msw-test-infrastructure spec reconciliation

- [ ] 3.1 Confirm the delta spec at `specs/msw-test-infrastructure/spec.md` reproduces the archived requirements (already written)
- [ ] 3.2 Verify the database-query handler method is documented as `POST` (not `GET`)

## 4. Verification

- [ ] 4.1 Run `openspec validate` — all artifacts valid
- [ ] 4.2 Run `pnpm test` — all tests pass (no behavior change)
- [ ] 4.3 Run `pnpm lint` — no errors
- [ ] 4.4 Run `pnpm build` — compilation succeeds
- [ ] 4.5 Archive the change to sync both specs into `openspec/specs/`
