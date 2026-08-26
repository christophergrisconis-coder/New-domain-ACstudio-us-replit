#!/usr/bin/env node
/**
 * Decode icon-binaries.b64.json into public/ PNG + ICO assets.
 * Runs on predev/prebuild so deploys always get full-bleed icons.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const bundlePath = path.join(publicDir, "icon-binaries.b64.json");

if (!fs.existsSync(bundlePath)) {
  console.warn(`[decode-icons] missing ${bundlePath}; skip`);
  process.exit(0);
}

const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8"));
for (const [name, b64] of Object.entries(bundle)) {
  const out = path.join(publicDir, name);
  fs.writeFileSync(out, Buffer.from(b64, "base64"));
  console.log(`[decode-icons] wrote ${name} (${fs.statSync(out).size} bytes)`);
}
