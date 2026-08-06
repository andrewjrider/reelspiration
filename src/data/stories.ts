import { StoryRecord } from "./types";
import { importedStories } from "./imported-stories";


// Seed placeholder stories retired — all 4 (Sanders, Blakely, Hamilton,
// Shackleton) now have real, richer equivalents from the actual volumes.
// See CONTENT_IMPORT.md / IMPORT_REPORT.md.
const seedStories: StoryRecord[] = [];

// Combined library: hand-written seed records + anything the import script
// has generated from the real volumes. Deduped by slug (imported wins if a
// slug collides, so re-running the import always reflects the latest data).
export const stories: StoryRecord[] = (() => {
  const bySlug = new Map<string, StoryRecord>();
  for (const s of seedStories) bySlug.set(s.slug, s);
  for (const s of importedStories) bySlug.set(s.slug, s);
  return Array.from(bySlug.values());
})();

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}

export function getPublishedStories() {
  return stories.filter((s) => s.status === "published");
}

export function getAllStories() {
  return stories;
}

export function getStoriesByChallenge(challengeSlug: string) {
  return getPublishedStories().filter((s) =>
    s.challenges.includes(challengeSlug as StoryRecord["challenges"][number])
  );
}

export function getStoriesByCollection(collectionSlug: string) {
  return getPublishedStories().filter((s) =>
    s.collections.includes(collectionSlug as StoryRecord["collections"][number])
  );
}
