#!/usr/bin/env node
/* Install (or re-sync) this skill into a Claude Code compatible skills directory.
 *
 *   code-manual-skill                    zh (default) -> ~/.claude/skills/code-manual
 *   code-manual-skill --lang en          en           -> SKILL.en.md renamed to SKILL.md
 *   code-manual-skill --project [dir]    project level -> <dir>/.claude/skills/code-manual
 *   code-manual-skill --help
 *
 * Idempotent: running it again simply overwrites with the current version
 * (that is how upgrades work: npx code-manual-skill@latest).
 * Zero dependencies; Node >= 18. No Python needed to install or upgrade.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const val = (f, d) => {
  const i = argv.indexOf(f);
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('-')) return argv[i + 1];
  const eq = argv.find(a => a.startsWith(f + '='));
  return eq ? eq.slice(f.length + 1) : d;
};

if (has('--help') || has('-h')) {
  console.log(`code-manual-skill — install the Code Manual agent skill

  code-manual-skill [--lang zh|en] [--project [dir]]

  --lang      zh (default) uses SKILL.md; en uses SKILL.en.md renamed to SKILL.md
  --project   install into <dir>/.claude/skills/code-manual (default dir: cwd),
              instead of the global ${path.join('~', '.claude', 'skills', 'code-manual')}
  --help      this text

Running it again overwrites the previous copy (sync / upgrade).`);
  process.exit(0);
}

const lang = val('--lang', 'zh');
if (lang !== 'zh' && lang !== 'en') {
  console.error(`error: --lang must be zh or en (got "${lang}")`);
  process.exit(1);
}

const root = path.dirname(fileURLToPath(import.meta.url));   // package bin/
const pkg = path.dirname(root);                              // package root
const skillFile = lang === 'en' ? 'SKILL.en.md' : 'SKILL.md';

const dest = has('--project')
  ? path.resolve(val('--project', process.cwd()), '.claude', 'skills', 'code-manual')
  : path.join(os.homedir(), '.claude', 'skills', 'code-manual');

for (const f of [skillFile, 'template.py']) {
  if (!fs.existsSync(path.join(pkg, f))) {
    console.error(`error: ${f} missing from package — broken install`);
    process.exit(1);
  }
}

const existed = fs.existsSync(path.join(dest, 'SKILL.md'));
fs.mkdirSync(dest, { recursive: true });
fs.copyFileSync(path.join(pkg, skillFile), path.join(dest, 'SKILL.md'));
fs.copyFileSync(path.join(pkg, 'template.py'), path.join(dest, 'template.py'));

let version = 'unknown';
try { version = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'), 'utf8')).version; } catch {}

console.log(`code-manual-skill v${version} — ${existed ? 'updated' : 'installed'}`);
console.log(`  language : ${lang}${lang === 'en' ? ' (SKILL.en.md -> SKILL.md)' : ''}`);
console.log(`  target   : ${dest}`);
console.log(`  files    : SKILL.md, template.py`);
console.log('');
console.log('Next: start a new session and say "create a code manual for this project".');
