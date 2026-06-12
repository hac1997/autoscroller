// Batch PNG→WebP converter (q90, alpha preserved, dimensions UNCHANGED).
// Converts every PNG under public/assets EXCEPT:
//   - fonts/   (bitmap-font glyph atlases referenced by .fnt — leave as .png)
//   - the explicit SPRITESHEET list (converted too, but flagged so we never
//     resize them: frame slicing depends on exact pixel dimensions)
// Writes a sibling .webp next to each .png and deletes the .png on success.
// Prints a per-directory savings report.
import { readdirSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const FFMPEG = 'C:/Users/heric/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe';
const ROOT = process.cwd();
const ASSETS = join(ROOT, 'public', 'assets');

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    (statSync(p).isDirectory() ? walk(p, acc) : acc.push(p));
  }
  return acc;
}

const all = walk(ASSETS).filter((p) => p.toLowerCase().endsWith('.png'));
const skipFonts = (p) => p.split(sep).includes('fonts');

let okN = 0, failN = 0, pngBytes = 0, webpBytes = 0;
const byDir = {};
const failures = [];

for (const png of all) {
  if (skipFonts(png)) continue;
  const webp = png.slice(0, -4) + '.webp';
  const before = statSync(png).size;
  try {
    execFileSync(FFMPEG, [
      '-y', '-loglevel', 'error', '-i', png,
      '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6', webp,
    ], { stdio: 'pipe' });
    if (!existsSync(webp) || statSync(webp).size === 0) throw new Error('empty output');
    const after = statSync(webp).size;
    unlinkSync(png);
    okN++; pngBytes += before; webpBytes += after;
    const d = relative(ASSETS, png).split(sep).slice(0, -1).join('/') || '(root)';
    byDir[d] = byDir[d] || { n: 0, b: 0, a: 0 };
    byDir[d].n++; byDir[d].b += before; byDir[d].a += after;
  } catch (e) {
    failN++; failures.push(relative(ASSETS, png) + ' :: ' + e.message);
  }
}

const mb = (b) => (b / 1048576).toFixed(2) + ' MB';
console.log(`convertidos: ${okN} | falhas: ${failN}`);
if (failures.length) { console.log('FALHAS:'); failures.forEach((f) => console.log('  ' + f)); }
console.log(`\nTOTAL: ${mb(pngBytes)} -> ${mb(webpBytes)}  (${(100 - 100 * webpBytes / pngBytes).toFixed(1)}% menor)\n`);
const rows = Object.entries(byDir).sort((x, y) => (y[1].b - y[1].a) - (x[1].b - x[1].a));
for (const [d, v] of rows) {
  console.log(`${mb(v.b - v.a).padStart(10)} poupado  (${String(v.n).padStart(3)})  ${d}  [${mb(v.b)}→${mb(v.a)}]`);
}
