import type { Metadata } from "next";
import Link from "next/link";
import AtmosphericBand from "@/components/AtmosphericBand";
import StoryCard from "@/components/StoryCard";
import { getPublicPublishedStories } from "@/data/stories";
import { StoryRecord } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Browse All Stories",
  description:
    "Browse all 110 published Reelspiration stories in one complete, alphabetical library.",
  path: "/stories",
  image: "/atmosphere/painted-desert-storm.png",
});

function initialFor(story: StoryRecord): string {
  const initial = story.subject.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(initial) ? initial : "#";
}

export default function BrowseAllStoriesPage() {
  const stories = getPublicPublishedStories().sort((a, b) =>
    a.subject.localeCompare(b.subject),
  );
  const groups = new Map<string, StoryRecord[]>();

  for (const story of stories) {
    const initial = initialFor(story);
    groups.set(initial, [...(groups.get(initial) ?? []), story]);
  }

  return (
    <div>
      <AtmosphericBand src="/atmosphere/painted-desert-storm.png" scrim="heavy">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <div className="flex items-center gap-3 font-stamp text-[11px] uppercase tracking-[0.18em] text-brass mb-4">
            <span>The Complete Library</span>
            <span aria-hidden="true" className="h-px w-5 bg-brass/60" />
            <span>{stories.length} stories</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-paper">
            Browse All Stories
          </h1>
          <p className="text-paper-dim mt-4 max-w-xl leading-relaxed">
            Every published Reelspiration record, arranged alphabetically for
            complete access. For a more guided path, browse by challenge or collection.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href="/challenges"
              className="font-stamp text-[11px] uppercase tracking-[0.12em] border border-brass px-4 py-2.5 text-brass hover:bg-brass hover:text-ink transition-colors"
            >
              Browse Challenges
            </Link>
            <Link
              href="/collections"
              className="font-stamp text-[11px] uppercase tracking-[0.12em] border border-line px-4 py-2.5 text-paper-dim hover:border-brass hover:text-brass transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </AtmosphericBand>

      <div
        data-browse-all-stories
        className="max-w-6xl mx-auto px-6 py-14 space-y-14"
      >
        {[...groups.entries()].map(([initial, initialStories]) => (
          <section key={initial} aria-labelledby={`stories-${initial}`}>
            <div className="flex items-center gap-4 mb-5">
              <h2
                id={`stories-${initial}`}
                className="font-serif text-3xl text-paper"
              >
                {initial}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
              <span className="font-stamp text-[11px] uppercase tracking-[0.12em] text-paper-dim">
                {initialStories.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialStories.map((story) => (
                <StoryCard key={story.slug} story={story} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
