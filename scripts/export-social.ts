#!/usr/bin/env -S npx tsx
/**
 * Reelspiration social export pipeline — single story.
 *
 * One published story record -> the full deliverable set the business
 * brief specifies under "Master story deliverables": Reel script,
 * extended cut, 7-slide carousel, LinkedIn adaptation, caption/hashtags/
 * SEO, and a shot list. See scripts/lib/social-package.ts for the actual
 * build logic — this file is just the single-story CLI wrapper. For
 * exporting every published story at once, use export-social-batch.ts.
 *
 * This does not render video — no tool cuts real footage from text alone.
 * It produces the script + creative brief a human editor (or a video-gen
 * tool) needs to actually build the Reel.
 *
 * Usage: npm run export:social -- <story-slug>
 * Output: exports/<story-slug>/package.md
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { getStory } from "../src/data/stories";
import { buildPackage } from "./lib/social-package";

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npm run export:social -- <story-slug>");
    process.exit(1);
  }

  const story = getStory(slug);
  if (!story) {
    console.error(`No story found with slug "${slug}". Check src/data/stories.ts.`);
    process.exit(1);
  }

  const result = buildPackage(story);

  const dir = resolve("exports", story.slug);
  mkdirSync(dir, { recursive: true });
  const outPath = resolve(dir, "package.md");
  writeFileSync(outPath, result.markdown);
  console.log(`Wrote ${outPath}`);
  if (result.reelOverTarget) {
    console.log(`  ! Reel script is ~${result.reelSeconds}s — over the 60s target, trim before production.`);
  }
}

main();
