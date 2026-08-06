import { notFound } from "next/navigation";
import { challenges, getChallenge } from "@/data/challenges";
import { getStoriesByChallenge } from "@/data/stories";
import StoryCard from "@/components/StoryCard";

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) notFound();

  const stories = getStoriesByChallenge(slug);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
        Audience Moment
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl italic text-paper">
        &ldquo;{challenge.prompt}&rdquo;
      </h1>
      <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
        {challenge.description}
      </p>

      <div className="mt-12">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stories.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        ) : (
          <p className="text-paper-dim italic border border-line p-8 text-center">
            New records for this moment are in production. Check back soon —
            or subscribe below to get one the day it publishes.
          </p>
        )}
      </div>
    </div>
  );
}
