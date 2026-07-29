## 1. NotionPageRepository

- [x] 1.1 Create `src/infrastructure/NotionPageRepository.ts` implementing `IPageRepository`
- [x] 1.2 Implement `listPages()` — call `client.databases.query()`, map results to `StaticPage[]`
- [x] 1.3 Implement `getPage()` — call `client.pages.retrieve()`, map to `StaticPage | null`
- [x] 1.4 Implement `getPageBlocks()` — paginated `client.blocks.children.list()`, map to `PageBlock[]`
- [x] 1.5 Build Notion-to-domain type mapping helper (properties → StaticPage)
- [x] 1.6 Build Notion-to-domain block mapping helper (block → PageBlock)

## 2. HttpImageFetcher

- [x] 2.1 Create `src/infrastructure/HttpImageFetcher.ts` implementing `IImageFetcher`
- [ ] 2.2 Implement `fetch()` using global `fetch` + `Buffer.from(arrayBuffer)`

## 3. MSW test infrastructure

- [ ] 3.1 Install `msw` dev dependency
- [ ] 3.2 Create `src/test/msw/server.ts` — shared MSW server
- [ ] 3.3 Create `src/test/msw/handlers.ts` — handlers for Notion endpoints

## 4. API fixtures para MSW

- [ ] 4.1 Create `src/test/msw/fixtures/` directory
- [ ] 4.2 Copy `openspec/changes/infrastructure-repository/fixtures/*.json` → `src/test/msw/fixtures/`

## 5. Adapter tests

- [ ] 5.1 Create `src/infrastructure/__tests__/NotionPageRepository.test.ts` with MSW-based tests
- [ ] 5.2 Test: list pages returns mapped StaticPage[]
- [ ] 5.3 Test: getPage returns mapped StaticPage for existing ID
- [ ] 5.4 Test: getPage returns null for missing ID
- [ ] 5.5 Test: getPageBlocks handles pagination
- [ ] 5.6 Create `src/infrastructure/__tests__/HttpImageFetcher.test.ts`
- [ ] 5.7 Test: fetch returns Buffer for successful response
- [ ] 5.8 Test: fetch throws on HTTP error

## 6. Infrastructure index

- [ ] 6.1 Create `src/infrastructure/index.ts` re-exporting adapters

## 7. Verification

- [ ] 7.1 Run `pnpm test` — all new and old tests pass
- [ ] 7.2 Run `pnpm lint` — no errors
- [ ] 7.3 Run `pnpm build` — compilation succeeds
