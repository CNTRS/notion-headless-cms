# Node Runtime Baseline

## Purpose

Define the minimum supported Node.js runtime for this project, the guarantee that the build toolchain is satisfied by that minimum, and the version developers pin locally.

## Requirements

### Requirement: Declared Node runtime floor

The project SHALL declare its minimum supported Node.js version in the `engines.node` field of `package.json`, and that floor SHALL be `>=24.11.0`.

- The floor SHALL exclude Node 22
- The floor SHALL be a `>=` range, not a `^` range, so that future Node majors are not silently excluded
- The floor SHALL be stated to patch precision, because `tsdown` derives the bundle target from the *minimum* of this range

#### Scenario: Node 24 at or above the floor is accepted

- **WHEN** a runtime resolves `engines.node` against Node `24.11.0` or any later release
- **THEN** the range SHALL be satisfied

#### Scenario: Node 24 below the floor is rejected

- **WHEN** a runtime resolves `engines.node` against Node `24.10.0`
- **THEN** the range SHALL NOT be satisfied

#### Scenario: Node 22 is rejected

- **WHEN** a runtime resolves `engines.node` against any Node 22 release
- **THEN** the range SHALL NOT be satisfied

### Requirement: Floor satisfies the build toolchain

The `engines.node` floor SHALL be at least as restrictive as the version requirements of the packages that build and bundle the project, so that the declared range never advertises a runtime the toolchain would reject.

- Every build-critical dependency (`tsdown`, `rolldown-plugin-dts`, `rolldown`, `dts-resolver`) SHALL be satisfied by the declared floor
- The floor SHALL NOT be lower than the lowest `^`/`>=` bound any build-critical dependency requires

#### Scenario: Current toolchain accepts the declared floor

- **GIVEN** the installed `tsdown` and `rolldown-plugin-dts`
- **WHEN** their `engines.node` ranges are evaluated against the declared floor
- **THEN** both ranges SHALL be satisfied

#### Scenario: A coarser floor would fall below the toolchain requirement

- **GIVEN** the floor is expressed as `>=24` rather than `>=24.11.0`
- **WHEN** the minimum of the range is computed
- **THEN** the minimum (`24.0.0`) SHALL be lower than the `24.11.0` that the build toolchain requires
- **AND** the floor SHALL therefore be expressed at `24.11.0` precision

### Requirement: Bundle target derived from the declared floor

The build SHALL derive its bundle target from the minimum of `engines.node`, so that the emitted bundle targets the same minimum runtime the package declares.

- The `tsdown` build SHALL report a target of `node24.11.0` when `engines.node` is `>=24.11.0`
- The emitted ESM bundle SHALL NOT rely on syntax newer than the declared floor

#### Scenario: Build reports the target derived from the floor

- **WHEN** the build runs
- **THEN** it SHALL report `target: node24.11.0`

#### Scenario: Bundle output is unaffected by the floor change

- **GIVEN** the source is ES2020 and uses no post-ES2020 syntax
- **WHEN** the target moves from `node22.12.0` to `node24.11.0`
- **THEN** the emitted bundle SHALL be byte-identical to the previous output
- **AND** any difference SHALL be treated as a defect requiring review

### Requirement: Developer-pinned Node version

The project SHALL provide a `.nvmrc` file pinning the Node version used for local development, so that every developer resolves the same runtime.

- `.nvmrc` SHALL contain a concrete version, not a major range, so local resolution is reproducible
- The pinned version SHALL satisfy `engines.node`
- The pinned version SHALL be a latest-LTS release at the time it is written

#### Scenario: nvm resolves a version that satisfies the floor

- **WHEN** `nvm use` reads `.nvmrc`
- **THEN** the resolved version SHALL satisfy `engines.node`

#### Scenario: Pinned version is a specific patch release

- **WHEN** `.nvmrc` is inspected
- **THEN** it SHALL name a full version including the patch component
