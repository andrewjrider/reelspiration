import { StoryRecord } from "./types";

const PRODUCTION_CHECKLIST = /\s*Production approval checklist:[\s\S]*$/i;

export function cleanPublicText(value: string): string {
  return value
    .replace(PRODUCTION_CHECKLIST, "")
    .replace(/-{20,}/g, " ")
    .replace(/---/g, "—")
    .replace(/\\([*_])/g, "$1")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(^|[.!?:]\s+)i\b/g, (_, prefix: string) => `${prefix}I`)
    .trim();
}

export function cleanAudienceMoment(value: string): string {
  return cleanPublicText(
    value
      .replace(/-{20,}/g, " ")
      .replace(/^MOMENT\s+/i, "")
      .replace(/\s+RECOGNITION CORE EMOTION[\s\S]*$/i, "")
      .replace(/\s+/g, " "),
  );
}

export function isPublicSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Produces the public shape of a published record. Authored production
 * derivatives and editorial guardrails intentionally stay out of this object.
 */
export function toPublicStory(story: StoryRecord): StoryRecord {
  return {
    slug: story.slug,
    subject: cleanPublicText(story.subject),
    dek: cleanPublicText(story.dek),
    heroMedia: story.heroMedia,
    challenges: story.challenges,
    collections: story.collections,
    canonicalStory: story.canonicalStory
      ? cleanPublicText(story.canonicalStory)
      : undefined,
    worldBefore: story.worldBefore ? cleanPublicText(story.worldBefore) : undefined,
    adversity: story.adversity ? cleanPublicText(story.adversity) : undefined,
    decision: story.decision ? cleanPublicText(story.decision) : undefined,
    turningPoint: story.turningPoint
      ? cleanPublicText(story.turningPoint)
      : undefined,
    reelspiration: cleanPublicText(story.reelspiration),
    principle: cleanPublicText(story.principle),
    nextStep: cleanPublicText(story.nextStep),
    whyItMatters: cleanPublicText(story.whyItMatters),
    sourceId: story.sourceId,
    pattern: story.pattern ? cleanPublicText(story.pattern) : undefined,
    audienceMoments: story.audienceMoments?.map(cleanAudienceMoment),
    recognitionScore: story.recognitionScore,
    storyStrengthScore: story.storyStrengthScore,
    relatabilityScore: story.relatabilityScore,
    rippleScore: story.rippleScore,
    sources: story.sources
      .map((source) => ({
        label: cleanPublicText(source.label),
        url: isPublicSourceUrl(source.url) ? source.url : "",
      }))
      .filter((source) => source.label.length > 0),
    verification: story.verification,
    verificationStatus: story.verificationStatus ?? "editorial-review",
    status: story.status,
    publishedAt: story.publishedAt,
  };
}

export function hasDocumentedVerification(story: StoryRecord): boolean {
  return Boolean(
    story.verificationStatus === "verified" &&
      story.verification?.verifiedAt &&
      story.sources.length > 0 &&
      story.sources.every((source) => isPublicSourceUrl(source.url)),
  );
}

export function verificationLabel(story: StoryRecord): string {
  if (hasDocumentedVerification(story)) return "Verified Record";
  return story.verificationStatus === "editorial-review"
    ? "Editorial Review in Progress"
    : "Source Review in Progress";
}
