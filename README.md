# Notion Headless CMS

## _From Notion to the static website_

---

## 📖 Table of Contents

-   [Notion Headless CMS](#notion-headless-cms)
    -   [_From Notion to the static website_](#from-notion-to-the-static-website)
    -   [📖 Table of Contents](#-table-of-contents)
    -   [📍 Overview](#-overview)
    -   [📦 Features](#-features)
    -   [✅ Prerequisites](#-prerequisites)
    -   [💾 Installation](#-installation)
    -   [🚀 Quick Start](#-quick-start)
    -   [🔧 API Reference](#-api-reference)
    -   [📊 Data Model](#-data-model)
    -   [🧪 Example Script](#-example-script)
    -   [⚙️ Tech Stack](#️-tech-stack)
    -   [📂 Repository Structure](#-repository-structure)
    -   [📄 License](#-license)

---

## 📍 Overview

Notion API library focused on retrieving database pages as a Headless CMS (like Strapi, Storyblok, Sanity ...).

In addition to API calls, it processes some Notion content blocks for easy rendering with whatever tech stack you want:

-   Downloads images and enriches them with `base64`, dimensions (`width`/`height`) and `format`.
-   Groups consecutive bulleted/numbered list items into single list blocks.

It runs on top of the official Notion SDK v5 (`@notionhq/client`), which uses the `2025-09-03` API version.

---

## 📦 Features

-   Simple methods to list page metadata, retrieve page metadata, and recover all pages with their content
-   Works with both public and private Notion content
-   Automatic image processing (base64, dimensions, format) when fetching full page content
-   Consecutive list items grouped into a single list block for easier rendering

---

## ✅ Prerequisites

To use this library you need:

1.  A Notion integration token (Secret key) — see [Notion integrations](https://developers.notion.com/).
2.  A Notion database shared with your integration.

### Database schema

The library maps the following database properties. Columns are matched **by property type**, not by name:

| Domain field | Notion property type | Required | Notes |
|---|---|---|---|
| `title` | `title` | Yes | Used as the page title |
| `slug` | `rich_text` | Recommended | Must match kebab-case (`[a-z0-9-]`); falls back to `untitled` |
| `status` | `status` | Recommended | Only `draft`, `published` or `archived` |
| `tags` | `multi_select` | No | Mapped to a list of `Tag` |
| `author` | `created_by` | No | Falls back to the page creator |
| `createdAt` | `created_time` | No | Falls back to the page creation time |
| `updatedAt` | `last_edited_time` | No | Falls back to the page last-edited time |

> **Data source:** the SDK v5 queries pages through the Notion *data source* model. The library resolves the `data_source_id` from the database automatically on first use and throws `NotionDataSourceError` if the database reports no data sources.

---

## 🚀 Quick Start

Create a `.env` file with your Notion credentials:

```sh
NOTION_TOKEN=secret_your_integration_token
NOTION_DB=your_database_id
```

Then use the library:

```ts
import { createDefaultCMS } from "notion-headless-cms";
import "dotenv/config";

const cms = createDefaultCMS(process.env.NOTION_TOKEN, process.env.NOTION_DB);

// List all pages (metadata only)
const pages = await cms.listPages();

// Get a single page with its content processed (images downloaded, lists grouped)
const page = await cms.getPageWithContent(pages[0].id);

// Get all pages with their content
const all = await cms.getAllPagesContent();
```

---

## 🔧 API Reference

### `createDefaultCMS(token: string, databaseId: string): NotionCMS`

Factory that wires the library together: a Notion SDK client, a page repository and an image fetcher.

### `NotionCMS`

| Method | Returns | Description |
|---|---|---|
| `listPages()` | `Promise<StaticPage[]>` | Lists the metadata of all pages in the database |
| `getPage(id)` | `Promise<StaticPage \| null>` | Retrieves a single page's metadata; `null` if not found |
| `getPageContent(id)` | `Promise<PageBlock[]>` | Retrieves the raw content blocks of a page |
| `getPageWithContent(id)` | `Promise<StaticPage>` | Retrieves a page with its content processed (images enriched, lists grouped) |
| `getAllPagesContent()` | `Promise<StaticPage[]>` | Retrieves every page with processed content |

> **Errors:** domain validation errors (`InvalidPageIdError`, `InvalidSlugError`, `InvalidPageStatusError`, ...) and infrastructure errors (`NotionDataSourceError`) are exported from the library. `NotionDataSourceError` is thrown when the configured database has no data sources.

---

## 📊 Data Model

### `StaticPage`

| Field | Type | Description |
|---|---|---|
| `id` | `PageId` | Notion page UUID |
| `slug` | `Slug` | Kebab-case slug from the `rich_text` column |
| `status` | `PageStatus` | `draft`, `published` or `archived` |
| `title` | `string` | Page title |
| `tags` | `Tag[]` | Tags from the `multi_select` column |
| `author?` | `string` | Author (integration user id) |
| `createdAt` | `Date` | Creation date |
| `updatedAt?` | `Date` | Last-edited date |
| `content` | `PageBlock[]` | Content blocks (populated when using the content methods) |

### `PageBlock` types

Supported block types: `text`, `heading_1`, `heading_2`, `heading_3`, `image`, `bulleted_list`, `numbered_list`, `callout`, `video`, `code`, `quote`, `divider`.

-   `ImageBlock` carries `url` and, after processing, `base64`, `width`, `height` and `format`.
-   Consecutive `bulleted_list_item` / `numbered_list_item` blocks are grouped into `bulleted_list` / `numbered_list` blocks.
-   Unsupported Notion block types are ignored.

---

## 🧪 Example Script

A standalone example shows how to fetch all pages with content and store them as JSON:

```sh
npx tsx --env-file=.env examples/fetch-and-store.ts
```

It reads `NOTION_TOKEN` and `NOTION_DB` from `.env` and writes the result to `data.json`.

---

## ⚙️ Tech Stack

-   Node.js ≥ 22
-   TypeScript v7
-   tsdown + Vitest (build + testing)
-   Biome (lint + format)
-   MSW (test HTTP interception)
-   fast-check (property-based testing)
-   `@notionhq/client` v5 (Notion API, version `2025-09-03`)
-   `image-size` (image block dimensions)

---

## 📂 Repository Structure

```sh
└── notion-headless-cms/
    ├── biome.json
    ├── .gitignore
    ├── examples/
    │   └── fetch-and-store.ts
    ├── LICENSE
    ├── openspec/
    │   ├── changes/
    │   └── specs/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src/
    │   ├── cms.ts                  # NotionCMS orchestration
    │   ├── domain/                 # Pure domain types (StaticPage, PageBlock, ...)
    │   ├── infrastructure/         # Notion adapter + image fetcher
    │   ├── ports/                  # Repository/fetcher interfaces
    │   ├── test/                   # Fakes + MSW test infrastructure
    │   └── main.ts                 # Library entry point
    ├── tsconfig.json
    ├── tsdown.config.ts
    └── vitest.config.ts
```

---

## 📄 License

This project is licensed under the `ℹ️  MIT` License. See the LICENSE file for additional info.

**Free Software, Hell Yeah!**
