#!/usr/bin/env -S npx tsx
/**
 * Reelspiration social export pipeline — batch mode.
 *
 * Exports every published story (or a specific list, or everything
 * matching a challenge/collection) into one dated folder in a single
 * run, so a production day starts with a full batch of packages ready
 * to hand to an editor instead of running export:social once per story.
 *
 * Usage:
 *   npm run export:social:batch
 *     -> exports every published story
 *
 *   npm run export:social:batch -- --slugs kobe-bryant,apollo-13
 *     -> exports just those, still under a dated folder
 *
 *   npm run export:social:batch -- --collection greatest-comebacks
 *     -> exports every published story in that collection
 *
 *   npm run export:social:batch -- --challenge need-courage
 *     -> exports every published story tagged with that challenge
 *
 * Output: exports/<YYYY-MM-DD>/<slug>/package.md, plus a single
 * INDEX.md in that same dated folder summarizing what shipped, which
 * scripts ran long, and which used authored vs. generated content —
 * the thing you'd actually skim Monday morning before opening any
 * individual package.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  getPublishedStories,
  getStoriesByChallenge,
  getStoriesByCollection,
  getStory,
} from "../src/data/stories";
import { StoryRecord } from "../src/data/types";
import { buildPackage } from "./lib/social-package";

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      args[key] = value;
    }
  }
  return args;
}

function resolveStorySet(args: Record<string, string>): StoryRecord[] {
  if (args.slugs) {
    const slugs = args.slugs.split(",").map((s) => s.trim());
    const found: StoryRecord[] = [];
    for (const slug of slugs) {
      const s = getStory(slug);
      if (!s) {
        console.error(`  ! No story found for slug "${slug}" — skipping.`);
        continue;
      }
      if (s.status !== "published") {
        console.error(`  ! "${slug}" is status "${s.status}", not published — skipping. Approve it first if it should ship.`);
        continue;
      }
      found.push(s);
    }
    return found;
  }
  if (args.collection) {
    return getStoriesByCollection(args.collection);
  }
  if (args.challenge) {
    return getStoriesByChallenge(args.challenge);
  }
  return getPublishedStories();
}

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const stories = resolveStorySet(args);

  if (stories.length === 0) {
    console.error("No stories matched. Check --slugs / --collection / --challenge, or that anything is published yet.");
    process.exit(1);
  }

  const dateDir = resolve("exports", todayStamp());
  mkdirSync(dateDir, { recursive: true });

  const rows: string[] = [];
  let overTargetCount = 0;
  let authoredReelCount = 0;

  console.log(`Exporting ${stories.length} package(s) to exports/${todayStamp()}/\n`);

  for (const story of stories) {
    const result = buildPackage(story);
    const dir = resolve(dateDir, story.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "package.md"), result.markdown);

    if (result.reelOverTarget) overTargetCount++;
    if (result.usingAuthoredReel) authoredReelCount++;

    const flag = result.reelOverTarget ? " ⚠ over 60s" : "";
    console.log(`  ${story.slug}${flag}`);

    rows.push(
      `| [${story.subject}](./${story.slug}/package.md) | ${result.reelSeconds}s | ${
        result.reelOverTarget ? "**over target**" : "on target"
      } | ${result.usingAuthoredReel ? "authored" : "generated"} |`
    );
  }

  const index = `# Export batch — ${todayStamp()}

${stories.length} package(s) exported. ${overTargetCount} script(s) over the 60s target
and need a trim before production. ${authoredReelCount} used your authored
manuscript voiceover directly; the rest were generated from atomic fields.

| Story | Reel length | Pacing | Script source |
|---|---|---|---|
${rows.join("\n")}

## Next steps

1. Open each package.md above — the shot list at the bottom tells the
   editor which visual template to use.
2. Anything flagged "over target" needs a trim pass before it goes to
   voice production — the script is still usable as a starting point,
   it's just currently longer than a 60s Reel allows.
3. Once produced, every version should link back to the story's
   reelspiration.com page per the pre-publish checklist in each package.
`;

  writeFileSync(resolve(dateDir, "INDEX.md"), index);

  console.log(`\n${stories.length} exported. ${overTargetCount} over the 60s target.`);
  console.log(`Summary: exports/${todayStamp()}/INDEX.md`);
  console.log(
    `Note: INDEX.md reflects only this run. Running a second filtered batch\n` +
      `today will overwrite it (individual package folders are unaffected) —\n` +
      `run one batch per day covering everything you want summarized together.`
  );
}

main();
