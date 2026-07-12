// Generates the app icons — an ensō on washi paper — from an SVG, via sharp.
// Run: node scripts/gen-icons.mjs   (outputs to public/)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });

const WASHI = "#E9E5DB";
const INK = "#262521";
const SEAL = "#9C4B3C";

// One ensō on a washi field. `pad` = fraction of the canvas kept as margin
// (bigger for maskable icons so the ring survives the OS mask).
function ensoSVG(size, { pad = 0.16, seal = false, bg = true } = {}) {
  const cx = size / 2, cy = size / 2;
  const r = (size / 2) * (1 - pad);
  const circ = 2 * Math.PI * r;
  const stroke = size * 0.058;
  const gap = 0.1;                       // the ensō opening
  const dash = circ * (1 - gap);
  // leading brush head — where the stroke begins (top, rotated frame)
  const headA = -Math.PI / 2 + (1 - gap) * 2 * Math.PI;
  const hx = cx + r * Math.cos(headA), hy = cy + r * Math.sin(headA);
  const tailA = -Math.PI / 2;
  const tx = cx + r * Math.cos(tailA), ty = cy + r * Math.sin(tailA);
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg ? `<rect width="${size}" height="${size}" fill="${WASHI}"/>` : ""}
  <g transform="rotate(-90 ${cx} ${cy})">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}"
      stroke-width="${stroke}" stroke-linecap="round"
      stroke-dasharray="${dash} ${circ}" opacity="0.96"/>
    <circle cx="${cx}" cy="${cy}" r="${r + stroke * 0.42}" fill="none" stroke="${INK}"
      stroke-width="${stroke * 0.28}" stroke-linecap="round"
      stroke-dasharray="${dash * 0.98} ${circ}" opacity="0.35"/>
    <circle cx="${tx}" cy="${ty}" r="${stroke * 0.62}" fill="${INK}"/>
    <circle cx="${hx}" cy="${hy}" r="${stroke * 0.5}" fill="${INK}" opacity="0.9"/>
  </g>
  ${seal ? `<g transform="translate(${cx + r * 0.30} ${cy + r * 0.30})">
    <rect x="${-size * 0.11}" y="${-size * 0.11}" width="${size * 0.22}" height="${size * 0.22}"
      rx="${size * 0.03}" fill="${SEAL}"/>
    <text x="0" y="${size * 0.055}" font-family="Georgia, serif" font-size="${size * 0.15}"
      fill="#F6EFE6" text-anchor="middle">済</text>
  </g>` : ""}
</svg>`;
}

const jobs = [
  { file: "icon-192.png", size: 192, opts: {} },
  { file: "icon-512.png", size: 512, opts: {} },
  { file: "icon-maskable-512.png", size: 512, opts: { pad: 0.26 } },
  { file: "apple-touch-icon.png", size: 180, opts: { pad: 0.14 } },
  { file: "favicon-64.png", size: 64, opts: { pad: 0.12 } },
];

for (const j of jobs) {
  await sharp(Buffer.from(ensoSVG(j.size, j.opts)))
    .png()
    .toFile(join(outDir, j.file));
  console.log("wrote", j.file);
}
