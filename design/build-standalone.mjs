/**
 * Inline design/preview.html into a single self-contained file.
 *
 *   node design/build-standalone.mjs [outfile]
 *
 * Pulls app/globals.css into a <style> block and rewrites every ../public
 * image reference as a data: URI, so the result renders with no server, no
 * build step and no external requests beyond Google Fonts.
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const out = resolve(process.argv[2] ?? resolve(here, "preview.standalone.html"));

const MIME = { webp: "image/webp", png: "image/png", jpg: "image/jpeg", svg: "image/svg+xml" };

let html = await readFile(resolve(here, "preview.html"), "utf8");

// 1. Inline the stylesheet.
const css = await readFile(resolve(root, "app/globals.css"), "utf8");
html = html.replace(
  /<link rel="stylesheet" href="\.\.\/app\/globals\.css" \/>/,
  `<style>\n${css}\n</style>`,
);

// 2. Inline every referenced image as a data: URI.
const refs = [...new Set([...html.matchAll(/\.\.\/public\/([\w.-]+)/g)].map((m) => m[1]))];

for (const file of refs) {
  const bytes = await readFile(resolve(root, "public", file));
  const ext = file.split(".").pop().toLowerCase();
  const uri = `data:${MIME[ext] ?? "application/octet-stream"};base64,${bytes.toString("base64")}`;
  html = html.replaceAll(`../public/${file}`, uri);
  console.log(`  inlined ${file} (${(bytes.length / 1024).toFixed(0)} KB)`);
}

await writeFile(out, html, "utf8");
console.log(`\nWrote ${out} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);
