## 1. Fake implementations

- [x] 1.1 Create `FakePageRepository` with in-memory `Map` storage, seeded via constructor
- [x] 1.2 Create `FakeImageFetcher` returning a small valid JPEG buffer for any URL

## 2. Rewrite cms.test.ts

- [ ] 2.1 Rewrite `cms.test.ts` to use `FakePageRepository` and `FakeImageFetcher`
- [ ] 2.2 Test: `listPages()` returns seeded pages
- [ ] 2.3 Test: `getPage()` returns page or null
- [ ] 2.4 Test: `getPageContent()` returns blocks from fake
- [ ] 2.5 Test: `getPageWithContent()` processes images — verifies base64, width, height, format
- [ ] 2.6 Test: `getPageWithContent()` groups consecutive list items
- [ ] 2.7 Test: `getAllPagesContent()` processes all pages

## 3. Smoke test (optional)

- [ ] 3.1 Create `src/cms.smoke.test.ts` — exercises real Notion API, marked `test.skip`
- [ ] 3.2 Verify smoke runs manually with `.env`

## 4. Verification

- [ ] 4.1 Run `pnpm test` — all tests pass without `.env`
- [ ] 4.2 Run `pnpm lint` — no errors
- [ ] 4.3 Run `pnpm build` — compilation succeeds
