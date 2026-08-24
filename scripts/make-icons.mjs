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

// In-app marks: transparent, so the logo can sit on any surface. Two tints,
// because pine disappears on the dark ground and paper disappears on light.
await render({ out: M("assets/mark-pine.png"), size: 320, background: CLEAR, padRatio: 0.02, tint: PINE });
await render({ out: M("assets/mark-paper.png"), size: 320, background: CLEAR, padRatio: 0.02, tint: PAPER });

/**
 * The open state: bird turned to face you on the bench, wings spread. Shown
 * while its post is open. Trimmed and fitted on its own, since it is a
 * cross-fade target rather than an animation frame — nothing has to stay in
 * register with it.
 */
for (const [name, tint] of [["pine", PINE], ["paper", PAPER]]) {
  const src = await sharp(M("assets/open-raw.png")).trim({ threshold: 1 }).png().toBuffer();
  const { data, info } = await sharp(src)
    .resize(320, 320, { fit: "contain", background: CLEAR })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = tint.r;
      data[i + 1] = tint.g;
      data[i + 2] = tint.b;
    }
  }

  const out = M(`assets/open-${name}.png`);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ${out.replace(root, ".")}  320×320`);
}

/* ---------- landing-animation sprites ---------- */

/** Tightest rectangle containing any non-transparent pixel. */
function alphaBounds(data, width, height) {
  let top = height, left = width, right = -1, bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  return { left, top, right, bottom };
}

/**
 * Crop every pose to ONE shared bounding box — the union of all three — then
 * scale. Cropping each pose to its own content would resize and reposition the
 * bird between frames and the landing would jitter; sharing the box removes the
 * dead margin (so the bird is actually big enough to see) while keeping the
 * frames in register.
 */
const POSES = ["perched", "up", "spread"];
const raws = [];

for (const pose of POSES) {
  const { data, info } = await sharp(M(`assets/bird-${pose}-raw.png`))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  raws.push({ pose, data, info, bounds: alphaBounds(data, info.width, info.height) });
}

const union = raws.reduce((a, r) => ({
  left: Math.min(a.left, r.bounds.left),
  top: Math.min(a.top, r.bounds.top),
  right: Math.max(a.right, r.bounds.right),
  bottom: Math.max(a.bottom, r.bounds.bottom),
}), raws[0].bounds);

const region = {
  left: union.left,
  top: union.top,
  width: union.right - union.left + 1,
  height: union.bottom - union.top + 1,
};

console.log(`  shared sprite box ${region.width}×${region.height} at ${region.left},${region.top}`);

const SPRITE = 320;

for (const { pose, data, info } of raws) {
  for (const [name, tint] of [["pine", PINE], ["paper", PAPER]]) {
    const tinted = Buffer.from(data);
    for (let i = 0; i < tinted.length; i += 4) {
      if (tinted[i + 3] > 0) {
        tinted[i] = tint.r;
        tinted[i + 1] = tint.g;
        tinted[i + 2] = tint.b;
      }
    }

    const out = M(`assets/bird-${pose}-${name}.png`);
    await mkdir(dirname(out), { recursive: true });

    await sharp(tinted, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .extract(region)
      .resize(SPRITE, SPRITE, { fit: "contain", background: CLEAR })
      .png({ compressionLevel: 9 })
      .toFile(out);

    console.log(`  ${out.replace(root, ".")}  ${SPRITE}×${SPRITE}`);
  }
}

// A tidy, small version of the master for use in the marketing page itself.
await sharp(MASTER)
  .resize(720, 720, { fit: "inside" })
  .png({ compressionLevel: 9, palette: true })
  .toFile(W("logo-720.png"));
console.log("  ./apps/web/public/logo-720.png  720 wide");

console.log("Done.");
