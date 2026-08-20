import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { challenges, getChallenge } from "@/data/challenges";
import { getPublicStoriesByChallenge } from "@/data/stories";
import { atmosphereForChallenge } from "@/data/atmosphere";
import ProgressiveStoryGrid from "@/components/ProgressiveStoryGrid";
import AtmosphericBand from "@/components/AtmosphericBand";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) return { robots: { index: false, follow: false } };

  const metadata = pageMetadata({
    title: `${challenge.prompt} Stories`,
    description: challenge.description,
    path: `/challenges/${challenge.slug}`,
    image: atmosphereForChallenge(challenge.slug),
  });

  return getPublicStoriesByChallenge(slug).length > 0
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) notFound();

  const stories = getPublicStoriesByChallenge(slug);

  return (
    <div>
      <AtmosphericBand src={atmosphereForChallenge(slug)} scrim="heavy">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <div className="flex items-center gap-3 font-stamp text-[11px] uppercase tracking-[0.18em] text-brass mb-4">
            <span>Challenge</span>
            <span aria-hidden="true" className="h-px w-5 bg-brass/60" />
            <span>{stories.length} stories</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-paper">
            {challenge.prompt}
          </h1>
          <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
            {challenge.description}
          </p>
        </div>
      </AtmosphericBand>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {stories.length > 0 ? (
          <ProgressiveStoryGrid
            stories={stories}
            initialCount={12}
            showContext={false}
          />
        ) : (
          <p className="text-paper-dim italic border border-line p-8 text-center">
            No records have been published for this challenge yet.
          </p>
        )}
      </div>
    </div>
  );
}
