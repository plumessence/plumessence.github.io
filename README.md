# Gloria Li’s notebook

A quiet personal blog for math, machine learning, schoolwork, and ideas. Built with Astro, Markdown, and KaTeX. The complete site is static and deploys to **https://plumessence.github.io/**.

## Write a post

The simplest option is **Write a note** in the site’s footer. The writing desk has live Markdown and LaTeX preview, browser-local draft saving, import/export, and a link to commit your post through GitHub. Drafts are stored only in the browser you use, so download anything you want to keep. Local drafts are not a backup service.

You can also create or edit `.md` files directly inside `src/content/posts/` on GitHub:

```markdown
---
title: "My first note"
description: "What this note is about."
date: "2026-11-09"
topic: "Math"
draft: false
---

Here is an inline equation: $e^{i\pi} + 1 = 0$.

## A display equation

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$
```

- Topics: `Math`, `Machine learning`, `Schoolwork`, `Other`.
- `draft: true` excludes a post from the published site, RSS, search, and exported sources. A draft committed to a **public repository is still publicly readable on GitHub**. Keep private drafts in the browser or locally.
- Use `draft: false` to publish. Future dates do not schedule publication.
- The filename becomes the URL: `my-first-note.md` → `/posts/my-first-note/`. Keep filenames lowercase with hyphens.
- Markdown supports headings, links, lists, quotes, and fenced code blocks. LaTeX uses `$...$` inline and `$$` on separate lines for display math. Rendering happens at build time, with local KaTeX assets.
- The example posts have `example: true` and a visible notice. Replace or delete those files when adding your writing; omit `example` on your own posts.

When editing an existing note in the writing desk, **Save on GitHub** opens the existing file. Use **Copy Markdown**, paste it over the file’s contents, and commit. For a new note, the title and contents are filled in automatically. Long notes should be downloaded and uploaded to GitHub instead.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

`npm run build` produces the static site in `dist/`. `npm run preview` serves that build locally.

## GitHub Pages

The repository must be named `plumessence.github.io` for the root user-site URL. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included `.github/workflows/deploy.yml` builds and deploys on each push to `main`. No custom domain or paid hosting is needed.

## Make it yours

- Intro and post index: `src/pages/index.astro`
- About text: `src/pages/about.astro` (starter copy; edit to match your own voice)
- Header, footer, metadata: `src/layouts/Base.astro`
- Typography, colors, layout, and responsive styles: `src/styles/global.css`
- Math and Markdown configuration: `astro.config.mjs`
- RSS: `/rss.xml`; sitemap: `/sitemap.xml`

The site offers topic filters, full-text search, direct post URLs, RSS, a table of contents, light/dark appearance, keyboard focus styles, reduced-motion support, and a mobile layout. Press `/` on the index to search; Escape clears and closes search focus.

Fonts are loaded from Google Fonts, with Georgia and system-font fallbacks. All math assets are bundled with the site. There is no analytics or visitor account system.
