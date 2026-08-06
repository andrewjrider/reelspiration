// Reelspiration content schema
// This mirrors the master record structure from the business brief:
// hook, world before, adversity, decision, turning point, THE REELSPIRATION,
// THE PRINCIPLE, YOUR NEXT STEP, WHY THIS MATTERS, plus sources/rights.
//
// When the 10 volumes / 100 story packages arrive, each one maps directly
// into a StoryRecord below — that's the whole point of this schema existing
// separately from the page templates.

export type ChallengeSlug =
  | "too-old"
  | "rejected"
  | "starting-over"
  | "need-courage"
  | "recovering"
  | "need-leadership";

export interface Challenge {
  slug: ChallengeSlug;
  /** The audience moment, in the visitor's own words */
  prompt: string; // e.g. "I feel too old"
  description: string;
}

export type CollectionSlug =
  | "business-builders"
  | "athletic-adversity"
  | "greatest-comebacks"
  | "historic-decisions"
  | "teams-that-refused-to-quit"
  | "entrepreneurs"
  | "athletes"
  | "military-courage";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  description: string;
}

export interface SourceRecord {
  label: string;
  url: string;
}

export interface StoryRecord {
  slug: string;
  subject: string; // the recognizable person/team/event
  dek: string; // one-line hook, the "reason to stop scrolling"
  challenges: ChallengeSlug[];
  collections: CollectionSlug[];

  // Real production content arrives as a single flowing canonical
  // narrative rather than four pre-split beats — canonicalStory is the
  // primary content field. worldBefore/adversity/decision/turningPoint
  // remain as an OPTIONAL alternate shape for hand-entered records that
  // do split cleanly (decision in particular is often authored
  // separately even alongside canonicalStory — use both when present).
  canonicalStory?: string;
  worldBefore?: string;
  adversity?: string;
  decision?: string;
  turningPoint?: string;

  reelspiration: string; // THE REELSPIRATION - one memorable original takeaway
  principle: string; // THE PRINCIPLE - the universal lesson
  nextStep: string; // YOUR NEXT STEP - one small practical action
  whyItMatters: string; // WHY THIS MATTERS / WHY THIS CHANGED HISTORY

  // Authored derivatives — when the source material already includes a
  // hand-written Reel script, carousel, or LinkedIn post, use it in
  // place of generating one from atomic fields (see export-social.ts).
  reelScriptAuthored?: string;
  carouselAuthored?: string;
  linkedInAuthored?: string;
  visualDirection?: string;
  editorialGuardrails?: string;

  // Editorial metadata carried over from the source volumes.
  sourceId?: string; // e.g. "RS-B001" — traceability back to the manuscript
  pattern?: string; // e.g. "Late Bloomer • Reinvention • Starting Again"
  audienceMoments?: string[]; // raw audience-moment phrasing from the source

  recognitionScore: number; // 1-40, editorial filter weight
  storyStrengthScore: number; // 1-25
  relatabilityScore: number; // 1-20
  rippleScore: number; // 1-15

  sources: SourceRecord[];
  status: "published" | "draft" | "needs-review";
  publishedAt: string; // ISO date
}

export function totalScore(s: StoryRecord): number {
  return (
    s.recognitionScore +
    s.storyStrengthScore +
    s.relatabilityScore +
    s.rippleScore
  );
}
