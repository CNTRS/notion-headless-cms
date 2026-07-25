---
name: git-strategy
description: This skill should be used when working with git, creating commits, branching, or managing version control. Covers feature branching, conventional commits, and TDD commit discipline. 
Triggers: "git", "commit", "branch", "feature branch", "conventional commits".
---

# Git Strategy

Feature branching workflow with conventional commits and TDD-driven commit discipline. Every green test produces a commit.

## Branching Model

### Feature Branching

All work happens on feature branches created from `main`.

```
main
 └── feat/add-user-registration
 └── fix/login-validation-error
 └── refactor/extract-payment-module
```

### Branch Naming

Format: `<type>/<short-description>`

| Type       | Use case                                   |
| ---------- | ------------------------------------------ |
| `feat`     | New feature                                |
| `fix`      | Bug fix                                    |
| `refactor` | Code restructuring without behavior change |
| `chore`    | Tooling, config, dependencies              |
| `docs`     | Documentation only                         |
| `test`     | Adding or fixing tests only                |

Rules:

- Lowercase, hyphens only (no underscores, no camelCase)
- Max 50 characters for the description part
- Descriptive but concise: `feat/user-login`, not `feat/add-the-new-login-feature-for-users`

### Branch Lifecycle

1. Create branch from `main`
2. Develop with TDD commits (see below)
3. Push and open PR
4. Merge to `main` (squash or merge commit per team preference)
5. Delete branch after merge

## Conventional Commits

Every commit message follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>
```

- **type**: Required. See table below.
- **scope**: Optional. Business module or component affected.
- **description**: Required. Imperative, lowercase, no period. Max 50 characters.

### Types

| Type       | When to use                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | New functionality visible to the user                   |
| `fix`      | Bug fix                                                 |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or correcting tests                              |
| `chore`    | Build, config, tooling changes                          |
| `docs`     | Documentation changes                                   |
| `style`    | Formatting, whitespace (no logic change)                |

### Conciseness Rules

Commit messages must be extremely concise:

- Max 50 characters in description
- No articles ("a", "the") unless necessary for clarity
- No filler words ("also", "just", "simply")
- Start with verb in imperative: `add`, `fix`, `remove`, `extract`, `rename`
- Describe the what, not the how

### Examples

```
feat(user): add registration endpoint
fix(auth): validate token expiry
refactor(payment): extract discount calculator
test(order): add empty cart case
chore: update typescript to 5.4
```

### Bad Examples (avoid)

```
feat: Added the new user registration feature    # past tense, too long
fix: fixing a bug in the login                   # gerund, vague
update code                                      # no type, vague
refactor(payment): refactor payment module        # redundant with type
```

## TDD Commit Discipline

Commit on every green test. This creates a fine-grained, reversible history.

### Commit Flow During TDD

```
RED    → write failing test         → no commit
GREEN  → make test pass             → COMMIT
REFACTOR → improve code             → COMMIT (if changes made)
```

### TDD Commit Types

| TDD Phase               | Commit type     | Example                             |
| ----------------------- | --------------- | ----------------------------------- |
| GREEN (first test)      | `feat` or `fix` | `feat(user): add name validation`   |
| GREEN (additional case) | `test`          | `test(user): add empty name case`   |
| REFACTOR                | `refactor`      | `refactor(user): extract validator` |

### Decision Guide for Type

- First green test that introduces new behavior → `feat`
- Subsequent test cases for the same behavior → `test`
- Green test that fixes a bug → `fix`
- Refactoring after green → `refactor`
- Adding test infrastructure or helpers → `test`

### Workflow Example

```
1. test(order): add create order case           # first green
2. refactor(order): extract price calculator    # refactor
3. test(order): add discount case               # second green
4. test(order): add zero quantity case           # third green
5. refactor(order): simplify discount logic     # refactor
6. feat(order): add order repository port       # new behavior
```

## Non-Negotiable Rules

- Never commit on red (failing tests)
- Never skip commits after green — every passing test gets a commit
- Never write long commit messages — 50 chars max in description
- Never use past tense or gerunds in commit descriptions
- Never commit directly to `main`
- Always use conventional commit format
- Always create feature branches from `main`
- Always use imperative mood in commit descriptions
- Always include type; include scope when the change is scoped to a module
