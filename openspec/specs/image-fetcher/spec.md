# Image Fetcher

## Purpose

TBD — Port adapter for downloading image data from URLs via an `IImageFetcher` interface.

## Requirements

### Requirement: IImageFetcher interface

The system SHALL provide an `IImageFetcher` interface for downloading image data from URLs.

- `IImageFetcher` SHALL define the following method:
  - `fetch(url: string): Promise<Buffer>` — downloads the image at the given URL and returns its raw bytes
- The interface SHALL NOT define any other methods

#### Scenario: Fetch image by URL

- **WHEN** `fetch("https://example.com/image.jpg")` is called
- **THEN** it SHALL return a `Buffer` containing the raw image bytes

### Requirement: Interface isolation from Node.js APIs

The system SHALL ensure that `IImageFetcher` does not reference any Node.js or browser I/O types in its interface definition (beyond `Promise<Buffer>` which is standard).

- The interface SHALL only depend on standard TypeScript types and types from `src/domain/`

#### Scenario: Minimal contract

- **WHEN** inspecting `IImageFetcher` imports
- **THEN** no Node.js-specific types (`fetch`, `http`, `fs`) SHALL be present in the file's imports
