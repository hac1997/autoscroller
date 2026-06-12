// Asset orphan audit (read-only). Cross-references every file under
// public/assets against references found in src/ (plus index.html and any
// JSON data). DEFENSIVE: any directory referenced via a template string
// (e.g. `assets/cards/${id}.png`) marks ALL files under that directory as
// "possibly used" so we never flag a dynamically-loaded asset as orphan.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const ASSETS_DIR = join(ROOT, 'public', 'assets');

// ── 1. Collect all source text we might reference assets from ──────────────
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const codeFiles = [
  ...walk(join(ROOT, 'src')),
  join(ROOT, 'index.html'),
].filter((p) => /\.(ts|tsx|js|mjs|html|json|css)$/.test(p) && !p.includes(`${sep}node_modules${sep}`));

let bigText = '';
for (const f of codeFiles) {
  try { bigText += readFileSync(f, 'utf8') + '\n'; } catch {}
}

// ── 2. Extract every "assets/..." occurrence (literal + template) ───────────
// Match assets/ up to the closing quote/backtick. Paths may contain spaces
// (e.g. 'page-stack - large.png'), so we stop only at the quote chars — NOT at
// whitespace. Template parts (${...}) stay embedded; handled below.
const refRe = /assets\/[^'"`)]*/g;
const rawRefs = new Set();
for (const m of bigText.matchAll(refRe)) {
  // Trim trailing junk that a greedy match past a real quote could grab when
  // the original delimiter wasn't a quote (rare): cut at first newline.
  rawRefs.add(m[0].split('\n')[0].trim());
}

// Split refs into:
//  - exactLiterals: full paths with no ${...}
//  - dynPrefixes:   the static directory prefix before the first ${...}
//                   (everything under it is considered possibly-used)
const exactLiterals = new Set();
const dynPrefixes = new Set();
for (const r of rawRefs) {
  const dollar = r.indexOf('${');
  if (dollar === -1) {
    exactLiterals.add(r.replace(/^assets\//, ''));
  } else {
    // static prefix up to last '/' before the ${...}
    const head = r.slice(0, dollar);
    const slash = head.lastIndexOf('/');
    const prefix = head.slice(0, slash); // e.g. "assets/cards"
    dynPrefixes.add(prefix.replace(/^assets\//, ''));
  }
}

// Some loaders build the FULL path from a variable (e.g. `assets/${path}` or a
// monster object's .file). Also treat any bare directory token that appears in
// code as a safety net is overkill; instead we additionally collect basenames
// referenced as plain strings (e.g. m.file = 'goblin.png') — catch loose
// filename literals that aren't prefixed with assets/.
const looseBasenames = new Set();
for (const m of bigText.matchAll(/['"`]([\w-]+\.(png|webp|jpg|jpeg|ogg|mp3|m4a|ttf|fnt|json))['"`]/g)) {
  looseBasenames.add(m[1].toLowerCase());
}

// ── 3. Classify every real asset file ───────────────────────────────────────
const allFiles = walk(ASSETS_DIR).map((p) => relative(ASSETS_DIR, p).split(sep).join('/'));

const used = [];
const orphans = [];
for (const rel of allFiles) {
  const base = rel.split('/').pop().toLowerCase();
  let hit = false;

  // a) exact literal match (with or without extension swap is exact here)
  if (exactLiterals.has(rel)) hit = true;

  // b) under a dynamic prefix → possibly-used (defensive)
  if (!hit) {
    for (const pre of dynPrefixes) {
      if (rel === pre || rel.startsWith(pre + '/')) { hit = true; break; }
    }
  }

  // c) loose basename referenced somewhere (covers data-driven .file fields)
  if (!hit && looseBasenames.has(base)) hit = true;

  // d) basename without extension appears as a literal path segment anywhere
  //    (covers `assets/ui/buttons/${b}.png` style where b is a known list, and
  //     atlas/key references that drop the extension)
  if (!hit) {
    const noExt = base.replace(/\.[^.]+$/, '');
    // require the noExt to appear quoted to avoid accidental substring hits
    const q = new RegExp(`['"\`]${noExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`);
    if (q.test(bigText)) hit = true;
  }

  if (hit) used.push(rel);
  else orphans.push(rel);
}

// ── 4. Report ───────────────────────────────────────────────────────────────
orphans.sort();
console.log(JSON.stringify({
  totalFiles: allFiles.length,
  usedCount: used.length,
  orphanCount: orphans.length,
  dynPrefixes: [...dynPrefixes].sort(),
  orphans,
}, null, 2));
