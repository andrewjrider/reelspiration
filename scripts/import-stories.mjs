#!/usr/bin/env node
/**
 * Reelspiration content importer.
 *
 * Purpose: turn a raw volume export (JSON array of story objects, in
 * whatever field names the source used — ChatGPT, a spreadsheet export,
 * a Google Doc turned into JSON, etc.) into validated StoryRecord entries
 * that the website can render, WITHOUT hand-editing page templates.
 *
 * Usage:
 *   node scripts/import-stories.mjs data-incoming/volume-1.json
 *   node scripts/import-stories.mjs data-incoming/*.json --write
 *
 * Without --write: prints a validation report only (dry run).
 * With --write: also regenerates src/data/imported-stories.ts.
 *
 * This is intentionally forgiving about input field names (see ALIASES
 * below) because the source material will likely use different labels
 * than our internal schema (e.g. "person" instead of "subject", "conflict"
 * instead of "adversity"). Add more aliases as the real volumes reveal
 * their actual field names — that's expected and cheap to do.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const VALID_CHALLENGES = [
  "too-old",
  "rejected",
  "starting-over",
  "need-courage",
  "recovering",
  "need-leadership",
];

const VALID_COLLECTIONS = [
  "business-builders",
  "athletic-adversity",
  "greatest-comebacks",
  "historic-decisions",
  "teams-that-refused-to-quit",
  "entrepreneurs",
  "athletes",
  "military-courage",
];

// field name -> our schema key. First match wins per record.
const ALIASES = {
  subject: ["subject", "person", "name", "title", "who"],
  dek: ["dek", "hook", "headline", "summary", "oneLiner", "one_liner"],
  worldBefore: ["worldBefore", "world_before", "before", "background", "setup"],
  adversity: ["adversity", "conflict", "problem", "challenge_faced", "obstacle"],
  decision: ["decision", "choice", "theDecision"],
  turningPoint: ["turningPoint", "turning_point", "resolution", "outcome"],
  reelspiration: ["reelspiration", "theReelspiration", "takeaway"],
  principle: ["principle", "thePrinciple", "lesson"],
  nextStep: ["nextStep", "yourNextStep", "next_step", "action"],
  whyItMatters: ["whyItMatters", "why_it_matters", "whyThisMatters", "significance"],
  sources: ["sources", "citations", "references"],
};

const REQUIRED = [
  "subject",
  "dek",
  "worldBefore",
  "adversity",
  "decision",
  "turningPoint",
  "reelspiration",
  "principle",
  "nextStep",
  "whyItMatters",
];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pick(raw, key) {
  for (const alias of ALIASES[key]) {
    if (raw[alias] !== undefined && raw[alias] !== null && raw[alias] !== "") {
      return raw[alias];
    }
  }
  return undefined;
}

function normalizeTags(value, allowed, label, warnings) {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  const cleaned = arr
    .map((v) => slugify(String(v)))
    .filter((v) => {
      const ok = allowed.includes(v);
      if (!ok) warnings.push(`unrecognized ${label} "${v}" — will be dropped, add it to the taxonomy or fix the source data`);
      return ok;
    });
  return cleaned;
}

function convertRecord(raw, index) {
  const errors = [];
  const warnings = [];
  const record = {};

  for (const key of Object.keys(ALIASES)) {
    if (key === "sources") continue;
    record[key] = pick(raw, key);
  }

  for (const key of REQUIRED) {
    if (!record[key]) errors.push(`missing required field: ${key}`);
  }

  const subject = record.subject || `untitled-${index}`;
  record.slug = raw.slug ? slugify(raw.slug) : slugify(subject);

  record.challenges = normalizeTags(raw.challenges ?? raw.audienceMoments ?? raw.moments, VALID_CHALLENGES, "challenge", warnings);
  if (record.challenges.length === 0) errors.push("no valid challenge tag — assign at least one of: " + VALID_CHALLENGES.join(", "));

  record.collections = normalizeTags(raw.collections ?? raw.category, VALID_COLLECTIONS, "collection", warnings);
  if (record.collections.length === 0) warnings.push("no collection assigned — story will only be reachable via challenge pages");

  const rawSources = pick(raw, "sources");
  record.sources = Array.isArray(rawSources)
    ? rawSources.map((s) => (typeof s === "string" ? { label: s, url: "" } : { label: s.label ?? s.title ?? "Source", url: s.url ?? "" }))
    : [];
  if (record.sources.length === 0) warnings.push("no sources listed — required before this can move to 'published' status");

  record.recognitionScore = Number(raw.recognitionScore ?? 25);
  record.storyStrengthScore = Number(raw.storyStrengthScore ?? 15);
  record.relatabilityScore = Number(raw.relatabilityScore ?? 12);
  record.rippleScore = Number(raw.rippleScore ?? 8);

  record.status = errors.length > 0 ? "needs-review" : "draft"; // never auto-publish
  record.publishedAt = raw.publishedAt ?? new Date().toISOString().slice(0, 10);

  return { record, errors, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const files = args.filter((a) => !a.startsWith("--"));

  if (files.length === 0) {
    console.error("Usage: node scripts/import-stories.mjs <file.json> [file2.json ...] [--write]");
    process.exit(1);
  }

  const allRecords = [];
  let totalOk = 0;
  let totalReview = 0;

  for (const file of files) {
    const raw = JSON.parse(readFileSync(resolve(file), "utf-8"));
    const list = Array.isArray(raw) ? raw : [raw];

    console.log(`\n${file} — ${list.length} record(s)`);
    list.forEach((r, i) => {
      const { record, errors, warnings } = convertRecord(r, i);
      allRecords.push(record);

      if (errors.length === 0) {
        totalOk++;
        console.log(`  OK       ${record.slug}`);
      } else {
        totalReview++;
        console.log(`  REVIEW   ${record.slug}`);
        errors.forEach((e) => console.log(`             - ${e}`));
      }
      warnings.forEach((w) => console.log(`             ! ${w}`));
    });
  }

  console.log(`\n${totalOk} ready as drafts, ${totalReview} need editorial review before they'll pass validation.`);
  console.log(`Nothing is auto-published — every imported record lands as "draft" or "needs-review" until an editor flips status to "published" in src/data/imported-stories.ts.`);

  if (write) {
    const body = `import { StoryRecord } from "./types";

// Auto-generated by scripts/import-stories.mjs — do not hand-edit.
// Re-run the import script to regenerate this file from source volumes.
// To publish a story, change its status to "published" below (or move
// editing to the future admin UI described in /CONTENT_IMPORT.md).

export const importedStories: StoryRecord[] = ${JSON.stringify(allRecords, null, 2)};
`;
    writeFileSync(resolve("src/data/imported-stories.ts"), body);
    console.log(`\nWrote ${allRecords.length} records to src/data/imported-stories.ts`);
  } else {
    console.log(`\nDry run only — re-run with --write to generate src/data/imported-stories.ts`);
  }
}

main();
