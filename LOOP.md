# Ralph + OpenSpec Loop Harness

You are working in a loop driven by `ralph.sh`. Each iteration is a
fresh session. The git history and the files on disk are your memory.

This file (`LOOP.md`) defines HOW you work.
`openspec/changes/$CHANGE/` defines WHAT you are building.

## Phase 0: Orientation

Study the current state before doing anything:

- Read `openspec/changes/$CHANGE/tasks.md`. `- [ ]` is pending, `- [x]` is done.
- Read `openspec/changes/$CHANGE/proposal.md` for context.
- Read `openspec/changes/$CHANGE/design.md` for technical decisions.
- Read `openspec/changes/$CHANGE/specs/` for BDD scenarios.
- Read `openspec/config.yaml` for project context and guidelines.
- Run `git log --oneline -20`
- Run `pnpm run test 2>&1 | tail -30`
- Run `pnpm run build 2>&1 | tail -30`

Do not assume something is missing just because you do not see it in
your context. Verify before acting.

## Phase 1: Pick the next task

Open `openspec/changes/$CHANGE/tasks.md`. Pick the lowest-numbered
unchecked `- [ ]` item. Do ONLY that one. **One task per loop.**

## Phase 2: Implement with strict TDD baby steps

For each behavioural slice of the task:

- **RED**: write ONE failing test. Run, see it fail.
  - Follow the test naming style in guardrail 9007.
- **GREEN**: write the minimum production code to pass.
  - Faking allowed only if the next test in the SAME iteration generalises it.
- **REFACTOR**: clean up while tests stay green. Re-run after each change.

## Phase 3: Commit and update tasks.md

- Flip the `- [ ]` you just finished to `- [x]` in `tasks.md`.
- `git commit -m "<type>(<scope>): <task summary>"`

Follow conventional commits as defined in
`.claude/skills/guidelines/git-strategy/`.

## Phase 4: Completion check

Only when EVERY task AND EVERY acceptance criterion in
`tasks.md` is `- [x]`. Verify each one explicitly. If all green:

<promise>DONE</promise>

---

## 9001: DO NOT lie to escape the loop

If you are stuck, you must NOT emit the promise to terminate. The loop
exists to keep you working. Honesty above all.

## 9002: Do NOT implement placeholders

No `throw new Error("not implemented")`. No `// TODO`. If you cannot
finish an item this iteration, leave it as `- [ ]` and the next loop
will pick it up. Fake-it inside a baby step is allowed only when the
next test of the SAME iteration generalises it.

## 9003: One task per loop

Do not implement multiple tasks in one iteration even if you can see
the next one.

## 9004: Strict TDD

Failing test BEFORE production code. Always. No exceptions.

## 9005: Parallel subagents for reads, sequential for builds

You may parallelise reads (search, grep, file inspection). You MUST
serialise builds (`pnpm run test`, `pnpm run build`, lint).

## 9006: Verify, do not assume

Before claiming a test passes, run it. Before claiming a file exists,
list the directory. Before claiming an import works, run the compiler.

## 9007: Test naming style guide (NON-NEGOTIABLE)

- **Describe**: `describe("The [Subject]", ...)`. Use the domain concept,
  not the function name.
- **Test cases**: DOMAIN verbs (calculates, sums, accepts, rejects,
  ignores, lists, allows). NOT technical verbs (returns, throws, calls,
  includes, splits).
- **AAA** with blank lines for tests with setup.
- In Phase 4, verify every test name follows this.
