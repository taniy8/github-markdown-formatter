# GitHub Markdown Formatter

Transform raw developer notes into clean, structured GitHub-flavored Markdown in real time.

<p align="center">
  <img src="./public/Screencast From 2026-06-14 13-26-32.gif" alt="GitHub Markdown Formatter Demo" />
</p>

## Overview

GitHub Markdown Formatter is a developer tool that converts raw, unstructured notes into clean, readable GitHub-flavored Markdown. It combines a deterministic rule-based formatting pipeline with an optional AI enhancement mode for improved grammar and readability while preserving technical intent.

## Features

- Rule-based formatting pipeline
- Automatic bullet generation
- Issue reference detection
- Code identifier wrapping with backticks
- Sentence capitalization and cleanup
- Optional AI enhancement powered by Groq (Llama 3.3 70B)
- Live GitHub-flavored Markdown preview
- Built-in PR and Bug Report templates
- Automatic draft persistence
- Copy to clipboard
- Download formatted output as `.md`

## Example

### Input

```text
fixed critical bug in authService
added JWT validation to middleware
refactored userController to use async await
updated README.md with setup instructions
fixes 287
closes 301
```

### Output

```md
- Fixed critical bug in `authService`
- Added JWT validation to `middleware`
- Refactored `userController` to use async/await
- Updated `README.md` with setup instructions

Fixes #287

Closes #301
```

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- React Markdown
- remark-gfm
- Groq API
- Vercel

## Getting Started

Clone the repository:

```bash
git clone https://github.com/taniy8/github-markdown-formatter.git
cd github-markdown-formatter
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## License

MIT
