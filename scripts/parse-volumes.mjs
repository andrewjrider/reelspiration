#!/usr/bin/env node
/**
 * Parses the real Reelspiration volumes (converted from .docx to markdown
 * via pandoc) into structured JSON, one file per volume, ready for the
 * import-stories.mjs validation pipeline.
 *
 * This is NOT the same as import-stories.mjs's alias system — that script
 * expects clean field names. This one exists because the source is prose
 * markdown with heading-delimited sections, heterogeneous heading text
 * across volumes/eras of the manuscript, and story boundaries that have
 * to be distinguished from front-matter contents lists. One-time (or
 * per-volume-revision) conversion step; output feeds the existing pipeline.
 *
 * Usage: node scripts/parse-volumes.mjs <markdown-dir> <output-dir>
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

// Volume config: maps each source file to the challenges/collections it
// should carry, since the source volumes don't tag audience-moment slugs
// the same way the site's taxonomy does. Skipped volumes are noted with
// a reason rather than silently dropped.
const VOLUME_CONFIG = {
  "Reelspiration_Volume_1_Business_Builders_v2.md": {
    collections: ["business-builders", "entrepreneurs"],
    defaultChallenges: ["starting-over"],
  },
  "Reelspiration_Volume_2_Athletic_Adversity_v2.md": {
    collections: ["athletic-adversity", "athletes"],
    defaultChallenges: ["recovering"],
  },
  "Reelspiration_Volume_3_Inventors_Scientists_Problem_Solvers.md": {
    collections: ["business-builders"],
    defaultChallenges: ["need-courage"],
  },
  "Reelspiration_Volume_4_Historys_Greatest_Decisions.md": {
    collections: ["historic-decisions"],
    defaultChallenges: ["need-leadership"],
  },
  "Reelspiration_Volume_5_Military_Courage.md": {
    collections: ["military-courage"],
    defaultChallenges: ["need-courage"],
  },
  "Reelspiration_Volume_5B_Historys_Greatest_Military_Commanders.md": {
    collections: ["military-courage", "historic-decisions"],
    defaultChallenges: ["need-leadership"],
  },
  "Reelspiration_Volume_6_Survival_Recovery_Human_Will.md": {
    collections: ["greatest-comebacks"],
    defaultChallenges: ["recovering"],
  },
  "Reelspiration_Volume_7_The_Worlds_Greatest_Comebacks.md": {
    collections: ["greatest-comebacks"],
    defaultChallenges: ["starting-over"],
  },
  "Reelspiration_Volume_7_The_Worlds_Greatest_Comebacks_Planning_Manuscript.md": {
    skip: true,
    reason:
      "Early planning draft. Uses the same RS-C001..C010 IDs as the finished Volume 7 manuscript but for a DIFFERENT set of subjects (Jordan, Jobs, Disney, Hamilton...) that were replaced in the final version (Woods, Downey Jr., Foreman, Turner...). Flagging instead of silently dropping — confirm this was intentionally superseded before archiving it.",
  },
  "Reelspiration_Volume_8_Greatest_Teams_That_Refused_to_Quit.md": {
    collections: ["teams-that-refused-to-quit"],
    defaultChallenges: ["need-leadership"],
  },
  "Reelspiration_Volume_9_The_Worlds_Greatest_Entrepreneurs.md": {
    collections: ["entrepreneurs", "business-builders"],
    defaultChallenges: ["starting-over"],
  },
  "Reelspiration_Volume_10_The_Greatest_Athletes_Ever.md": {
    collections: ["athletes"],
    defaultChallenges: ["recovering"],
  },
};

function stripMd(s) {
  return s
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[|+=\-\s]+/, "")
    .replace(/[|+=\-\s]+$/, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\\\|/g, "|")
    .replace(/\\/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Matches a real story heading line: optional leading #, optional bold
// markers, "RS-<code>", then a separator (\|, |, ---, or •), then a name.
const ID_LINE = /^#{0,2}\s*\**RS-([A-Za-z0-9]+)\**\s*(?:\\\||\||---|•)\s*(.+?)\**\s*$/;

function findStoryStarts(lines) {
  const candidates = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ID_LINE);
    if (m) candidates.push({ line: i, code: m[1], rawName: stripMd(m[2]) });
  }

  const starts = [];
  for (let c = 0; c < candidates.length; c++) {
    const i = candidates[c].line;
    const nextIdx = c + 1 < candidates.length ? candidates[c + 1].line : Math.min(i + 200, lines.length);
    const span = lines.slice(i, nextIdx).join(" ");
    const hasPatternWords = /REELSPIRATION/i.test(span) && /PATTERN/i.test(span);
    const hasAudienceWords = /AUDIENCE/i.test(span) && /MOMENT/i.test(span);
    const hasCanonical = /Canonical Website Story/i.test(span);
    if (hasPatternWords || hasAudienceWords || hasCanonical) {
      starts.push(candidates[c]);
    }
  }
  return starts;
}

function extractOpeningHook(blockText) {
  const lines = blockText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (/OPENING HOOK/i.test(raw)) {
      // Same-line content after the label (grid table cell)
      const sameLine = raw.replace(/.*OPENING HOOK\*{0,2}/i, "").trim();
      const collected = [sameLine];
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        const l = lines[j];
        if (/^[\s\-+=|]*$/.test(l)) break; // table border / blank
        if (/STATUS|SPORT|PRODUCTION STATUS|^\*\*/.test(l)) break;
        collected.push(l);
      }
      return stripMd(collected.join(" ")).replace(/\s+/g, " ").trim();
    }
  }
  return "";
}

function extractSection(blockText, headingPatterns) {
  const lines = blockText.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = stripMd(lines[i]).toLowerCase();
    if (headingPatterns.some((p) => l === p || l.startsWith(p))) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return "";

  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    const raw = lines[i];
    const isHeading = /^#{1,3}\s/.test(raw) || /^\*\*[A-Z][A-Z\s]+\*\*\s*$/.test(raw.trim());
    if (isHeading) {
      end = i;
      break;
    }
  }
  return lines
    .slice(start, end)
    .map((l) => stripMd(l))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractRaw(blockText, headingPatterns) {
  const lines = blockText.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = stripMd(lines[i]).toLowerCase();
    if (headingPatterns.some((p) => l === p || l.startsWith(p))) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^#{1,3}\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

function extractTagline(blockText) {
  const lines = blockText.split("\n");
  // Skip the ID line itself (index 0), find the first non-empty paragraph.
  let i = 1;
  while (i < lines.length && lines[i].trim() === "") i++;
  const paraLines = [];
  while (i < lines.length && lines[i].trim() !== "") {
    paraLines.push(lines[i]);
    i++;
  }
  const para = paraLines.join(" ").trim();
  if (/^\*\*.+\*\*$/.test(para) || /^\*[^*].+[^*]\*$/.test(para)) {
    return stripMd(para);
  }
  return "";
}

function extractWrappedLabelValue(blockText, labelWord1, labelWord2) {
  const lines = blockText.split("\n");
  const re1 = new RegExp(`\\*\\*${labelWord1}\\b`, "i");
  const re2 = new RegExp(`${labelWord2}\\*\\*`, "i");
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (re1.test(lines[i])) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return "";
  const parts = [lines[startIdx].replace(new RegExp(`.*\\*\\*${labelWord1}\\b`, "i"), "")];
  for (let j = startIdx + 1; j < Math.min(startIdx + 5, lines.length); j++) {
    const l = lines[j];
    if (re2.test(l)) {
      parts.push(l.replace(new RegExp(`.*${labelWord2}\\*\\*`, "i"), ""));
      // grab any further continuation lines until blank/border
      for (let k = j + 1; k < Math.min(j + 4, lines.length); k++) {
        if (/^\s*$/.test(lines[k]) || /^[\s\-+=|]*$/.test(lines[k])) break;
        if (/^\s*\*\*[A-Z]/.test(lines[k])) break;
        parts.push(lines[k]);
      }
      break;
    }
    parts.push(l);
  }
  return stripMd(parts.join(" ")).replace(/\s+/g, " ").trim();
}

function extractAudienceMoments(blockText) {
  // Quoted-style volumes (1/2/3/7/8/9/10): "AUDIENCE MOMENT | "..."
  const quoted = blockText.match(/AUDIENCE\s*\\?\|?\s*MOMENT[^"]*"([^"]+)"(?:\s*or\s*"([^"]+)")?/i);
  if (quoted) return [quoted[1], quoted[2]].filter(Boolean);
  // Wrapped-cell volumes (4/5/5B/6): plain sentence, no quotes.
  const wrapped = extractWrappedLabelValue(blockText, "AUDIENCE", "MOMENT");
  return wrapped ? [wrapped] : [];
}

function extractPattern(blockText) {
  const inline = blockText.match(/REELSPIRATION PATTERN\s*\\?\|\s*(.+?)\n/i);
  if (inline) return stripMd(inline[1]);
  return extractWrappedLabelValue(blockText, "REELSPIRATION", "PATTERN");
}

function extractSources(blockText) {
  const raw = extractRaw(blockText, ["starting source set", "starting source list"]);
  if (!raw) return [];
  const entries = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^[•\-]\s*/.test(trimmed)) {
      entries.push(stripMd(trimmed.replace(/^[•\-]\s*/, "")));
    } else if (entries.length) {
      // continuation of the previous bullet, wrapped by the doc converter
      entries[entries.length - 1] += " " + stripMd(trimmed);
    }
  }
  return entries.map((l) => {
    const urlMatch = l.match(/(https?:\/\/\S+)/);
    return {
      label: urlMatch ? l.replace(urlMatch[1], "").replace(/[:\s]+$/, "").trim() : l,
      url: urlMatch ? urlMatch[1] : "",
    };
  });
}

function parseVolume(filepath, config) {
  const text = readFileSync(filepath, "utf-8");
  const lines = text.split("\n");
  const starts = findStoryStarts(lines);

  const stories = [];
  for (let i = 0; i < starts.length; i++) {
    const s = starts[i];
    const endLine = i + 1 < starts.length ? starts[i + 1].line : lines.length;
    const block = lines.slice(s.line, endLine).join("\n");

    const subject = s.rawName;
    const tagline = extractTagline(block);
    const openingHook = extractOpeningHook(block) || tagline;
    const canonicalStory = extractSection(block, ["canonical website story"]);
    const whyItMatters = extractSection(block, [
      "why this changed history",
      "why this story matters",
      "why this matters",
    ]);
    const reelspiration = extractSection(block, ["the reelspiration"]);
    const principle = extractSection(block, ["the principle"]);
    const nextStep = extractSection(block, ["your next step"]);
    const decision = extractSection(block, ["the decision"]);
    const reelScriptAuthored = extractRaw(block, ["60-second reel voiceover"]);
    const carouselAuthored = extractRaw(block, ["seven-slide carousel"]);
    const linkedInAuthored = extractRaw(block, [
      "linkedin / business audience version",
      "linkedin",
    ]);
    const visualDirection = extractRaw(block, [
      "visual storyboard direction",
      "visual storyboard",
    ]);
    const editorialGuardrails = extractRaw(block, ["editorial guardrails"]);
    const sources = extractSources(block);
    const audienceMoments = extractAudienceMoments(block);
    const pattern = extractPattern(block);

    stories.push({
      sourceId: `RS-${s.code}`,
      subject,
      slug: slugify(subject),
      tagline,
      openingHook,
      canonicalStory,
      decision: decision || "",
      whyItMatters,
      reelspiration,
      principle,
      nextStep,
      reelScriptAuthored,
      carouselAuthored,
      linkedInAuthored,
      visualDirection,
      editorialGuardrails,
      sources,
      audienceMoments,
      pattern,
      collections: config.collections || [],
      defaultChallenges: config.defaultChallenges || [],
    });
  }
  return stories;
}

function main() {
  const [, , mdDir, outDir] = process.argv;
  if (!mdDir || !outDir) {
    console.error("Usage: node scripts/parse-volumes.mjs <markdown-dir> <output-dir>");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });

  const files = readdirSync(mdDir).filter((f) => f.startsWith("Reelspiration_Volume_"));
  let totalParsed = 0;
  const report = [];

  for (const file of files) {
    const config = VOLUME_CONFIG[file];
    if (!config) {
      report.push(`SKIP (no config)  ${file}`);
      continue;
    }
    if (config.skip) {
      report.push(`SKIP (flagged)    ${file}\n                    ${config.reason}`);
      continue;
    }
    const stories = parseVolume(join(mdDir, file), config);
    const outFile = join(outDir, file.replace(/\.md$/, ".json"));
    writeFileSync(outFile, JSON.stringify(stories, null, 2));
    totalParsed += stories.length;
    report.push(`OK   ${file}  -> ${stories.length} stories -> ${basename(outFile)}`);

    const incomplete = stories.filter(
      (s) => !s.canonicalStory || !s.reelspiration || !s.principle || !s.nextStep
    );
    if (incomplete.length) {
      report.push(
        `     ! ${incomplete.length} record(s) missing a core field: ${incomplete
          .map((s) => s.subject)
          .join(", ")}`
      );
    }
  }

  console.log(report.join("\n"));
  console.log(`\nTotal parsed: ${totalParsed} stories`);
}

main();
