# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

WePub is a **WeChat Official Account formatting tool** that converts Markdown to WeChat-friendly HTML. It includes both a web-based editor (index.html) and a Node.js CLI tool (format-wechat.js).

## Project Structure

```
layouttools/
├── index.html              # Main web application (single-file, no dependencies)
├── guide.html              # User guide page
├── format-wechat.js        # Node.js CLI tool for batch conversion
├── README.md               # Project documentation
├── README-format-wechat.md # CLI tool documentation
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
└── .claude/skills/         # Claude Code skills
```

## Key Features

- 10 color presets with high visual differentiation
- Markdown to HTML conversion with inline styles
- Customizable list markers (bullets, numbers, Chinese numerals)
- Character replacement rules
- Real-time preview with editable output

## Development

This is a pure static project:
- No build step required
- No npm dependencies for the web app
- Open `index.html` directly in browser

### CLI Tool Usage

```bash
node format-wechat.js <input.md>           # Basic conversion
node format-wechat.js <input.md> --preview # With browser preview
```

### Claude Code Skill

Use `/format-wechat <file.md>` to invoke the formatting tool.

## Code Style

- 2-space indentation
- ES6+ JavaScript
- CSS custom properties for theming
- Inline styles in output (WeChat compatibility)
