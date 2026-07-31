# CMS Unit Tests

## Purpose

TBD — Unit tests for `NotionCMS` using fakes instead of the real Notion API.

## Requirements

### Requirement: NotionCMS tests with fakes

The system SHALL test `NotionCMS` using `FakePageRepository` and `FakeImageFetcher` instead of the real Notion API.

- All tests SHALL run without `.env` or network access
- Each test SHALL create a fresh `FakePageRepository` and `FakeImageFetcher` for isolation

#### Scenario: List pages returns seeded pages

- **WHEN** `cms.listPages()` is called with a fake repository seeded with 2 pages
- **THEN** it SHALL return those 2 pages

#### Scenario: Get page returns null for missing ID

- **WHEN** `cms.getPage(nonExistentId)` is called
- **THEN** it SHALL return `null`

#### Scenario: Get page with content processes images

- **WHEN** `cms.getPageWithContent(pageWithImageId)` is called and the fake image fetcher returns a valid JPEG buffer
- **THEN** the returned `StaticPage` SHALL have its image block with `base64`, `width`, `height`, and `format` populated

#### Scenario: Get all pages content orchestrates all pages

- **WHEN** `cms.getAllPagesContent()` is called with 3 pages seeded
- **THEN** it SHALL return 3 `StaticPage` instances, each with processed content

### Requirement: Smoke test (optional, skipped by default)

The system MAY provide a smoke test that exercises the real `NotionPageRepository` against the actual Notion API.

- The smoke test SHALL be marked with `.skip` by default
- The smoke test SHALL require `.env` with `NOTION_TOKEN` and `NOTION_DB`

#### Scenario: Smoke test structure

- **WHEN** running `pnpm test:smoke` with valid `.env`
- **THEN** the smoke test SHALL run and verify a real Notion API call
