import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublicPublishedStory,
  getPublicPublishedStories,
  getPublicStoriesByChallenge,
} from "@/data/stories";
import { getChallenge } from "@/data/challenges";
import { getCollection } from "@/data/collections";
import { atmosphereForChallenge } from "@/data/atmosphere";
import { isPublicSourceUrl, verificationLabel } from "@/data/public-content";
import StoryCard from "@/components/StoryCard";
import AtmosphericBand from "@/components/AtmosphericBand";
import SourceVerification from "@/components/SourceVerification";
import { absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return getPublicPublishedStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getPublicPublishedStory(slug);

  if (!story) {
    return { robots: { index: false, follow: false } };
  }

  const title = `${story.subject}: ${story.dek}`;
  const description = story.canonicalStory
    ? story.canonicalStory.slice(0, 157).trimEnd() + "…"
    : story.reelspiration;
  const metadata = pageMetadata({
    title,
    description,
    path: `/stories/${story.slug}`,
    image: atmosphereForChallenge(story.challenges[0] ?? ""),
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: story.publishedAt,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getPublicPublishedStory(slug);
  if (!story) notFound();

  const related = getPublicStoriesByChallenge(story.challenges[0])
    .filter((s) => s.slug !== story.slug)
    .slice(0, 2);
  const recordStatusLabel = verificationLabel(story);
  const citations = story.sources
    .filter((source) => isPublicSourceUrl(source.url))
    .map((source) => source.url);
  const storyUrl = absoluteUrl(`/stories/${story.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${story.subject}: ${story.dek}`,
    description: story.reelspiration,
    datePublished: story.publishedAt,
    mainEntityOfPage: storyUrl,
    url: storyUrl,
    image: absoluteUrl(atmosphereForChallenge(story.challenges[0] ?? "")),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    ...(citations.length > 0 ? { citation: citations } : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Stories",
        item: absoluteUrl("/challenges"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: story.subject,
        item: storyUrl,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]).replace(/</g, "\\u003c"),
        }}
      />

      <AtmosphericBand src={atmosphereForChallenge(story.challenges[0] ?? "")} scrim="heavy">
        <div className="max-w-3xl mx-auto px-6 pt-14 sm:pt-16 pb-12">
          {/* Breadcrumb / challenge tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {story.challenges.map((c) => {
              const ch = getChallenge(c);
              return ch ? (
                <Link
                  key={c}
                  href={`/challenges/${c}`}
                  className="font-stamp text-[10px] uppercase tracking-[0.1em] text-brass border border-brass px-2 py-1 hover:bg-brass hover:text-ink transition-colors"
                >
                  {ch.prompt}
                </Link>
              ) : null;
            })}
          </div>

          <p className="font-stamp text-[10px] uppercase tracking-[0.15em] text-paper-dim mb-3">
            {recordStatusLabel}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-paper leading-tight">
            {story.subject}
          </h1>
          <p className="text-xl text-paper-dim italic mt-4 leading-relaxed">
            {story.dek}
          </p>
        </div>
      </AtmosphericBand>

      <article className="max-w-3xl mx-auto px-6 py-16">
      <div className="space-y-10">
        {story.canonicalStory ? (
          <div>
            <p className="font-stamp text-[10px] uppercase tracking-[0.15em] text-paper-dim mb-2">
              The Story
            </p>
            {story.canonicalStory.split(/\n\n+/).map((para, i) => (
              <p key={i} className="text-paper leading-relaxed mb-4">
                {para}
              </p>
            ))}
            {story.decision && (
              <div className="mt-6">
                <p className="font-stamp text-[10px] uppercase tracking-[0.15em] text-moss mb-2">
                  The Decision
                </p>
                <p className="text-paper leading-relaxed">{story.decision}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <Section label="The World Before" text={story.worldBefore ?? ""} />
            <Section label="The Adversity" text={story.adversity ?? ""} accent="rust" />
            <Section label="The Decision" text={story.decision ?? ""} />
            <Section label="The Turning Point" text={story.turningPoint ?? ""} accent="moss" />
          </>
        )}

        <div className="border-l-2 border-brass pl-6 py-2">
          <p className="font-stamp text-[10px] uppercase tracking-[0.15em] text-brass mb-2">
            The Reelspiration
          </p>
          <p className="font-serif text-2xl italic text-paper leading-snug">
            {story.reelspiration}
          </p>
        </div>

        <Section label="The Principle" text={story.principle} />

        <div className="bg-ink-raised border border-line p-6">
          <p className="font-stamp text-[10px] uppercase tracking-[0.15em] text-brass mb-2">
            Your Next Step
          </p>
          <p className="text-paper leading-relaxed">{story.nextStep}</p>
        </div>

        <Section label="Why This Matters" text={story.whyItMatters} />
      </div>

      {/* Collections this belongs to */}
      <div className="mt-14 pt-8 border-t border-line">
        <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mb-3">
          Filed In
        </p>
        <div className="flex flex-wrap gap-2">
          {story.collections.map((c) => {
            const col = getCollection(c);
            return col ? (
              <Link
                key={c}
                href={`/collections/${c}`}
                className="font-stamp text-[11px] uppercase tracking-[0.1em] border border-line px-3 py-2 text-paper-dim hover:border-brass hover:text-brass transition-colors"
              >
                {col.name}
              </Link>
            ) : null;
          })}
        </div>
      </div>

      <SourceVerification story={story} />

      {/* Related stories */}
      {related.length > 0 && (
        <div className="mt-16">
          <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mb-4">
            More Like This
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </div>
      )}
      </article>
    </div>
  );
}

function Section({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent?: "rust" | "moss";
}) {
  const accentColor =
    accent === "rust" ? "text-rust" : accent === "moss" ? "text-moss" : "text-paper-dim";
  return (
    <div>
      <p className={`font-stamp text-[10px] uppercase tracking-[0.15em] ${accentColor} mb-2`}>
        {label}
      </p>
      <p className="text-paper leading-relaxed">{text}</p>
    </div>
  );
}
