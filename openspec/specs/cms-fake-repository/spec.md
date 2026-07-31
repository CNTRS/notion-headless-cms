# CMS Fake Repository

## Purpose

TBD — Test doubles for the CMS domain ports (`IPageRepository`, `IImageFetcher`) to run tests without a live Notion API.

## Requirements

### Requirement: FakePageRepository

The system SHALL provide a `FakePageRepository` class implementing `IPageRepository` for use in tests.

- `FakePageRepository` SHALL accept seed data via constructor or builder methods
- `listPages()` SHALL return all seeded `StaticPage` instances
- `getPage(id)` SHALL return the matching `StaticPage` or `null`
- `getPageBlocks(id)` SHALL return the seeded `PageBlock[]` for that page

#### Scenario: List seeded pages

- **WHEN** `FakePageRepository` is seeded with 3 pages and `listPages()` is called
- **THEN** it SHALL return all 3 pages

#### Scenario: Get existing page

- **WHEN** `getPage(existingId)` is called
- **THEN** it SHALL return the matching `StaticPage`

#### Scenario: Get missing page

- **WHEN** `getPage(missingId)` is called
- **THEN** it SHALL return `null`

### Requirement: FakeImageFetcher

The system SHALL provide a `FakeImageFetcher` class implementing `IImageFetcher` for use in tests.

- `FakeImageFetcher.fetch(url: string): Promise<Buffer>` SHALL return a predefined valid image `Buffer` for any URL
- The returned `Buffer` SHALL be a small valid JPEG or PNG image that `ImageTransform.process()` can decode

#### Scenario: Fetch returns predefined buffer

- **WHEN** `fetch("any-url")` is called
- **THEN** it SHALL return a `Buffer` that `ImageTransform.process()` successfully decodes
