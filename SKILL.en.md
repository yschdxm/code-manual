---
name: code-manual
description: Use when the user asks to create a "code manual" / CODE-MANUAL — a searchable HTML manual with a file tree on the left and per-file "purpose + implemented features + full source" detail — or asks that such a manual be "updated after every code change", "committed to the repo", or used to "quickly understand the project". Triggers: code manual, CODE-MANUAL, 代码手册, file-tree manual, HTML code map, project overview, onboarding code map.
---

# code-manual (self-updating code manual)

## Core principle

The manual = **generator script + regenerable outputs** (HTML + a sidecar source store). Write the script once; from then on it is idempotent and can be re-run at any time.
Hand-written / hand-maintained HTML is never acceptable — it inevitably rots after code changes and misleads more than having no manual at all.
The update habit is locked in via **three redundant layers of discipline**, relying on nobody's (and no session's) memory.

## Generator contract

`tool/gen_code_manual.py` (idempotent, finishes in seconds):

- **Input**: source directories; exclude generated artifacts and dependencies (`*.g.dart`, `node_modules`, `*.min.*`, etc.)
- **Extract per file**: `path`, `lines`, `role` (first N lines of the file-header comment), `syms[{kind,name,doc}]` (top-level symbols + one-line doc each)
- **Output**: `CODE-MANUAL.html` at the repo root **plus** a sidecar `CODE-MANUAL.sources.js` (full source data, keyed by `group:path`); the HTML loads it via `<script src>` — **double-click works with zero server**; source never enters the HTML body, and both files are committed together
- Language adaptation only changes the **scanner**: use `ast` for Python; for other languages use a "file-header comment + top-level symbol" regex approach (see the Dart precedent in the comments of `template.py`)
- Set `UI_LANG` in the template to `"zh"` or `"en"` to match the manual's interface language to the project

## Process (execute in order)

1. **Create the generator**: start from `template.py`, change `SRC` / output name / scanner / `UI_LANG`.
2. **Sample verification (quality gate, do not skip)**: randomly pick 5+ files and compare against the manual entries; measure the share of files lacking a "role" description; if you find truncation / missed extraction (typical bugs: file-header comment blocked by import/library lines, or skipped due to indentation) → fix the scanner → sample again. Only continue once it passes.
3. **Check git tracking**: verify `.gitignore` does not exclude the output path — the manual must be git-tracked to be visible to other developers; if excluded, move it (usually to the repo root) or add an exception.
4. **Three-layer discipline binding**:
   - The generator's docstring states "re-run this script after every source change"
   - The project instruction file (CLAUDE.md/AGENTS.md) gains a "Code manual sync" section: after changing source, you **must** re-run the script and commit the manual together with the code
   - Tell the user the update command; if in Claude Code and the user said "remember this", also write a persistent memory entry
5. **Commit**: the generator and the manual outputs (`CODE-MANUAL.html` + `CODE-MANUAL.sources.js`) go into the same commit (when the user wants it in the repo).
6. **Security hard rule**: every HTML interpolation in the page (attributes + text) goes through `esc()`; embed JSON only after `json.dumps(...).replace("<", "\\u003c")` — this stops a `</script>` inside source comments from closing the script block early. After generating, self-check: the number of `</script>` occurrences in the HTML == the template's own inherent count. The sidecar `.sources.js` is an external file that never participates in inline closing — plain JSON serialization suffices.
7. **UX baseline**: multi-level expandable file tree (top level expanded by default); search keeps matching files and **auto-expands their ancestor directories**, clearing the search restores the default fold; the detail pane is three sections — "What this file is" + "Functions implemented" (**symbol descriptions only, never per-symbol code dumps**) + a "Source" section showing the **complete file directly**, highlighted; scrollbars and other detail styling match the overall theme; files without comments are honestly labeled "No file-header comment" — **never fabricate** descriptions.

## Delivery report

Tell the user: how to open it (double-click CODE-MANUAL.html at the repo root), the update command, and which layers the discipline was written into.

## Common mistakes

| Mistake | Consequence | Right approach |
|---|---|---|
| Hand-written HTML, no generator | Manual goes stale after code changes, misleads newcomers | Script-generated, idempotent re-run |
| Skipping sample verification | Extraction bugs silently produce empty/wrong manuals | Stage 2 gate must pass |
| Output in an ignored directory | Other developers can't see it after clone | Check .gitignore first (stage 3) |
| Unescaped `<` in embedded JSON | Source comments can close the script block (XSS) | Stage 6 hard rule |
| Forgetting to commit the sidecar `.sources.js` | Source section comes up empty when the manual opens | Commit both files together |
| Discipline written in only one place | Lost as soon as context is dropped | Three-layer binding |
| Fabricating descriptions when comments are missing | Manual loses trustworthiness | Honestly label "no comment" |
