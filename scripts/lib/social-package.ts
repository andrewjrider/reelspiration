/**
 * Shared logic for turning a StoryRecord into the full social content
 * package. Extracted so the single-story CLI (export-social.ts) and the
 * batch CLI (export-social-batch.ts) can't drift apart into two versions
 * of "how a package gets built."
 */

import { StoryRecord } from "../../src/data/types";
import { getChallenge } from "../../src/data/challenges";

export const VISUAL_TEMPLATES: Record<string, string> = {
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

export const VO_WPM = 137; // brand spec: 130-145 wpm, measured documentary pace

export function pickTemplates(story: StoryRecord): string[] {
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

export function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function buildReelScript(story: StoryRecord): string {
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

export function buildExtendedScript(story: StoryRecord): string {
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

export function buildCarousel(story: StoryRecord) {
  if (story.canonicalStory) {
    return [
      { slide: 1, text: `${story.subject}\n${story.dek}` },
      {
        slide: 2,
        text: `THE STORY\n${story.canonicalStory.slice(0, 280)}${
          story.canonicalStory.length > 280 ? "..." : ""
        }`,
      },
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

export function buildLinkedIn(story: StoryRecord): string {
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

export function buildCaption(story: StoryRecord): string {
  return `${story.dek}\n\n${story.reelspiration}\n\nFull story at the link in bio. #Reelspiration`;
}

export function buildHashtags(story: StoryRecord): string {
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

export function buildSEO(story: StoryRecord) {
  return {
    title: `${story.subject}: ${story.dek.split(".")[0]}. | Reelspiration`,
    metaDescription:
      story.dek.length <= 155 ? story.dek : story.dek.slice(0, 152) + "...",
    altText: `Portrait of ${story.subject}, subject of a Reelspiration story about ${
      story.challenges[0]?.replace(/-/g, " ") ?? "perseverance"
    }.`,
  };
}

export interface PackageResult {
  markdown: string;
  reelSeconds: number;
  reelOverTarget: boolean;
  usingAuthoredReel: boolean;
  usingAuthoredCarousel: boolean;
  usingAuthoredLinkedIn: boolean;
}

export function buildPackage(story: StoryRecord): PackageResult {
  const usingAuthoredReel = Boolean(story.reelScriptAuthored);
  const usingAuthoredCarousel = Boolean(story.carouselAuthored);
  const usingAuthoredLinkedIn = Boolean(story.linkedInAuthored);

  const reel = story.reelScriptAuthored || buildReelScript(story);
  const extended = buildExtendedScript(story);
  const carouselText = usingAuthoredCarousel
    ? story.carouselAuthored!
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
  const reelSeconds = Math.round((reelWords / VO_WPM) * 60);
  const reelOverTarget = reelSeconds > 60;

  const markdown = `# Social Package — ${story.subject}

Generated from: reelspiration.com/stories/${story.slug}
Audience moment: "${primaryChallenge?.prompt ?? story.challenges[0]}"

---

## Reel / Short script (35-60s target)
Source: ${usingAuthoredReel ? "your authored manuscript voiceover, beat tags added" : "generated from atomic fields"}
Word count: ${reelWords} (~${reelSeconds}s at ${VO_WPM} wpm, the brand's measured documentary pace — ${
    reelOverTarget ? "trim, this is over 60s" : "on target"
  })
Bracketed tags mark beats for the editor/narrator — not spoken aloud.

${reel}

---

## Extended cut script (60-90s target)
Word count: ${extendedWords} (~${Math.round((extendedWords / VO_WPM) * 60)}s at ${VO_WPM} wpm)

${extended}

---

## Carousel
Source: ${usingAuthoredCarousel ? "your authored manuscript" : "generated from atomic fields"}

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

  return {
    markdown,
    reelSeconds,
    reelOverTarget,
    usingAuthoredReel,
    usingAuthoredCarousel,
    usingAuthoredLinkedIn,
  };
}
