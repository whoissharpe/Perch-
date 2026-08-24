/**
 * Generate every icon the apps need from the one transparent master.
 *
 *   npm run icons
 *
 * The master (apps/web/public/logo.png) is a wide bird-on-a-bench drawing, so
 * square targets get it contained with padding rather than cropped — cropping
 * a wide mark into a square eats the bench, which is half the idea.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MASTER = resolve(root, "apps/web/public/logo.png");

const PAPER = { r: 252, g: 252, b: 250, alpha: 1 };
const PINE = { r: 28, g: 64, b: 52, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * Contain the mark inside `size`, leaving `padRatio` of breathing room.
 * Trims the master's transparent margin first — without it the drawing
 * lands tiny in the middle of the square with dead space all round.
 */
async function render({ out, size, background, padRatio = 0.16, tint }) {
  const inner = Math.round(size * (1 - padRatio * 2));

  const trimmed = await sharp(MASTER).trim({ threshold: 1 }).png().toBuffer();

  let mark = sharp(trimmed).resize(inner, inner, {
    fit: "contain",
    background: CLEAR,
  });

  // For the Android adaptive foreground the mark sits on pine, so it has to
  // be lifted to paper or it disappears into the background layer.
  if (tint) {
    const { data, info } = await mark.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = tint.r;
        data[i + 1] = tint.g;
        data[i + 2] = tint.b;
      }
    }
    mark = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  }

  const buf = await mark.png().toBuffer();

  await mkdir(dirname(out), { recursive: true });
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: buf, gravity: "center" }])
    .png()
    .toFile(out);

  console.log(`  ${out.replace(root, ".")}  ${size}×${size}`);
}

const M = (p) => resolve(root, "apps/mobile", p);
const W = (p) => resolve(root, "apps/web/public", p);

console.log("Generating icons from apps/web/public/logo.png");

// iOS / store icon — opaque, because the App Store rejects alpha.
await render({ out: M("assets/icon.png"), size: 1024, background: PAPER, padRatio: 0.14 });

// Android adaptive foreground — transparent, pine plate comes from app.json.
await render({
  out: M("assets/adaptive-icon.png"),
  size: 1024,
  background: CLEAR,
  padRatio: 0.26,
  tint: PAPER,
});

// Splash — the mark alone, small, on the paper ground.
await render({ out: M("assets/splash.png"), size: 1284, background: PAPER, padRatio: 0.34 });

// Web favicon + apple touch icon.
await render({ out: W("icon.png"), size: 512, background: CLEAR, padRatio: 0.06 });
await render({ out: W("apple-icon.png"), size: 180, background: PAPER, padRatio: 0.12 });

// A tidy, small version of the master for use in the marketing page itself.
await sharp(MASTER)
  .resize(720, 720, { fit: "inside" })
  .png({ compressionLevel: 9, palette: true })
  .toFile(W("logo-720.png"));
console.log("  ./apps/web/public/logo-720.png  720 wide");

console.log("Done.");
