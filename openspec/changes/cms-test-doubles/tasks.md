## 1. Fake implementations

- [x] 1.1 Create `FakePageRepository` with in-memory `Map` storage, seeded via constructor
- [x] 1.2 Create `FakeImageFetcher` returning a small valid JPEG buffer for any URL

## 2. Rewrite cms.test.ts

- [x] 2.1 Rewrite `cms.test.ts` to use `FakePageRepository` and `FakeImageFetcher`
- [x] 2.2 Test: `listPages()` returns seeded pages
- [x] 2.3 Test: `getPage()` returns page or null
- [x] 2.4 Test: `getPageContent()` returns blocks from fake
- [x] 2.5 Test: `getPageWithContent()` processes images — verifies base64, width, height, format
- [x] 2.6 Test: `getPageWithContent()` groups consecutive list items
- [x] 2.7 Test: `getAllPagesContent()` processes all pages

## 3. Smoke test (optional)

- [x] 3.1 Create `src/cms.smoke.test.ts` — exercises real Notion API, marked `test.skip`
- [x] 3.2 Verify smoke runs manually with `.env`

## 4. Verification

- [x] 4.1 Run `pnpm test` — all tests pass without `.env`
- [x] 4.2 Run `pnpm lint` — no errors
- [x] 4.3 Run `pnpm build` — compilation succeeds
