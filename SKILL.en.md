---
name: code-manual
description: Use when the user asks to create a "code manual" / CODE-MANUAL — a searchable single-file HTML with a file tree on the left and per-file "purpose + implemented features" detail — or asks that such a manual be "updated after every code change", "committed to the repo", or used to "quickly understand the project". Triggers: code manual, CODE-MANUAL, 代码手册, file-tree manual, HTML code map, project overview, onboarding code map.
---

# code-manual (self-updating code manual)

## Core principle

The manual = **generator script + single-file HTML**. Write the script once; from then on it is idempotent and can be re-run at any time.
Hand-written / hand-maintained HTML is never acceptable — it inevitably rots after code changes and misleads more than having no manual at all.
The update habit is locked in via **three redundant layers of discipline**, relying on nobody's (and no session's) memory.

## Generator contract

`tool/gen_code_manual.py` (idempotent, finishes in seconds):

- **Input**: source directories; exclude generated artifacts and dependencies (`*.g.dart`, `node_modules`, `*.min.*`, etc.)
- **Extract per file**: `path`, `src` (source path relative to the manual), `lines`, `role` (first N lines of the file-header comment), `syms[{kind,name,doc,ln}]` (top-level symbols + one-line doc each + line span)
- **Output**: `CODE-MANUAL.html` at the repo root, data embedded as JSON, opens by double-click in a browser; **source code itself is never embedded** — the front end fetches on demand and slices by the `ln` span for highlighting; when fetch is blocked under `file://`, it degrades to a direct link to the source file
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
5. **Commit**: generator and CODE-MANUAL.html go into the same commit (when the user wants it in the repo).
6. **Security hard rule**: every HTML interpolation (attributes + text) goes through `esc()`; embed JSON only after `json.dumps(...).replace("<", "\\u003c")` — this stops a `</script>` inside source comments from closing the script block early. After generating, self-check: the number of `</script>` occurrences in the HTML == the template's own inherent count.
7. **UX baseline**: multi-level expandable file tree (top level expanded by default); search keeps matching files and **auto-expands their ancestor directories**, clearing the search restores the default fold; under each symbol's description a "code" toggle lazily fetches the source line span and lightly highlights it (not embedded, dynamic fetch, degrades to a direct link on failure); scrollbar and other detail styling match the overall theme; files without comments are honestly labeled "No file-header comment" — **never fabricate** descriptions.

## Delivery report

Tell the user: how to open it (double-click CODE-MANUAL.html at the repo root), the update command, and which layers the discipline was written into.

## Common mistakes

| Mistake | Consequence | Right approach |
|---|---|---|
| Hand-written HTML, no generator | Manual goes stale after code changes, misleads newcomers | Script-generated, idempotent re-run |
| Skipping sample verification | Extraction bugs silently produce empty/wrong manuals | Stage 2 gate must pass |
| Output in an ignored directory | Other developers can't see it after clone | Check .gitignore first (stage 3) |
| Unescaped `<` in embedded JSON | Source comments can close the script block (XSS) | Stage 6 hard rule |
| Discipline written in only one place | Lost as soon as context is dropped | Three-layer binding |
| Fabricating descriptions when comments are missing | Manual loses trustworthiness | Honestly label "no comment" |
