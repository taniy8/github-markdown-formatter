# GitHub Markdown Formatter

> Transform messy developer notes into clean, structured GitHub-flavored markdown — instantly.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Overview

Writing good PR descriptions and commit messages takes time. Developers often jot down raw notes while working — lowercase, unpunctuated, unformatted — and then have to manually clean them up before pushing.

GitHub Markdown Formatter solves that. Paste your raw notes, get back production-ready GitHub markdown in real time.

## Demo

**Input**
fixed bug with gradient colors

added gradient_stops to schema

passed value to BadgeParams

added tests

fixes 123

**Output**
```markdown
- Fixed bug with gradient colors
- Added `gradient_stops` to schema
- Passed value to `BadgeParams`
- Added tests

Fixes #123
```

## Features

- **Rule-based formatting pipeline** — deterministic, fast, works offline
- **Issue reference detection** — `fixes 123` → `Fixes #123`
- **Code identifier detection** — wraps `snake_case`, `CamelCase`, `functions()`, and `file.ts` in backticks automatically
- **Bullet generation** — detects action verbs and converts lines into formatted bullet points
- **Live preview** — GitHub-flavored markdown rendered in real time
- **Templates** — Simple PR, Detailed PR, and Bug Report starter templates
- **Copy to clipboard** — one click to copy raw markdown
- **Download** — export as `.md` file
- **Draft persistence** — auto-saves to localStorage, survives page refresh

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | Framework |
| TypeScript | Language |
| Tailwind CSS 4 | Styling |
| react-markdown | Markdown rendering |
| remark-gfm | GitHub-flavored markdown support |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/taniy8/github-markdown-formatter.git
cd github-markdown-formatter
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run format   # Run Prettier
```

## Architecture

The formatter is built as a pipeline — each rule is isolated, testable, and composable.

Raw Text

↓

Parser          — splits input into lines

↓

Rule Engine     — applies rules in order per line

├── fixIssueReferences

├── wrapCodeIdentifiers

└── convertToBullet

↓

Markdown Generator — joins lines, adds spacing

↓

Live Preview    — rendered via react-markdown

## Roadmap

- [ ] AI mode — Claude API integration for intelligent formatting
- [ ] Dark mode
- [ ] More templates — hotfix, release, feature branch
- [ ] Deploy to Vercel
- [ ] VS Code extension

## License

MIT © [taniy8](https://github.com/taniy8)