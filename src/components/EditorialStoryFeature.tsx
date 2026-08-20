import Link from "next/link";
import AtmosphericBand from "@/components/AtmosphericBand";
import { atmosphereForChallenge } from "@/data/atmosphere";
import { StoryRecord } from "@/data/types";

export default function EditorialStoryFeature({ story }: { story: StoryRecord }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group block sm:col-span-2 border border-brass/60"
    >
      <AtmosphericBand
        src={atmosphereForChallenge(story.challenges[0] ?? "")}
        scrim="light"
      >
        <div className="px-6 py-8 sm:px-8 sm:py-9 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-2xl">
            <p className="font-stamp text-[11px] uppercase tracking-[0.16em] text-brass mb-3">
              Featured Reelspiration
            </p>
            <blockquote className="font-serif text-xl sm:text-2xl italic leading-snug text-paper">
              “{story.reelspiration}”
            </blockquote>
          </div>
          <p className="font-stamp text-[11px] uppercase tracking-[0.12em] text-paper-dim group-hover:text-brass transition-colors">
            {story.subject} →
          </p>
        </div>
      </AtmosphericBand>
    </Link>
  );
}
