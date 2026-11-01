// Story video z SVG. Návod: docs/socialni-site.md.
//
//   node scripts/render-story.mjs <story.svg> [délka v s, výchozí 16]
//
// - <g data-intro="wordmark"> s wordmarkem: úvod jako logo na webu. Uprostřed se objeví
//   spojené QQ, Q se rozjedou, naskočí „OMI“ (časy a křivky z global.css webu) a hotový
//   wordmark pak odjede na své místo v SVG.
// - <image id="chrom">: místo něj chrom smyčka assets/logo/qq/qq-loop.mp4.
// - <g data-rise="<s>">: vyjede zespodu a prolne se (jako hero na webu); čas je od konce úvodu.
// Potřebuje ffmpeg (PATH nebo proměnná FFMPEG) a Chrome jako render-social.

import { execFile, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { chrome, findChrome, html, size } from './render-social.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const RISE = 40; // px, o kolik prvek vyjede
const loop = join(root, 'assets/logo/qq/qq-loop.mp4');
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';

// ── Křivky a časy úvodu ─────────────────────────────────────────────
function bezier(x1, y1, x2, y2) {
  const at = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; (at(x1, x2, m) < x ? (lo = m) : (hi = m)); }
    return at(y1, y2, (lo + hi) / 2);
  };
}
const MOVE = bezier(0.7, 0, 0.2, 1); // translate loga na webu
const EASE = bezier(0.16, 1, 0.3, 1); // --ease
const span = (t, start, dur, curve = (x) => x) => curve(Math.min(1, Math.max(0, (t - start) / dur)));
const lerp = (a, b, p) => a + (b - a) * p;

const APPEAR = 0.5; // spojené QQ se objeví
const OPEN = 0.9; // začátek rozložení na QOMIQ (časy z global.css: Q 0.8 s se zpožděním 0.15 s, …)
const HOLD = OPEN + 1.6; // hotový wordmark odjede na místo
const INTRO = HOLD + 0.9; // konec úvodu

// Wordmark (Wordmark.astro): Q má box 490 jednotek, mezera 78.4, Q2 začíná na 1813.6.
// Spojené logo: Q1 posun (0, 74.3), Q2 (214 − 1813.6, −82.9) → středy od sebe (214, −157).
function wordmarkFrame(t, final, screen, ink) {
  const ko = 128 * (1 - span(t, OPEN, 0.25));
  const pq = span(t, OPEN + 0.15, 0.8, MOVE);
  const omiOpacity = span(t, OPEN + 0.5, 0.35);
  const omiScale = lerp(0.5, 1, span(t, OPEN + 0.45, 0.5, EASE));
  const blur = 94 * (1 - omiOpacity); // blur(4px) při výšce loga 1.3rem
  const q1 = [0, 74.3 * (1 - pq)], q2 = [1813.6 + -1599.6 * (1 - pq), -82.9 * (1 - pq)];

  // Úvod drží vizuální střed uprostřed obrazovky, pak wordmark odjede na místo v SVG.
  const s0 = (screen.width - 176) / 2304;
  const center = [lerp(352, 1152, pq), lerp(240.7, 245, pq)];
  const pm = span(t, HOLD, 0.8, MOVE);
  const appear = span(t, 0, APPEAR, EASE);
  const s = lerp(s0 * lerp(0.9, 1, appear), final.s, pm);
  const tx = lerp(screen.width / 2 - center[0] * s, final.x, pm);
  const ty = lerp(screen.height / 2 - center[1] * s, final.y, pm);

  const q = (id, [x, y], ko, arc) => `<g transform="translate(${x + 245} ${y + 245})">
    <mask id="${id}" maskUnits="userSpaceOnUse" x="-400" y="-400" width="900" height="900"><rect x="-400" y="-400" width="900" height="900" fill="#fff"/><path d="${arc}" fill="none" stroke="#000" stroke-width="${ko}"/></mask>
    <g mask="url(#${id})"><circle r="204.5"/><path d="M108.3 118.3 207.1 226.1"/></g></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${screen.width}" height="${screen.height}" viewBox="0 0 ${screen.width} ${screen.height}">
  <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>
  <g transform="translate(${tx} ${ty}) scale(${s})" opacity="${appear}" fill="none" stroke="${ink}" stroke-width="80">
    <g opacity="${omiOpacity}" ${blur > 0.5 ? 'filter="url(#b)"' : ''} transform="translate(1151.8 0) scale(${omiScale} 1) translate(-1151.8 0)">
      <circle cx="813.4" cy="245" r="204.5"/>
      <path fill="${ink}" stroke="none" transform="translate(1136.8 0)" d="M0 489.5V.5h87.1L220 214.2 352.9.5H440v489h-80V140.6L220 365.8 80 140.6v348.9z"/>
      <path fill="${ink}" stroke="none" transform="translate(1655.2 0)" d="M0 .5h80v489H0z"/>
    </g>
    ${q('ka', q1, ko, 'M318.8 18.4A204.5 204.5 0 0 1 84.8 1.3')}
    ${q('kb', q2, ko, 'M-318.8 -18.4A204.5 204.5 0 0 1 -84.8 -1.3')}
  </g>
</svg>`;
}

// Snímky úvodu: každý jedna instance Chrome, 6 najednou.
async function renderIntro(dir, final, screen, ink) {
  const frames = Math.ceil(INTRO * FPS) + 1;
  const run = promisify(execFile);
  const exe = findChrome();
  let next = 0;
  const worker = async () => {
    while (next < frames) {
      const i = next++;
      const page = join(dir, `intro-${i}.html`);
      writeFileSync(page, `<!doctype html><style>html,body{margin:0;background:transparent;overflow:hidden}svg{display:block}</style>${wordmarkFrame(i / FPS, final, screen, ink)}`);
      await run(exe, ['--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${join(dir, `p${i}`)}`,
        `--window-size=${screen.width},${screen.height}`, '--default-background-color=00000000',
        `--screenshot=${join(dir, `intro-${String(i).padStart(4, '0')}.png`)}`, pathToFileURL(page).href]);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return frames;
}

// Barva podkladu smyčky (video je zakódované přímo na pozadí). Pozadí story bere tuhle,
// ne #050607 ze SVG: tmavé odstíny se v YUV zaokrouhlí jinak a na hraně videa by byl šev.
function loopBackground() {
  const raw = execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', loop, '-frames:v', '1',
    '-vf', 'crop=8:8:4:4,scale=1:1:flags=area:in_color_matrix=bt709,format=rgb24', '-f', 'rawvideo', '-']);
  return [...raw.subarray(0, 3)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

async function main() {
  const svgPath = resolve(process.argv[2] ?? '');
  const duration = Number(process.argv[3] ?? 16);
  if (!existsSync(svgPath)) throw new Error('Použití: node scripts/render-story.mjs <story.svg> [délka]');

  const svg = readFileSync(svgPath, 'utf8');
  const { width, height } = size(svg);
  const screen = { width, height };
  const chromeImg = svg.match(/<image id="chrom"[^>]*>/)?.[0];
  if (!chromeImg) throw new Error('SVG nemá <image id="chrom">, není kam dát smyčku.');
  const attr = (el, name) => Number(el.match(new RegExp(`\\s${name}="([-\\d.]+)"`))[1]);
  const intro = svg.match(/<g id="[^"]+" data-intro="wordmark"><g [^>]*transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([\d.]+)\)"[^>]*>/);
  const ink = svg.match(/data-intro="wordmark">[\s\S]*?stroke="(#[0-9a-f]{6})"/i)?.[1] ?? '#f4f6f5';
  const offset = intro ? INTRO - 0.3 : 0; // ostatní prvky naskočí, když wordmark dojíždí
  const rises = [...svg.matchAll(/<g id="([^"]+)" data-rise="([\d.]+)"/g)].map(([, id, d]) => ({ id, delay: Number(d) + offset }));

  const dir = mkdtempSync(join(tmpdir(), 'qomiq-story-'));
  const shot = (file, css) => chrome([
    `--window-size=${width},${height}`, '--default-background-color=00000000', `--screenshot=${file}`,
  ], html(svgPath, { px: screen, css: `#pozadi,#chrom,#voditka,[data-intro]{display:none!important}${css}` }));

  try {
    const layers = [{ file: join(dir, 'static.png'), delay: null }];
    shot(layers[0].file, '[data-rise]{display:none}');
    for (const { id, delay } of rises) {
      const file = join(dir, `${id}.png`);
      shot(file, `svg>*:not(#${id}){display:none!important}`);
      layers.push({ file, delay });
    }
    if (intro) {
      mkdirSync(join(dir, 'intro'), { recursive: true });
      await renderIntro(join(dir, 'intro'), { x: +intro[1], y: +intro[2], s: +intro[3] }, screen, ink);
    }

    const videoAt = intro ? HOLD : 0;
    const inputs = [
      '-f', 'lavfi', '-i', `color=c=0x${loopBackground()}:s=${width}x${height}:r=${FPS}:d=${duration}`,
      '-stream_loop', '-1', '-i', loop,
      ...layers.flatMap((l) => ['-loop', '1', '-framerate', String(FPS), '-t', String(duration), '-i', l.file]),
      ...(intro ? ['-framerate', String(FPS), '-i', join(dir, 'intro', 'intro-%04d.png')] : []),
    ];
    const ease = (d) => `${RISE}*pow(1-clip((t-${d})/0.9\\,0\\,1)\\,3)`; // ease-out cubic
    const n = layers.length;
    // Skládání v RGB (gbrp), do YUV jen jednou na konci.
    const graph = [
      `[0:v]format=gbrp[bg]`,
      `[1:v]scale=${Math.round(attr(chromeImg, 'width'))}:${Math.round(attr(chromeImg, 'height'))}:in_color_matrix=bt709,fps=${FPS},format=rgba,fade=t=in:st=${videoAt}:d=1:alpha=1[v]`,
      `[bg][v]overlay=x=${Math.round(attr(chromeImg, 'x'))}:y=${Math.round(attr(chromeImg, 'y'))}:format=gbrp[b0]`,
      ...layers.map((l, i) => l.delay === null
        ? `[b${i}][${i + 2}:v]overlay=0:0:format=gbrp[b${i + 1}]`
        : `[${i + 2}:v]format=rgba,fade=t=in:st=${l.delay}:d=0.7:alpha=1[l${i}];[b${i}][l${i}]overlay=x=0:y='${ease(l.delay)}':eval=frame:format=gbrp[b${i + 1}]`),
      ...(intro ? [`[${n + 2}:v]format=rgba,tpad=stop_mode=clone:stop_duration=${duration}[w]`, `[b${n}][w]overlay=0:0:format=gbrp[b${n + 1}]`] : []),
      `[b${intro ? n + 1 : n}]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[out]`,
    ].join(';');
    const out = svgPath.replace(/\.svg$/, '.mp4');
    execFileSync(ffmpeg, [
      '-y', '-hide_banner', '-loglevel', 'error', ...inputs,
      '-filter_complex', graph, '-map', '[out]', '-t', String(duration), '-r', String(FPS),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-movflags', '+faststart', out,
    ], { stdio: 'inherit' });
    console.log(`${out.slice(root.length + 1)}  ${width}×${height}, ${duration} s`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

await main();
