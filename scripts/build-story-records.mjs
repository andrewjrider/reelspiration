#!/usr/bin/env node
/**
 * Takes the output of parse-volumes.mjs (raw structured JSON per volume)
 * and converts it into StoryRecord-shaped entries for the site, including
 * challenge-tag assignment by keyword matching against each story's
 * audience-moment text, pattern tags, and hook.
 *
 * This is a heuristic, not an editorial judgment — every assignment
 * should be spot-checked, especially for stories that match multiple
 * challenge slugs or none at all (falls back to the volume default).
 *
 * Usage: node scripts/build-story-records.mjs <parsed-dir> <output-file>
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CHALLENGE_KEYWORDS = {
  "too-old": ["too old", "too late", "missed my chance", "age", "retire", "younger"],
  rejected: ["rejected", "turned down", "said no", "told no", "denied", "fired", "cut from"],
  "starting-over": [
    "started over",
    "lost what i built",
    "bankruptcy",
    "lost everything",
    "begin again",
    "rebuild",
    "start again",
  ],
  "need-courage": ["courage", "afraid", "fear", "scared", "brave", "dared"],
  recovering: [
    "recovery",
    "recovering",
    "injury",
    "illness",
    "disability",
    "lost her legs",
    "lost his legs",
    "diagnosis",
    "amputation",
    "paralyzed",
  ],
  "need-leadership": ["leadership", "leader", "command", "team", "responsible for"],
};

function scoreChallenges(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [slug, keywords] of Object.entries(CHALLENGE_KEYWORDS)) {
    scores[slug] = keywords.filter((k) => lower.includes(k)).length;
  }
  return scores;
}

function assignChallenges(story, defaultChallenges) {
  const text = [
    ...(story.audienceMoments || []),
    story.pattern || "",
    story.tagline || "",
    story.openingHook || "",
  ].join(" ");
  const scores = scoreChallenges(text);
  const matched = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);
  return matched.length ? matched : defaultChallenges;
}

function toStoryRecord(story) {
  const dek = story.tagline || story.openingHook || "";
  const challenges = assignChallenges(story, story.defaultChallenges);

  return {
    slug: story.slug,
    subject: story.subject,
    dek,
    challenges,
    collections: story.collections,

    canonicalStory: story.canonicalStory,
    decision: story.decision || undefined,

    reelspiration: story.reelspiration,
    principle: story.principle,
    nextStep: story.nextStep,
    whyItMatters: story.whyItMatters,

    reelScriptAuthored: story.reelScriptAuthored || undefined,
    carouselAuthored: story.carouselAuthored || undefined,
    linkedInAuthored: story.linkedInAuthored || undefined,
    visualDirection: story.visualDirection || undefined,
    editorialGuardrails: story.editorialGuardrails || undefined,

    sourceId: story.sourceId,
    pattern: story.pattern || undefined,
    audienceMoments: story.audienceMoments && story.audienceMoments.length ? story.audienceMoments : undefined,

    recognitionScore: 28,
    storyStrengthScore: 18,
    relatabilityScore: 15,
    rippleScore: 10,

    sources: story.sources,
    // Never auto-publish — every record needs an editorial pass before
    // it's status: "published". See the validation report this script
    // prints for what's blocking each one.
    status: "needs-review",
    publishedAt: new Date().toISOString().slice(0, 10),
  };
}

function validate(record) {
  const errors = [];
  if (!record.dek) errors.push("no dek/hook text found");
  if (!record.canonicalStory || record.canonicalStory.split(" ").length < 40)
    errors.push("canonicalStory missing or suspiciously short");
  if (!record.reelspiration) errors.push("missing THE REELSPIRATION");
  if (!record.principle) errors.push("missing THE PRINCIPLE");
  if (!record.nextStep) errors.push("missing YOUR NEXT STEP");
  if (!record.whyItMatters) errors.push("missing WHY THIS MATTERS/CHANGED HISTORY");
  if (record.challenges.length === 0) errors.push("no challenge tag assigned");
  if (!record.sources || record.sources.length === 0)
    errors.push("no sources — required before publish");
  return errors;
}

function main() {
  const [, , parsedDir, outFile] = process.argv;
  if (!parsedDir || !outFile) {
    console.error("Usage: node scripts/build-story-records.mjs <parsed-dir> <out-file.json>");
    process.exit(1);
  }

  const files = readdirSync(parsedDir).filter((f) => f.endsWith(".json"));
  const records = [];
  let clean = 0;
  let flagged = 0;

  for (const file of files) {
    const stories = JSON.parse(readFileSync(join(parsedDir, file), "utf-8"));
    for (const story of stories) {
      const record = toStoryRecord(story);
      const errors = validate(record);
      records.push(record);
      if (errors.length === 0) {
        clean++;
      } else {
        flagged++;
        console.log(`REVIEW  ${record.slug} (${file})`);
        errors.forEach((e) => console.log(`          - ${e}`));
      }
    }
  }

  writeFileSync(outFile, JSON.stringify(records, null, 2));
  console.log(`\n${clean} clean, ${flagged} flagged for review. Wrote ${records.length} records to ${outFile}`);
  console.log(`All records land as status: "needs-review" — none are auto-published.`);
}

main();
