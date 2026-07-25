/**
 * ClarityAI Extension Build Script
 *
 * Orchestrates:
 *  1. Generate icons (pngjs)
 *  2. Bundle content script  (esbuild → IIFE)
 *  3. Bundle background SW   (esbuild → ESM)
 *  4. Build popup React app  (Vite → dist/popup/)
 *  5. Copy icons + manifest  → dist/
 */

import { build } from "esbuild";
import { execSync } from "child_process";
import {
  mkdirSync,
  cpSync,
  writeFileSync,
  readFileSync,
} from "fs";

mkdirSync("dist", { recursive: true });

// ── 1. Content script (IIFE — no ES module semantics on page) ──────────────
console.log("📦 Bundling content script…");
await build({
  entryPoints: ["src/content/index.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
  target: ["chrome90", "firefox88"],
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  logLevel: "info",
});

// ── 2. Background service worker (ESM — Chrome MV3 supports it) ───────────
console.log("📦 Bundling background service worker…");
await build({
  entryPoints: ["src/background/index.ts"],
  bundle: true,
  outfile: "dist/background.js",
  format: "esm",
  target: ["chrome90"],
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  logLevel: "info",
});

// ── 3. Popup (Vite handles React + Tailwind) ──────────────────────────────
console.log("⚡ Building popup with Vite…");
execSync("pnpm exec vite build --config vite.config.ts", { stdio: "inherit" });

// ── 4. Copy icons ─────────────────────────────────────────────────────────
console.log("🎨 Copying icons…");
cpSync("public/icons", "dist/icons", { recursive: true });

// ── 5. Write manifest.json with resolved file paths ───────────────────────
console.log("📄 Writing dist/manifest.json…");
const manifest = JSON.parse(readFileSync("manifest.json", "utf-8"));
// Point to built artefacts
manifest.action.default_popup = "popup/index.html";
manifest.content_scripts[0].js = ["content.js"];
manifest.background.service_worker = "background.js";
// Remove host_permissions unsupported in some stores (keep for dev)
writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));

console.log("\n✅  Extension built → dist/\n");
console.log("To install in Chrome:");
console.log("  1. Go to chrome://extensions");
console.log("  2. Enable Developer Mode");
console.log("  3. Click 'Load unpacked' → select the dist/ folder\n");
