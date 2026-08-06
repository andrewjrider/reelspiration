#!/usr/bin/env -S npx tsx
/**
 * Reelspiration social export pipeline.
 *
 * One published story record -> the full deliverable set the business
 * brief specifies under "Master story deliverables":
 *   - 35-60s Reel/Short voiceover script
 *   - 60-90s extended cut
 *   - 7-slide Instagram/LinkedIn carousel
 *   - LinkedIn business/leadership adaptation
 *   - Caption, hashtags, alt text, SEO title, meta description
 *   - Shot list referencing the brief's 5 visual templates
 *
 * This does not render video — no tool cuts real footage from text alone.
 * It produces the script + creative brief a human editor (or a video-gen
 * tool, see PRODUCTION_TOOLS.md) needs to actually build the Reel. That's
 * a real, honest handoff point, not a gap I'm papering over.
 *
 * Usage: npm run export:social -- <story-slug>
 * Output: exports/<story-slug>/package.md
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { getStory } from "../src/data/stories";
import { StoryRecord } from "../src/data/types";
import { getChallenge } from "../src/data/challenges";

const VISUAL_TEMPLATES: Record<string, string> = {
  "documentary-portrait":
    "Documentary Portrait — recognizable subject, restrained motion, authentic archival context.",
  "timeline-transformation":
    "Timeline Transformation — before / adversity / decision / outcome / ripple, shown as a sequence.",
  "decision-moment":
    "Decision Moment — the single critical choice as the emotional center of the frame.",
  "event-reconstruction":
    "Event Reconstruction — for team/historic events (multiple people or a public event).",
  "quote-led":
    "Quote-Led Card — the Reelspiration line over one verifiable fact and a strong portrait.",
};

function pickTemplates(story: StoryRecord): string[] {
  if (
    story.collections.includes("teams-that-refused-to-quit") ||
    story.collections.includes("historic-decisions")
  ) {
    return ["event-reconstruction", "timeline-transformation"];
  }
  if (story.collections.includes("military-courage")) {
    return ["decision-moment", "quote-led"];
  }
  return ["documentary-portrait", "timeline-transformation"];
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function buildReelScript(story: StoryRecord): string {
  if (story.canonicalStory) {
    return [
      `[HOOK] ${story.dek}`,
      `[STORY] ${story.canonicalStory}`,
      story.decision ? `[DECISION] ${story.decision}` : "",
      `[SIGNATURE MOMENT — hold 1s, near-silence, music ducks out]`,
      `[REELSPIRATION] ...and that's the Reelspiration: ${story.reelspiration}`,
      `[ACTION — energy lifts here, the one deliberate pace change in the video] ${story.nextStep}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }
  return [
    `[HOOK] ${story.dek}`,
    `[STRUGGLE] ${story.adversity}`,
    `[DECISION] ${story.decision}`,
    `[OUTCOME] ${story.turningPoint}`,
    `[SIGNATURE MOMENT — hold 1s, near-silence, music ducks out]`,
    `[REELSPIRATION] ...and that's the Reelspiration: ${story.reelspiration}`,
    `[ACTION — energy lifts here, the one deliberate pace change in the video] ${story.nextStep}`,
  ].join("\n\n");
}

function buildExtendedScript(story: StoryRecord): string {
  if (story.canonicalStory) {
    return [
      `[HOOK] ${story.dek}`,
      `[STORY] ${story.canonicalStory}`,
      story.decision ? `[DECISION] ${story.decision}` : "",
      `[SIGNATURE MOMENT — hold 1s, near-silence, music ducks out]`,
      `[REELSPIRATION] ...and that's the Reelspiration: ${story.reelspiration}`,
      `[PRINCIPLE] ${story.principle}`,
      `[ACTION — energy lifts here] ${story.nextStep}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }
  return [
    `[WORLD BEFORE] ${story.worldBefore}`,
    `[HOOK] ${story.dek}`,
    `[STRUGGLE] ${story.adversity}`,
    `[DECISION] ${story.decision}`,
    `[OUTCOME] ${story.turningPoint}`,
    `[SIGNATURE MOMENT — hold 1s, near-silence, music ducks out]`,
    `[REELSPIRATION] ...and that's the Reelspiration: ${story.reelspiration}`,
    `[PRINCIPLE] ${story.principle}`,
    `[ACTION — energy lifts here] ${story.nextStep}`,
  ].join("\n\n");
}

function buildCarousel(story: StoryRecord) {
  if (story.canonicalStory) {
    return [
      { slide: 1, text: `${story.subject}\n${story.dek}` },
      { slide: 2, text: `THE STORY\n${story.canonicalStory.slice(0, 280)}${story.canonicalStory.length > 280 ? "..." : ""}` },
      { slide: 3, text: `THE REELSPIRATION\n${story.reelspiration}` },
      { slide: 4, text: `THE PRINCIPLE\n${story.principle}` },
      {
        slide: 5,
        text: `YOUR NEXT STEP\n${story.nextStep}\n\nFull record: reelspiration.com/stories/${story.slug}`,
      },
    ];
  }
  return [
    { slide: 1, text: `${story.subject}\n${story.dek}` },
    { slide: 2, text: `THE WORLD BEFORE\n${story.worldBefore}` },
    { slide: 3, text: `THE ADVERSITY\n${story.adversity}` },
    { slide: 4, text: `THE DECISION\n${story.decision}` },
    { slide: 5, text: `THE TURNING POINT\n${story.turningPoint}` },
    { slide: 6, text: `THE REELSPIRATION\n${story.reelspiration}` },
    {
      slide: 7,
      text: `YOUR NEXT STEP\n${story.nextStep}\n\nFull record: reelspiration.com/stories/${story.slug}`,
    },
  ];
}

function buildLinkedIn(story: StoryRecord): string {
  if (story.canonicalStory) {
    return [
      `${story.subject}: ${story.dek}`,
      story.canonicalStory,
      story.principle,
      `Why this matters for teams and leaders: ${story.whyItMatters}`,
      `Full record: reelspiration.com/stories/${story.slug}`,
    ].join("\n\n");
  }
  return [
    `${story.subject}: ${story.dek}`,
    story.worldBefore,
    story.adversity,
    `${story.decision} ${story.turningPoint}`,
    story.principle,
    `Why this matters for teams and leaders: ${story.whyItMatters}`,
    `Full record: reelspiration.com/stories/${story.slug}`,
  ].join("\n\n");
}

function buildCaption(story: StoryRecord): string {
  return `${story.dek}\n\n${story.reelspiration}\n\nFull story at the link in bio. #Reelspiration`;
}

function buildHashtags(story: StoryRecord): string {
  const base = ["#Reelspiration", "#RealStories", "#Perseverance"];
  const fromChallenge = story.challenges.map((c) => "#" + c.replace(/-/g, ""));
  const fromCollection = story.collections.map(
    (c) =>
      "#" +
      c
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join("")
  );
  return [...base, ...fromChallenge, ...fromCollection].join(" ");
}

function buildSEO(story: StoryRecord) {
  return {
    title: `${story.subject}: ${story.dek.split(".")[0]}. | Reelspiration`,
    metaDescription:
      story.dek.length <= 155 ? story.dek : story.dek.slice(0, 152) + "...",
    altText: `Portrait of ${story.subject}, subject of a Reelspiration story about ${
      story.challenges[0]?.replace(/-/g, " ") ?? "perseverance"
    }.`,
  };
}

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

  const usingAuthoredReel = Boolean(story.reelScriptAuthored);
  const reel = story.reelScriptAuthored || buildReelScript(story);
  const extended = buildExtendedScript(story);
  const carouselText = story.carouselAuthored
    ? story.carouselAuthored
    : buildCarousel(story)
        .map((s) => `**Slide ${s.slide}**\n${s.text}`)
        .join("\n\n");
  const linkedIn = story.linkedInAuthored || buildLinkedIn(story);
  const caption = buildCaption(story);
  const hashtags = buildHashtags(story);
  const seo = buildSEO(story);
  const templates = pickTemplates(story);
  const primaryChallenge = getChallenge(story.challenges[0]);

  const reelWords = wordCount(reel);
  const extendedWords = wordCount(extended);
  const VO_WPM = 137; // brand spec: 130-145 wpm, measured documentary pace

  const md = `# Social Package — ${story.subject}

Generated from: reelspiration.com/stories/${story.slug}
Audience moment: "${primaryChallenge?.prompt ?? story.challenges[0]}"

---

## Reel / Short script (35-60s target)
Source: ${usingAuthoredReel ? "your authored manuscript voiceover, beat tags added" : "generated from atomic fields"}
Word count: ${reelWords} (~${Math.round((reelWords / VO_WPM) * 60)}s at ${VO_WPM} wpm, the brand's measured documentary pace — ${
    (reelWords / VO_WPM) * 60 > 60 ? "trim, this is over 60s" : "on target"
  })
Bracketed tags mark beats for the editor/narrator — not spoken aloud.

${reel}

---

## Extended cut script (60-90s target)
Word count: ${extendedWords} (~${Math.round((extendedWords / VO_WPM) * 60)}s at ${VO_WPM} wpm)

${extended}

---

## Carousel
Source: ${story.carouselAuthored ? "your authored manuscript" : "generated from atomic fields"}

${carouselText}

---

## LinkedIn adaptation

${linkedIn}

---

## Caption

${caption}

## Hashtags

${hashtags}

---

## SEO

- **Title tag:** ${seo.title}
- **Meta description:** ${seo.metaDescription}
- **Alt text:** ${seo.altText}

---

## Shot list / visual direction

Recommended templates for this story: ${templates.map((t) => `**${t}**`).join(", ")}

${templates.map((t) => `- ${VISUAL_TEMPLATES[t]}`).join("\n")}

**Music:** minor-to-major turn lands on the Decision beat, not before. Single
instrument lead (piano/cello/sparse strings) — no choir swells, no snare-roll
builds. Duck to near-silent under the signature moment and under all narration.

**Signature moment:** after the Outcome beat, hold the frame for 1 full
second, music ducks to near-silent, then narrator delivers "...and that's
the Reelspiration:" at the same flat cadence used on every video, before
the Reelspiration line itself.

Subtitles: burned-in, high contrast, matches brand type. End card: Reelspiration
wordmark + "reelspiration.com/stories/${story.slug}".

---

## Pre-publish checklist (from the brief's production workflow)

- [ ] Fact-check record complete, all consequential claims sourced
- [ ] Image/video rights confirmed for every visual asset used
- [ ] Accessibility: alt text, captions/subtitles present
- [ ] Brand consistency: template, end card, wordmark placement
- [ ] Every platform version links back to reelspiration.com/stories/${story.slug}
`;

  const dir = resolve("exports", story.slug);
  mkdirSync(dir, { recursive: true });
  const outPath = resolve(dir, "package.md");
  writeFileSync(outPath, md);
  console.log(`Wrote ${outPath}`);
}

main();
