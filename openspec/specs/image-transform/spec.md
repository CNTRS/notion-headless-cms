# Image Transform

## Purpose

Define the module that processes raw image buffers into Base64-encoded data with extracted dimensions and format. TBD — initial requirements imported from `domain-core` change.

## Requirements

### Requirement: Image transformation

The system SHALL provide a pure synchronous `ImageTransform` module that processes raw image buffers.

- `ImageTransform.process(buffer: Buffer): ImageMeta` SHALL accept a `Buffer` of an image file and return `{ base64: string, width: number, height: number, format: string }`
- The `base64` field SHALL be the standard Base64-encoded representation of the buffer
- `width` and `height` SHALL be the pixel dimensions of the image, extracted using the `image-size` library
- `format` SHALL be the detected MIME/image type (e.g., `"jpg"`, `"png"`, `"gif"`)
- The function SHALL be synchronous — no async, no I/O, no side effects

#### Scenario: Process JPEG buffer

- **WHEN** `ImageTransform.process(jpegBuffer)` is called with a valid JPEG buffer
- **THEN** it SHALL return an object with `base64` (non-empty string), `width` (positive integer), `height` (positive integer), `format` (string equal to detected format)

#### Scenario: Process PNG buffer

- **WHEN** `ImageTransform.process(pngBuffer)` is called with a valid PNG buffer
- **THEN** it SHALL return an object with the correct PNG dimensions and `format: "png"`
