// Maps taxonomy slugs to a landscape photo in /public/atmosphere, so every
// challenge, collection, and story page gets the same photographic
// treatment as the homepage instead of falling back to plain text once a
// visitor clicks past an index page. Photos repeat across entries because
// the library currently holds 5 — swap in new ones here as they arrive.

const PAINTED_DESERT_STORM = "/atmosphere/painted-desert-storm.png";
const PETRIFIED_FOREST_ROCKS = "/atmosphere/petrified-forest-rocks.png";
const STONE_WALL_RUIN = "/atmosphere/stone-wall-ruin.png";
const TAHOE_SHORELINE = "/atmosphere/tahoe-shoreline.png";
const TAHOE_SUNSET = "/atmosphere/tahoe-sunset.png";

export const challengeAtmosphere: Record<string, string> = {
  "too-old": TAHOE_SUNSET,
  "rejected": STONE_WALL_RUIN,
  "starting-over": PAINTED_DESERT_STORM,
  "need-courage": PETRIFIED_FOREST_ROCKS,
  "recovering": TAHOE_SHORELINE,
  "need-leadership": PETRIFIED_FOREST_ROCKS,
};

export const collectionAtmosphere: Record<string, string> = {
  "business-builders": STONE_WALL_RUIN,
  "athletic-adversity": TAHOE_SHORELINE,
  "greatest-comebacks": TAHOE_SUNSET,
  "historic-decisions": PETRIFIED_FOREST_ROCKS,
  "teams-that-refused-to-quit": PAINTED_DESERT_STORM,
  "entrepreneurs": STONE_WALL_RUIN,
  "athletes": TAHOE_SHORELINE,
  "military-courage": PETRIFIED_FOREST_ROCKS,
};

const FALLBACK = PAINTED_DESERT_STORM;

export function atmosphereForChallenge(slug: string): string {
  return challengeAtmosphere[slug] ?? FALLBACK;
}

export function atmosphereForCollection(slug: string): string {
  return collectionAtmosphere[slug] ?? FALLBACK;
}
