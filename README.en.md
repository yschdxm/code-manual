<div align="center">

# Code Manual Skill

A universal skill for AI coding assistants (Claude Code, etc.): generate a **self-updating single-file HTML code manual** with one command — file tree + per-file "purpose + implemented features" + search + lazily-loaded highlighted source per symbol. Re-run the script after every code change; it never goes stale.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/yschdxm/code-manual)](https://github.com/yschdxm/code-manual/commits/master)
[![Issues](https://img.shields.io/github/issues/yschdxm/code-manual)](https://github.com/yschdxm/code-manual/issues)
[![爱发电](https://img.shields.io/badge/%E7%88%B1%E5%8F%91%E7%94%B5-%E8%AF%B7%E6%88%91%E5%96%9D%E6%9D%AF%E5%A5%B6%E8%8C%B6-7e5fd9?logo=afdian&logoColor=white)](https://ifdian.net/a/yschdxm)

English · [中文](README.md)

<a href="https://whale-star.whale-star.workers.dev/">
  <img src="https://whale-star.whale-star.workers.dev/?repo=yschdxm/code-manual" alt="Give us a Star~" width="720">
</a>

> 🐳 The banner above comes from **[whale-star](https://github.com/yschdxm/whale-star)** —
> a big-fat-fish README banner service that levels up with your GitHub star count. Get one for your repo too!

</div>

## What is this

An installable agent skill for any project. Once installed, just tell the AI "create a code manual for this project" and it will:

1. Write an **idempotent generator script** (`tool/gen_code_manual.py`) that extracts "what this file is" from file-header comments and "what it implements" from top-level symbols
2. Produce a **single-file HTML** (`CODE-MANUAL.html` at the repo root): multi-level expandable file tree on the left, search on top (auto-expands ancestor directories of hits), detail panel on the right
3. Add a "code ▾" toggle under each symbol — **lazily fetches the source by line span with lightweight syntax highlighting** (never embedded in the manual, so its size doesn't grow with the code; degrades to a direct source link when `file://` blocks fetch)
4. Lock in the "re-run the script after every code change and commit the manual together with the code" discipline via **three redundant layers**: the generator's docstring + the project instruction file (CLAUDE.md/AGENTS.md) + persistent memory

The process is distilled from real practice on the StoryForge project, including its security-review loop (JSON embed escaped against `</script>` injection; every HTML interpolation goes through `esc()`).

## Features

- **Single file, works offline**: double-click to open, no external dependencies, no server
- **Zero source embedding**: the manual stores only line-span pointers; source is loaded on demand
- **Bilingual**: Chinese by default (`SKILL.md` + template `UI_LANG="zh"`); English copy at `SKILL.en.md` (renamed to the standard `SKILL.md` on install)
- **Language-agnostic**: ships with a Python (`ast`) scanner; swap the scanner for other languages (the template comments include the Dart precedent)
- **Safe**: source comments cannot inject scripts through the manual (JSON `<` escaping + `esc()` on all interpolations)

## Install

Copy the prompt below to your AI coding assistant (Claude Code, etc.) and it will do the installation for you (English version):

```text
Please install the "Code Manual" skill for me: clone https://github.com/yschdxm/code-manual into a temporary directory, copy SKILL.en.md from the repo root as SKILL.md (the standard skill filename) together with template.py into ~/.claude/skills/code-manual/ (or <project root>/.claude/skills/code-manual/ if I only want it for the current project), then delete the temporary directory. When done, confirm the install path to me.
```

To install the Chinese version (the repo default), use the prompt from the [Chinese README](README.md).

## Usage

Once installed, in any project say to the AI:

```text
Create a code manual for this project
```

The skill runs the full seven-stage process automatically (create generator → sample verification → check gitignore → three-layer discipline binding → commit → security self-check → UX baseline). After that, following the discipline, the AI re-runs after every code change:

```bash
python tool/gen_code_manual.py
```

## What the manual looks like

- **Left**: multi-level expandable file tree (top level expanded by default), line count next to each file
- **Top**: search box filtering by file name / path / comments / symbol names; hits auto-expand their ancestor directories; clearing restores the default fold
- **Right**: for the selected file — "What this file is" (file-header comment) and "Functions implemented" (all top-level symbols + one line each)
- **Under each symbol**: "code ▾" lazily loads that symbol's source line span, colorizing keywords/strings/comments/numbers
- Scrollbars and other details match the dark theme

## Repository layout

```
code-manual/
├── SKILL.md          # Chinese skill (default)
├── SKILL.en.md       # English skill (copy; rename to SKILL.md on install)
├── template.py       # Bilingual generator template (HTML shell + Python ast scanner + UI_LANG)
├── README.md         # Chinese readme
├── README.en.md      # This file (English)
├── LICENSE           # MIT
└── .github/assets/   # Sponsor QR codes
```

## Development & testing

The template passes a bilingual self-check (actually generates both languages against a mini fixture, asserting JSON escaping, the src/ln contract, lazy loading, and scrollbar styling); the check script and fixtures live in the local dev directory and are not published with the repo.

## 💝 Support development

This skill is free and open source (MIT). If it saved you time, treat the author to a coffee through any of the channels below — every bit of support turns into future feature updates and bug fixes:

<div align="center">

<a href="https://ifdian.net/a/yschdxm"><img width="200" src="https://pic1.afdiancdn.com/static/img/welcome/button-sponsorme.png" alt="Sponsor me on Afdian"></a>

| Alipay | WeChat Pay |
|:---:|:---:|
| <img src="./.github/assets/alipay.png" alt="Alipay QR" height="340"> | <img src="./.github/assets/wechat-pay.png" alt="WeChat Pay QR" height="340"> |

*Prefer not to scan? You can also support via [Afdian](https://ifdian.net/a/yschdxm) — and leave a feature request there.*

</div>

## License

[MIT](LICENSE) © yschdxm
