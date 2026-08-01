# Property-Based Block Testing

## Purpose

TBD — Property-based tests verifying invariants of `PageBlockTransformer.groupConsecutiveItems()` using `fast-check`.

## Requirements

### Requirement: Property-based tests for PageBlockTransformer

The system SHALL use property-based testing to verify invariants of `PageBlockTransformer.groupConsecutiveItems()`.

- The following property SHALL be tested: **idempotence** — applying the function twice produces the same result as applying it once
- The generator SHALL produce arrays of mixed block types (paragraph, heading, bulleted_list_item, numbered_list_item, callout, image, video)
- The test SHALL run at least 100 generated cases

#### Scenario: Idempotence property

- **WHEN** `groupConsecutiveItems(groupConsecutiveItems(blocks))` is called for any generated block array
- **THEN** the result SHALL equal `groupConsecutiveItems(blocks)`

### Requirement: Property-based test for sorted output structure

The system SHALL verify that after grouping, no consecutive `bulleted_list_item` or `numbered_list_item` blocks remain at the top level.

#### Scenario: No orphaned consecutive list items

- **WHEN** `groupConsecutiveItems(blocks)` is called with any generated block array
- **THEN** the result SHALL NOT contain two consecutive top-level blocks of `type === "bulleted_list_item"` or `type === "numbered_list_item"`
