# Notion Headles CMS

## _From Notion to the static website_

---

## 📖 Table of Contents

-   [Notion Headles CMS](#notion-headles-cms)
    -   [_From Notion to the static website_](#from-notion-to-the-static-website)
    -   [📖 Table of Contents](#-table-of-contents)
    -   [📍 Overview](#-overview)
    -   [📦 Features](#-features)
    -   [📂 Repository Structure](#-repository-structure)
    -   [⚙️ Tech Stack](#️-tech-stack)
    -   [📄 License](#-license)

---

## 📍 Overview

Notion API library focused on retrieve database pages as a Headless CMS (like Strapi, Storyblok, Sanity ...)
In addition to API calls, process some Notion content blocks for an easily rendering with whatever tech stack you want

---

## 📦 Features

-   Simple methods for list pages metadata, retrieve page metadata with content, or recover all pages with its content
-   Import and save files from GitHub, Dropbox, Google Drive and One Drive
-   Drag and drop markdown and HTML files into Dillinger
-   Export documents as Markdown, HTML and PDF

---

## 📂 Repository Structure

```sh
└── notion-headless-cms/
    ├── .eslintignore
    ├── .eslintrc.cjs
    ├── .gitignore
    ├── .vscode/
    │   ├── extensions.json
    │   └── settings.json
    ├── LICENSE
    ├── examples/
    │   └── fetch-and-store.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src/
    │   ├── cms.test.ts
    │   ├── cms.ts
    │   ├── helpers.mocks.ts
    │   ├── helpers.test.ts
    │   ├── helpers.ts
    │   ├── main.ts
    │   └── vite-env.d.ts
    ├── tsconfig.json
    └── vite.config.ts
```

---

## ⚙️ Tech Stack

-   Node.js v18
-   ESLint + Prettier
-   Typescript v5
-   Vite + Vitest, for compile and testing
-   Image Size, for process images block metadata and obtain type and measures

## 📄 License

This project is licensed under the `ℹ️  MIT` License. See the LICENSE file for additional info.

**Free Software, Hell Yeah!**
