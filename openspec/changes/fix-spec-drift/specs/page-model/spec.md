## MODIFIED Requirements

### Requirement: PageStatus value object

The system SHALL provide an immutable `PageStatus` value object representing the publication status of a page.

- `PageStatus` SHALL be a finite set: `"draft"`, `"published"`, `"archived"`, `"development"`
- `PageStatus.create(value: string): PageStatus` SHALL accept only these four values
- `PageStatus.create()` SHALL throw for any other value

#### Scenario: Accepted status values

- **WHEN** `PageStatus.create("draft")`, `PageStatus.create("published")`, `PageStatus.create("archived")`, or `PageStatus.create("development")` is called
- **THEN** it SHALL return a `PageStatus` instance

#### Scenario: Reject invalid status

- **WHEN** `PageStatus.create("deleted")` is called
- **THEN** it SHALL throw
