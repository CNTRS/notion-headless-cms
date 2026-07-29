## ADDED Requirements

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
