## 1. IPageRepository

- [x] 1.1 Create `src/ports/IPageRepository.ts` with `listPages()`, `getPage()`, `getPageBlocks()` methods using domain types only

## 2. IImageFetcher

- [ ] 2.1 Create `src/ports/IImageFetcher.ts` with `fetch(url: string): Promise<Buffer>` method

## 3. Ports index

- [ ] 3.1 Create `src/ports/index.ts` re-exporting both interfaces

## 4. Verification

- [ ] 4.1 Run `pnpm test` to confirm all tests pass
- [ ] 4.2 Run `pnpm lint` to confirm no lint errors
- [ ] 4.3 Run `pnpm build` to confirm compilation
