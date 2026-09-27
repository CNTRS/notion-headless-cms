# Continuous Integration

## Purpose

Define the CI workflow that verifies this project automatically on every push and pull request, and the properties that make that verification deterministic and secret-free.

## Requirements

### Requirement: CI workflow definition

The project SHALL define a CI workflow in `.github/workflows/ci.yml` that verifies the project on every push to the default branch and on every pull request.

- The workflow SHALL live at `.github/workflows/ci.yml`
- The workflow SHALL run on pull requests targeting the default branch
- The workflow SHALL not require any repository secret to pass

#### Scenario: Pull request triggers the workflow

- **WHEN** a pull request is opened or updated
- **THEN** the `verify` job SHALL be enqueued

#### Scenario: No credentialed secret is needed

- **WHEN** the workflow definition is inspected
- **THEN** no step SHALL reference `secrets.*`
- **AND** the workflow SHALL be runnable on a fork

### Requirement: Deterministic dependency installation

The CI workflow SHALL install dependencies with pnpm using a frozen lockfile, so that CI verifies the committed lockfile rather than silently resolving different versions.

- `pnpm/action-setup` SHALL run before `actions/setup-node`, because the latter's pnpm cache requires pnpm on `PATH`
- The pnpm version SHALL be pinned explicitly, since the project declares no `packageManager` field
- The install step SHALL use `--frozen-lockfile`

#### Scenario: Lockfile drift fails the run

- **GIVEN** `package.json` is modified without a matching `pnpm-lock.yaml` update
- **WHEN** CI runs `pnpm install --frozen-lockfile`
- **THEN** the step SHALL fail

#### Scenario: pnpm is available before the Node setup step caches

- **WHEN** the job steps are executed in order
- **THEN** `pnpm/action-setup` SHALL precede `actions/setup-node`

### Requirement: Verification steps

The CI workflow SHALL run the project's own verification commands, and SHALL pass only when all of them succeed.

- The workflow SHALL run `pnpm build` (which executes `tsc` typecheck followed by `tsdown`)
- The workflow SHALL run `pnpm check` (Biome in CI mode)
- The workflow SHALL run the unit test suite and the integration test suite
- Each test invocation SHALL be non-interactive (`--run`), because bare `vitest` enters watch mode
- The workflow SHALL NOT run the live-API smoke suite

#### Scenario: A broken type fails the run

- **WHEN** a commit introduces a type error
- **THEN** `pnpm build` SHALL fail
- **AND** the `verify` job SHALL be marked as failed

#### Scenario: A failing unit test fails the run

- **WHEN** a commit introduces a failing unit test
- **THEN** the unit test step SHALL fail
- **AND** the `verify` job SHALL be marked as failed

#### Scenario: Tests do not hang in watch mode

- **WHEN** the test steps run
- **THEN** each SHALL terminate after completing rather than waiting for input

#### Scenario: Credentialed smoke suite is not invoked

- **WHEN** the workflow steps are inspected
- **THEN** no step SHALL run `pnpm test:smoke`

### Requirement: Node version matrix

The CI workflow SHALL verify the project on more than one Node version, so that runtime regressions are detected before they reach the declared floor.

- The matrix SHALL include the current latest LTS major (`24.x`) and the next major (`26.x`)
- The matrix SHALL set `fail-fast: false`, so a failure on one version still reports the result of the other
- The matrix SHALL NOT widen the `engines.node` floor; `26.x` is an early-warning signal, not a supported version

#### Scenario: Both majors report independently

- **WHEN** the `26.x` job fails
- **THEN** the `24.x` job SHALL still run and report its own result

#### Scenario: Supported versions are declared once

- **WHEN** the matrix is compared with `engines.node`
- **THEN** `engines.node` SHALL remain `>=24.11.0`
- **AND** including `26.x` in the matrix SHALL NOT change the declared floor
