import Link from "next/link";
import { StoryRecord } from "@/data/types";
import { getChallenge } from "@/data/challenges";

export default function StoryCard({ story }: { story: StoryRecord }) {
  const primaryChallenge = getChallenge(story.challenges[0]);

  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group block border border-line hover:border-brass transition-colors p-6"
    >
      {primaryChallenge && (
        <span className="font-stamp text-[10px] uppercase tracking-[0.12em] text-brass">
          {primaryChallenge.prompt}
        </span>
      )}
      <h3 className="font-serif text-2xl mt-2 text-paper group-hover:text-brass-bright transition-colors">
        {story.subject}
      </h3>
      <p className="text-paper-dim mt-2 text-sm leading-relaxed">{story.dek}</p>
      <span className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mt-4 inline-block">
        Read the record →
      </span>
    </Link>
  );
}
