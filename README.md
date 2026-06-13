# GitHub Markdown Formatter

Transform messy developer notes into clean, structured GitHub-flavored markdown.

## What it does

Paste raw notes like this:
fixed bug with gradient colors

added gradient_stops to schema

fixes 123
Get back clean markdown instantly:

```markdown
- Fixed bug with gradient colors
- Added `gradient_stops` to schema

Fixes #123
```

## Features

- Detects action verbs → bullet points
- Wraps code identifiers in backticks automatically
- Converts issue references (`fixes 123` → `Fixes #123`)
- Live GitHub-flavored markdown preview
- PR and Bug Report templates
- Copy to clipboard / Download as `.md`
- Auto-saves draft to localStorage

## Stack

Next.js · TypeScript · Tailwind CSS · react-markdown

## Getting Started

```bash
git clone https://github.com/taniy8/github-markdown-formatter.git
cd github-markdown-formatter
npm install
npm run dev
```

## Roadmap

- [ ] AI mode via Claude API
- [ ] Dark mode
- [ ] Deploy to Vercel

## License

MIT © [taniy8](https://github.com/taniy8)