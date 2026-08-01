# Test Suite Organization

## Purpose

TBD — Vitest workspace configuration and categorized test scripts that separate unit, integration, and smoke tests, plus nested `describe` organization for domain tests.

## Requirements

### Requirement: Vitest workspace projects

The system SHALL configure Vitest workspace with three projects that categorize tests by type.

- A `unit` project SHALL include `src/domain/**/*.test.ts`
- An `integration` project SHALL include `src/**/*.test.ts` but exclude `src/domain/**` and `**/*.smoke.test.ts`
- A `smoke` project SHALL include `src/**/*.smoke.test.ts`

#### Scenario: Run unit tests only

- **WHEN** `pnpm test:unit` is executed
- **THEN** only domain tests run (no integration, no smoke)

#### Scenario: Run integration tests only

- **WHEN** `pnpm test:integration` is executed
- **THEN** adapter and CMS tests run (no domain, no smoke)

### Requirement: Test scripts in package.json

The system SHALL provide npm scripts for each test category.

- `test:unit` SHALL run `vitest --project unit`
- `test:integration` SHALL run `vitest --project integration`
- `test:smoke` SHALL run `vitest --project smoke`
- `test` SHALL run `vitest` (all projects)

#### Scenario: Unit test script

- **WHEN** `pnpm test:unit` is run
- **THEN** Vitest runs with the `unit` project configuration

### Requirement: Domain tests organized by context

The system SHALL organize domain test files with nested `describe` blocks grouping tests by entity and method.

- Each domain entity SHALL have a top-level `describe("EntityName")`
- Each method SHALL have a nested `describe("methodName")`
- Each test name SHALL describe the expected outcome

#### Scenario: Test output readability

- **WHEN** running domain tests with `--reporter=verbose`
- **THEN** test names SHALL read like "StaticPage > create > rejects invalid slug"
