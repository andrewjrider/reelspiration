import { ChallengeSlug, StoryRecord, VerificationStatus } from "./types";
import { importedStories } from "./imported-stories";
import { isPublicSourceUrl, toPublicStory } from "./public-content";


// Seed placeholder stories retired — all 4 (Sanders, Blakely, Hamilton,
// Shackleton) now have real, richer equivalents from the actual volumes.
// See CONTENT_IMPORT.md / IMPORT_REPORT.md.
const seedStories: StoryRecord[] = [];

const CHALLENGE_OVERRIDES: Partial<Record<string, ChallengeSlug[]>> = {
  "tom-brady": ["rejected"],
  "colonel-harland-sanders": ["too-old", "starting-over"],
  "steve-jobs": ["starting-over", "rejected"],
  "bethany-hamilton": ["recovering", "need-courage"],
  "abraham-lincoln": ["need-leadership"],
};

const EDITORIAL_REVIEW_GUARDRAIL =
  /before\s+publication|at\s+publication|medical\s+disclaimer|legal\s+and\s+editorial\s+review|crisis-resource|domestic-violence\s+resource|full\s+website\s+context|long-form\s+website\s+context|acknowledge\s+the\s+2003|fresh\s+verification/i;

const REQUIRED_PUBLIC_TEXT: Array<keyof StoryRecord> = [
  "subject",
  "dek",
  "reelspiration",
  "principle",
  "nextStep",
  "whyItMatters",
  "publishedAt",
];

function structuralProblems(story: StoryRecord): string[] {
  const problems = REQUIRED_PUBLIC_TEXT.filter(
    (field) => !String(story[field] ?? "").trim(),
  ).map((field) => `missing ${String(field)}`);

  const hasNarrative = Boolean(
    story.canonicalStory?.trim() ||
      story.worldBefore?.trim() ||
      story.adversity?.trim() ||
      story.decision?.trim() ||
      story.turningPoint?.trim(),
  );

  if (!hasNarrative) problems.push("missing story content");
  if (story.challenges.length === 0) problems.push("missing challenge mapping");
  if (story.collections.length === 0) problems.push("missing collection mapping");
  if (story.sources.length === 0) problems.push("missing source names");

  return problems;
}

function verificationStatusFor(story: StoryRecord): VerificationStatus {
  const fullyLinkedSources =
    story.sources.length > 0 &&
    story.sources.every((source) => isPublicSourceUrl(source.url));

  if (story.verification?.verifiedAt && fullyLinkedSources) return "verified";
  if (EDITORIAL_REVIEW_GUARDRAIL.test(story.editorialGuardrails ?? "")) {
    return "editorial-review";
  }
  return "source-review";
}

function activateImportedStory(story: StoryRecord): StoryRecord {
  const problems = structuralProblems(story);
  const remainsDraft = story.status === "draft";

  return {
    ...story,
    challenges: CHALLENGE_OVERRIDES[story.slug] ?? story.challenges,
    status: remainsDraft
      ? "draft"
      : problems.length > 0
        ? "needs-review"
        : "published",
    verificationStatus: verificationStatusFor(story),
  };
}

// Combined library: hand-written seed records + anything the import script
// has generated from the real volumes. Deduped by slug (imported wins if a
// slug collides, so re-running the import always reflects the latest data).
export const stories: StoryRecord[] = (() => {
  const bySlug = new Map<string, StoryRecord>();
  for (const s of seedStories) bySlug.set(s.slug, s);
  for (const s of importedStories) bySlug.set(s.slug, activateImportedStory(s));
  return Array.from(bySlug.values());
})();

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}

export function getPublishedStories() {
  return stories.filter((s) => s.status === "published");
}

export function getPublicPublishedStories() {
  return getPublishedStories().map(toPublicStory);
}

export function getPublicPublishedStory(slug: string) {
  const story = stories.find((s) => s.slug === slug && s.status === "published");
  return story ? toPublicStory(story) : undefined;
}

export function getAllStories() {
  return stories;
}

export function getHiddenStoriesWithReasons() {
  return stories
    .filter((story) => story.status !== "published")
    .map((story) => ({
      slug: story.slug,
      reason:
        story.status === "draft"
          ? "record is explicitly draft-only"
          : structuralProblems(story).join(", ") || "record requires editorial review",
    }));
}

export function getStoriesByChallenge(challengeSlug: string) {
  return getPublishedStories().filter((s) =>
    s.challenges.includes(challengeSlug as StoryRecord["challenges"][number])
  );
}

export function getPublicStoriesByChallenge(challengeSlug: string) {
  return getStoriesByChallenge(challengeSlug).map(toPublicStory);
}

export function getStoriesByCollection(collectionSlug: string) {
  return getPublishedStories().filter((s) =>
    s.collections.includes(collectionSlug as StoryRecord["collections"][number])
  );
}


export function getPublicStoriesByCollection(collectionSlug: string) {
  return getStoriesByCollection(collectionSlug).map(toPublicStory);
}
