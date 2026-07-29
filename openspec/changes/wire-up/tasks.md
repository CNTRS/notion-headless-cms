## 1. Refactor NotionCMS

- [x] 1.1 Change constructor to receive `IPageRepository` and `IImageFetcher`
- [x] 1.2 Update `listPages()` to delegate to `repository.listPages()` returning `StaticPage[]`
- [x] 1.3 Update `getPage()` to delegate to `repository.getPage()` returning `StaticPage | null`
- [x] 1.4 Update `getPageContent()` to delegate to `repository.getPageBlocks()` returning `PageBlock[]`
- [x] 1.5 Implement `getPageWithContent()` orchestration: page + blocks + image processing + list grouping
- [ ] 1.6 Implement `getAllPagesContent()` orchestration: iterate pages, process each
- [ ] 1.7 Extract private `processBlocks(blocks: PageBlock[]): Promise<PageBlock[]>` helper for image download + transform + grouping
- [ ] 1.8 Remove `INotionCMS` interface
- [ ] 1.9 Remove `TNotionCMSOptions` and related unused types (`TTimestampPropertyConfig`, `TSlugPropertyConfig`, `TStatusPropertyConfig`)
- [ ] 1.10 Remove `TNotionPage` and `TNotionEntryId` types

## 2. Rewrite main.ts

- [ ] 2.1 Wire composition root: create `Client`, `NotionPageRepository`, `HttpImageFetcher`, `NotionCMS`
- [ ] 2.2 Export `NotionCMS` class for consumers (not a pre-wired instance — keep flexibility)

## 3. Delete old helpers

- [ ] 3.1 Delete `src/helpers.ts`
- [ ] 3.2 Delete `src/helpers.mocks.ts`
- [ ] 3.3 Delete `src/helpers.test.ts`

## 4. Update tests

- [ ] 4.1 Update `src/cms.test.ts` to use new constructor signature
- [ ] 4.2 Update all test references to removed types

## 5. Update example

- [ ] 5.1 Update `examples/fetch-and-store.ts` for new constructor and return types

## 6. Verification

- [ ] 6.1 Run `pnpm test` — all tests pass
- [ ] 6.2 Run `pnpm lint` — no errors
- [ ] 6.3 Run `pnpm build` — compilation succeeds
- [ ] 6.4 Verify example runs (requires `.env`)
