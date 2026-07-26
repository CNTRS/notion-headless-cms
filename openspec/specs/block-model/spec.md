# Block Model

## Purpose

Define the domain types for Notion content blocks and rich text. TBD — initial requirements imported from `domain-core` change.

## Requirements

### Requirement: PageBlock discriminated union

The system SHALL provide a `PageBlock` type as a discriminated union of all supported block types, each identified by a literal `type` field.

- `PageBlock` SHALL be defined as `type PageBlock = TextBlock | HeadingBlock | ImageBlock | BulletedList | NumberedList | CalloutBlock | VideoBlock | CodeBlock | QuoteBlock | DividerBlock` (and future types)
- Each member type SHALL have a discriminant `type: "<block-name>"` literal field
- Switching on `block.type` SHALL provide exhaustive type narrowing

#### Scenario: Exhaustive type narrowing

- **WHEN** a function switches over `pageBlock.type`
- **THEN** the compiler SHALL flag any unhandled block types

### Requirement: TextBlock

The system SHALL provide a `TextBlock` type for paragraph content.

- `TextBlock` SHALL have `type: "text"` and `richText: RichText[]`

#### Scenario: Create text block

- **WHEN** constructing a `TextBlock` with rich text content
- **THEN** it SHALL have `type: "text"` and the provided rich text

### Requirement: HeadingBlock

The system SHALL provide a `HeadingBlock` type for heading content.

- `HeadingBlock` SHALL have `type: "heading_1" | "heading_2" | "heading_3"` and `richText: RichText[]`

#### Scenario: Create heading block

- **WHEN** constructing a `HeadingBlock` with `type: "heading_1"`
- **THEN** it SHALL have the heading level and provided rich text

### Requirement: ImageBlock

The system SHALL provide an `ImageBlock` type for image content.

- `ImageBlock` SHALL have `type: "image"`, `url: string`, and `alt?: string`
- After image processing, it SHALL also carry `base64: string`, `width: number`, `height: number`, `format: string`

#### Scenario: Image block before processing

- **WHEN** constructing an `ImageBlock` with a URL
- **THEN** it SHALL have `type: "image"` and the URL, with optional `alt`

### Requirement: CalloutBlock

The system SHALL provide a `CalloutBlock` type for callout/quote blocks.

- `CalloutBlock` SHALL have `type: "callout"`, `richText: RichText[]`, and `icon?: string`

#### Scenario: Create callout block

- **WHEN** constructing a `CalloutBlock` with rich text and an emoji icon
- **THEN** it SHALL have `type: "callout"` and the provided content

### Requirement: BulletedList and NumberedList

The system SHALL provide `BulletedList` and `NumberedList` types representing grouped consecutive list items.

- `BulletedList` SHALL have `type: "bulleted_list"` and `items: ListItem[]`
- `NumberedList` SHALL have `type: "numbered_list"` and `items: ListItem[]`
- `ListItem` SHALL have `richText: RichText[]`

#### Scenario: Create bulleted list

- **WHEN** constructing a `BulletedList` with two list items
- **THEN** it SHALL have `type: "bulleted_list"` and both items

### Requirement: RichText value object

The system SHALL provide an immutable `RichText` value object representing formatted text content.

- `RichText` SHALL contain `content: string`, `bold?: boolean`, `italic?: boolean`, `strikethrough?: boolean`, `underline?: boolean`, `code?: boolean`, `color?: string`, `href?: string`

#### Scenario: Create plain rich text

- **WHEN** `RichText.create({ content: "Hello" })` is called
- **THEN** it SHALL have content "Hello" and all formatting flags default to false
