// Export podkladů: každé SVG v assets/social a assets/tisk → PNG vedle něj.
// Kreslí headless Chrome (stejný renderer jako web), písma bere z assets/fonts,
// takže nemusí být nainstalovaná. Návod: docs/socialni-site.md.
//
//   node scripts/render-social.mjs                 všechna SVG
//   node scripts/render-social.mjs <soubor.svg>…   jen vybraná
//
// Velikost PNG = width/height SVG × data-export-scale (výchozí 1). SVG v milimetrech
// (tisk) jde do PNG náhledu 4× (~380 dpi) a s atributem data-export-pdf i do PDF
// stejného rozměru (vektor, písma vložená). Do tiskárny jde PDF.
// SVG se skupinou id="voditka" dostane navíc <název>-voditka.png s vyznačenými zónami.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fonts = pathToFileURL(join(root, 'assets/fonts')).href;

// Stejné rozsahy jako Fontsource: latin + latin-ext (čeština).
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const fontFaces = [
  ['Krona One', '400', 'normal', 'krona-one-latin-400-normal', LATIN],
  ['Krona One', '400', 'normal', 'krona-one-latin-ext-400-normal', LATIN_EXT],
  ['Montserrat', '100 900', 'normal', 'montserrat-latin-wght-normal', LATIN],
  ['Montserrat', '100 900', 'normal', 'montserrat-latin-ext-wght-normal', LATIN_EXT],
  ['Montserrat', '100 900', 'italic', 'montserrat-latin-wght-italic', LATIN],
  ['Montserrat', '100 900', 'italic', 'montserrat-latin-ext-wght-italic', LATIN_EXT],
].map(([family, weight, style, file, range]) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(${fonts}/${file}.woff2) format('woff2');unicode-range:${range}}`,
).join('\n');

export function findChrome() {
  const candidates = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error('Chrome nenalezen, nastav cestu v proměnné CHROME.');
  return found;
}

export function size(svg) {
  const attr = (name) => svg.match(new RegExp(`<svg[^>]*\\s${name}="([\\d.]+)(mm)?"`));
  const [, w, mm] = attr('width'), [, h] = attr('height');
  const scale = Number(attr('data-export-scale')?.[1]) || (mm ? 4 : 1); // mm: náhled ~380 dpi
  const px = (v) => (mm ? Math.round((v * 96) / 25.4) : Number(v)); // CSS px
  return { width: px(w), height: px(h), scale, mm: mm ? { width: w, height: h } : null, pdf: /<svg[^>]*\sdata-export-pdf/.test(svg) };
}

// SVG vložené do HTML: relativní cesty k obrázkům platí vůči složce SVG (<base>).
// page = rozměr v mm pro tisk do PDF, px = rozměr screenshotu (mm zaokrouhlené na celé px,
// proto preserveAspectRatio none: zkreslení < 0,2 %, žádný průhledný proužek u okraje).
export function html(svgPath, { guides = false, script = '', page = null, px = null } = {}) {
  let svg = readFileSync(svgPath, 'utf8').replace(/^<\?xml[^>]*>\s*/, '');
  if (px) svg = svg.replace('<svg ', '<svg preserveAspectRatio="none" ');
  const base = pathToFileURL(dirname(svgPath) + '/').href;
  // Chrome zaokrouhlí stránku PDF o ±0,1 mm (ve spadávce), okraj navíc má barvu pozadí karty.
  const fill = svg.match(/id="pozadi"[^>]*fill="([^"]+)"/)?.[1] ?? 'transparent';
  const box = page
    ? `@page{size:${page.width}mm ${page.height}mm;margin:0}svg{width:${page.width}mm;height:${page.height}mm}html{background:${fill};print-color-adjust:exact;-webkit-print-color-adjust:exact}`
    : px ? `svg{width:${px.width}px;height:${px.height}px}` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><base href="${base}"><style>
${fontFaces}
html,body{margin:0;background:transparent;overflow:hidden}svg{display:block}${box}
${guides ? '#voditka{display:inline!important}' : ''}
</style></head><body>${svg}${script}</body></html>`;
}

export function chrome(args, page) {
  const dir = mkdtempSync(join(tmpdir(), 'qomiq-social-'));
  const file = join(dir, 'page.html');
  writeFileSync(file, page);
  try {
    return execFileSync(findChrome(), [
      '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      `--user-data-dir=${join(dir, 'profile')}`,
      '--virtual-time-budget=5000', // počká na načtení písem
      ...args, pathToFileURL(file).href,
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function render(svgPath) {
  const { width, height, scale, mm, pdf } = size(readFileSync(svgPath, 'utf8'));
  const outputs = [[svgPath.replace(/\.svg$/, '.png'), false]];
  if (readFileSync(svgPath, 'utf8').includes('id="voditka"')) outputs.push([svgPath.replace(/\.svg$/, '-voditka.png'), true]);
  for (const [png, guides] of outputs) {
    chrome([
      `--window-size=${width},${height}`,
      `--force-device-scale-factor=${scale}`,
      '--default-background-color=00000000',
      `--screenshot=${png}`,
    ], html(svgPath, { guides, px: { width, height } }));
    console.log(`${png.slice(root.length + 1)}  ${Math.round(width * scale)}×${Math.round(height * scale)}`);
  }
  if (pdf && mm) {
    const out = svgPath.replace(/\.svg$/, '.pdf');
    chrome([`--print-to-pdf=${out}`, '--no-pdf-header-footer'], html(svgPath, { page: mm }));
    console.log(`${out.slice(root.length + 1)}  ${mm.width}×${mm.height} mm`);
  }
}

function svgsIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? svgsIn(join(dir, e.name)) : e.name.endsWith('.svg') ? [join(dir, e.name)] : []);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => resolve(f)) : ['assets/social', 'assets/tisk'].flatMap((d) => svgsIn(join(root, d)));
  files.forEach(render);
}
