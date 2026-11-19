// gta6-meme-x-01 entry: this program's only job is to hand POST.json to the
// grader. The entry itself is the X post: a GTA 6 launch-week meme whose
// first picture is the Vice City billboard meme (entry/meme.png), posted
// from @0xLudd with the play code in its text. POST.json at the repo root
// holds the post's address; this copies it into the output directory the
// gate reads. Nothing else the program writes is judged.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = join(botDir, "POST.json");
const target = join(outDir, "POST.json");

if (!existsSync(source)) {
  console.error(`no POST.json in ${botDir}; post the meme on X first, then fill POST.json in`);
  process.exit(1);
}

// Refuse a placeholder address: the gate reads the post from X, so a
// POST.json that still names no real post must never be submitted.
const post = JSON.parse(readFileSync(source, "utf8")) as { url?: unknown };
if (typeof post.url !== "string" || !/^https:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
  console.error(`POST.json does not hold a real X post address yet: ${String(post.url)}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`POST.json -> ${target} (${post.url})`);
