## ADDED Requirements

### Requirement: Consecutive list item grouping

The system SHALL provide a pure synchronous `PageBlockTransformer` module that groups consecutive list item blocks into list containers.

- `PageBlockTransformer.groupConsecutiveItems(blocks: PageBlock[]): PageBlock[]` SHALL transform consecutive `bulleted_list_item` blocks into a single `BulletedList` container block
- It SHALL likewise group consecutive `numbered_list_item` blocks into a single `NumberedList` container block
- Non-list blocks SHALL pass through unchanged
- The function SHALL be idempotent: applying it twice SHALL produce the same result as applying it once
- The function SHALL be pure: same input ALWAYS produces the same output; no side effects

#### Scenario: Group consecutive bulleted items

- **WHEN** given `[paragraph, bulletA, bulletB, paragraph]` where `bulletA` and `bulletB` are consecutive `bulleted_list_item`
- **THEN** it SHALL return `[paragraph, BulletedList(items: [bulletA, bulletB]), paragraph]`

#### Scenario: Preserve non-consecutive list items

- **WHEN** given `[bulletA, paragraph, bulletB]` where `bulletA` and `bulletB` are not consecutive
- **THEN** it SHALL return `[BulletedList(items: [bulletA]), paragraph, BulletedList(items: [bulletB])]`

#### Scenario: Preserve non-list blocks

- **WHEN** given `[heading_1, paragraph, callout]`
- **THEN** it SHALL return the same blocks unchanged

#### Scenario: Handle numbered lists separately

- **WHEN** given `[bulletA, numberedB, numberedC, paragraph]`
- **THEN** it SHALL return `[BulletedList(items: [bulletA]), NumberedList(items: [numberedB, numberedC]), paragraph]`

#### Scenario: Idempotence

- **WHEN** `groupConsecutiveItems` is applied to any block array twice
- **THEN** the result of the second application SHALL equal the result of the first
