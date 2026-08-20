import Link from "next/link";
import { StoryRecord } from "@/data/types";
import { getChallenge } from "@/data/challenges";

interface StoryCardProps {
  story: StoryRecord;
  showContext?: boolean;
}

export default function StoryCard({
  story,
  showContext = true,
}: StoryCardProps) {
  const primaryChallenge = getChallenge(story.challenges[0]);

  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group relative block border border-line hover:border-brass transition-colors p-5"
    >
      <span
        aria-hidden="true"
        className="absolute right-5 top-4 font-stamp text-sm text-brass opacity-60 transition-all group-hover:translate-x-1 group-hover:opacity-100"
      >
        →
      </span>
      {showContext && primaryChallenge && (
        <span className="font-stamp text-[11px] uppercase tracking-[0.12em] text-brass pr-7">
          {primaryChallenge.prompt}
        </span>
      )}
      <h3
        className={`font-serif text-2xl text-paper group-hover:text-brass-bright transition-colors pr-7 ${
          showContext && primaryChallenge ? "mt-2" : "mt-0"
        }`}
      >
        {story.subject}
      </h3>
      <p className="text-paper-dim mt-2 text-sm leading-relaxed">{story.dek}</p>
    </Link>
  );
}
