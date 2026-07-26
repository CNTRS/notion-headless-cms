## 1. Domain errors

- [x] 1.1 Create `src/domain/errors.ts` with `InvalidSlugError`, `InvalidPageIdError`, `InvalidPageStatusError`, `InvalidTagError` extending `Error`

## 2. Value Objects

- [x] 2.1 Implement `PageId` with UUID validation, `equals()`, `toString()`, and tests
- [x] 2.2 Implement `Slug` with regex validation, `equals()`, and tests
- [x] 2.3 Implement `PageStatus` with allowed values (`draft`, `published`, `archived`) and tests
- [x] 2.4 Implement `Tag` with non-empty validation and tests
- [x] 2.5 Implement `RichText` with `content`, formatting annotations, and tests

## 3. Block model

- [x] 3.1 Define `PageBlock` discriminated union type with all supported block member types
- [x] 3.2 Define `TextBlock`, `HeadingBlock`, `ImageBlock`, `CalloutBlock`, `BulletedList`, `NumberedList`, `VideoBlock`, `CodeBlock`, `QuoteBlock`, `DividerBlock` types
- [x] 3.3 Define `ListItem` type for list item content
- [x] 3.4 Add tests verifying exhaustive type narrowing and construction

## 4. StaticPage entity

- [x] 4.1 Implement `StaticPage` with private constructor and `static create()` factory
- [ ] 4.2 Implement `withContent()` method returning a new instance
- [ ] 4.3 Implement `equals()` based on `PageId`
- [ ] 4.4 Create `StaticPageBuilder` fluent builder in `src/domain/__tests__/builders/`
- [ ] 4.5 Write tests for `StaticPage.create()`, validation, `withContent()`, `equals()`

## 5. ImageTransform

- [ ] 5.1 Implement `ImageTransform.process(buffer: Buffer): ImageMeta` — synchronous, pure
- [ ] 5.2 Write tests with known image buffers verifying base64, dimensions, format

## 6. PageBlockTransformer

- [ ] 6.1 Implement `PageBlockTransformer.groupConsecutiveItems(blocks: PageBlock[]): PageBlock[]`
- [ ] 6.2 Write tests covering: consecutive grouping, non-consecutive preservation, non-list passthrough, separate list type handling, idempotence

## 7. Domain index

- [ ] 7.1 Create `src/domain/index.ts` re-exporting all public types and functions

## 8. Verification

- [ ] 8.1 Run `pnpm test` to confirm all new + existing tests pass
- [ ] 8.2 Run `pnpm lint` to confirm no lint errors
- [ ] 8.3 Run `pnpm build` to confirm compilation succeeds
