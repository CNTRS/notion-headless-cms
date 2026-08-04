# AGENTS.md — notion-headless-cms

## General guidelines
- Answer always in Spanish. Write both code and comments in Plain English

## Commands

| Action | Command |
|--------|---------|
| Install | `pnpm install` |
| Build (typecheck + bundle) | `pnpm build` |
| Test all | `pnpm test` |
| Lint | `pnpm lint` (or `pnpm check` for read-only CI) |
| Format | `pnpm format` |

`pnpm` is enforced; `npm`/`yarn` will fail at preinstall.

`pnpm build` runs `tsc` first (tsconfig `noEmit: true` — typecheck-only), then `tsdown`.

## Testing

- **Unit tests** (`helpers.test.ts`): Use local mocks; run with just `pnpm test`.
- **Integration tests** (`cms.test.ts`): Require `NOTION_TOKEN` and `NOTION_DB` env vars loaded from `.env` (via `dotenv/config` import). A `.env` file is gitignored — create one before running. These tests hit the live Notion API.
- Vitest automatically picks up `src/*.test.ts`.

## Source layout

- `src/main.ts` — library entry point (re-exports `NotionCMS` from `./cms`)
- `src/cms.ts` — main `NotionCMS` class wrapping `@notionhq/client`
- `src/helpers.ts` — content block transformers (image→base64+dimensions, list grouping)
- `src/helpers.mocks.ts` — mock Notion block/page fixtures
- `examples/fetch-and-store.ts` — standalone script: `npx tsx examples/fetch-and-store.ts` (needs `.env`)

## Framework quirks

- Notion API types imported from `@notionhq/client/build/src/api-endpoints` (non-standard path).
- Library build outputs ESM only (`format: ["esm"]` in tsdown.config.ts); tsdown generates `dist/*.d.mts` and the package `exports`/`types` fields on build.
- Biome config at `biome.json` (tabWidth: 4, arrow parentheses `asNeeded`).
- Biome disables `suspicious/noExplicitAny` for Notion API type flexibility.
- `dotenv` is a devDependency; used in tests via `import "dotenv/config"` (auto-loads `.env`).
- `image-size` is a runtime dependency (not dev), used in `helpers.ts` to decode image dimensions.

## styles that differ from defaults

- 4-space indent (Biome `indentWidth: 4`).
- Arrow functions omit parens when single-param: `x => x` not `(x) => x` (Biome `arrowParentheses: "asNeeded"`).
- Disallow unused locals and parameters (tsconfig `noUnusedLocals`, `noUnusedParameters`).
- Biome `noUnusedVariables` off (redundant with `tsc`).
