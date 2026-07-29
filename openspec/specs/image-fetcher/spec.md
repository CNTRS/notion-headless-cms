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

### Requirement: HttpImageFetcher implements IImageFetcher

The system SHALL provide an `HttpImageFetcher` class that implements `IImageFetcher` by using the global `fetch` API.

- `HttpImageFetcher.fetch(url: string): Promise<Buffer>` SHALL call `fetch(url)` to download the image
- The response SHALL be converted to a `Buffer` using `Buffer.from(await response.arrayBuffer())`
- Failed HTTP requests SHALL throw an error with the URL and status code

#### Scenario: Successful fetch

- **WHEN** `fetch("https://example.com/image.jpg")` is called and the server responds with 200
- **THEN** it SHALL return a `Buffer` containing the image bytes

#### Scenario: Failed fetch

- **WHEN** `fetch("https://example.com/image.jpg")` is called and the server responds with 404
- **THEN** it SHALL throw an error containing the URL and status code
