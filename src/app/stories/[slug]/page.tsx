import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublicPublishedStory,
  getPublicPublishedStories,
  getPublicRelatedStories,
} from "@/data/stories";
import { getChallenge } from "@/data/challenges";
import { getCollection } from "@/data/collections";
import { atmosphereForChallenge } from "@/data/atmosphere";
import { isPublicSourceUrl, verificationLabel } from "@/data/public-content";
import StoryCard from "@/components/StoryCard";
import AtmosphericBand from "@/components/AtmosphericBand";
import SourceVerification from "@/components/SourceVerification";
import StoryHeroMedia from "@/components/StoryHeroMedia";
import ReelspirationShareCard from "@/components/ReelspirationShareCard";
import StoryShareActions from "@/components/StoryShareActions";
import NewsletterSignup from "@/components/NewsletterSignup";
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
    image: `/api/share-card/${story.slug}`,
  });
  const shareImage = absoluteUrl(`/api/share-card/${story.slug}`);

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: story.publishedAt,
      images: [{ url: shareImage, width: 1200, height: 630, alt: `${story.subject} — The Reelspiration` }],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      images: [shareImage],
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

  const related = getPublicRelatedStories(story, 3);
  const recordStatusLabel = verificationLabel(story);
  const citations = story.sources
    .filter((source) => isPublicSourceUrl(source.url))
    .map((source) => source.url);
  const storyUrl = absoluteUrl(`/stories/${story.slug}`);
  const shareImagePath = `/api/share-card/${story.slug}`;
  const narrativeParagraphs = story.canonicalStory
    ? splitNarrativeForDisplay(story.canonicalStory)
    : [];
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${story.subject}: ${story.dek}`,
    description: story.reelspiration,
    datePublished: story.publishedAt,
    mainEntityOfPage: storyUrl,
    url: storyUrl,
    image: absoluteUrl(shareImagePath),
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
                  className="font-stamp text-[11px] uppercase tracking-[0.1em] text-brass border border-brass px-2 py-1 hover:bg-brass hover:text-ink transition-colors"
                >
                  {ch.prompt}
                </Link>
              ) : null;
            })}
          </div>

          <p className="font-stamp text-[11px] uppercase tracking-[0.15em] text-paper-dim mb-3">
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

      <StoryHeroMedia
        subject={story.subject}
        sourceId={story.sourceId}
        media={story.heroMedia}
        fallbackSrc={atmosphereForChallenge(story.challenges[0] ?? "")}
      />

      <article className="max-w-[44rem] mx-auto px-6 py-14 sm:py-16">
      <div className="space-y-10">
        {story.canonicalStory ? (
          <div>
            <p className="font-stamp text-[11px] uppercase tracking-[0.15em] text-paper-dim mb-2">
              The Story
            </p>
            {narrativeParagraphs.map((para, i) => (
              <p key={i} className="text-[17px] text-paper leading-7 mb-5">
                {para}
              </p>
            ))}
            {story.decision && (
              <div className="mt-6">
                <p className="font-stamp text-[11px] uppercase tracking-[0.15em] text-moss mb-2">
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
          <p className="font-stamp text-[11px] uppercase tracking-[0.15em] text-brass mb-2">
            The Reelspiration
          </p>
          <p className="font-serif text-2xl italic text-paper leading-snug">
            {story.reelspiration}
          </p>
        </div>

        <Section label="The Principle" text={story.principle} />

        <div className="relative overflow-hidden bg-ink-raised border border-brass/70 p-7 sm:p-8">
          <div className="absolute left-0 top-0 h-full w-1 bg-brass" aria-hidden="true" />
          <p className="font-stamp text-[11px] uppercase tracking-[0.15em] text-brass mb-2">
            Your Next Step
          </p>
          <p className="font-serif text-xl text-paper leading-relaxed">{story.nextStep}</p>
        </div>
      </div>
      </article>

      <section className="mx-auto max-w-5xl px-6 pb-14" aria-labelledby="share-story-heading">
        <h2 id="share-story-heading" className="font-stamp text-[11px] uppercase tracking-[0.15em] text-paper-dim mb-4">
          Share This Reelspiration
        </h2>
        <ReelspirationShareCard subject={story.subject} quote={story.reelspiration} storyPath={`/stories/${story.slug}`} />
        <StoryShareActions
          subject={story.subject}
          quote={story.reelspiration}
          storyUrl={storyUrl}
          downloadUrl={`${shareImagePath}?download=1`}
        />
      </section>

      <section className="border-y border-line bg-ink-raised">
        <div className="mx-auto flex max-w-5xl flex-col gap-7 px-6 py-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <p className="font-stamp text-[11px] uppercase tracking-[0.15em] text-brass">Weekly Proof</p>
            <h2 className="mt-2 font-serif text-3xl text-paper">One remarkable record, once a week.</h2>
            <p className="mt-3 text-paper-dim">A brief story of adversity, the decision that changed it, and one practical next step.</p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="mx-auto max-w-6xl px-6 py-14"
          aria-labelledby="related-stories-heading"
          data-related-story-count={related.length}
          data-related-story-slugs={related.map((item) => item.slug).join(",")}
        >
          <h2 id="related-stories-heading" className="font-stamp text-[11px] uppercase tracking-[0.12em] text-paper-dim mb-4">
            More Like This
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((s) => <StoryCard key={s.slug} story={s} />)}
          </div>
        </section>
      )}

      <footer className="max-w-[44rem] mx-auto px-6 pb-16">
      <div className="pt-8 border-t border-line">
        <p className="font-stamp text-[11px] uppercase tracking-[0.12em] text-paper-dim mb-3">
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
      </footer>
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
      <p className={`font-stamp text-[11px] uppercase tracking-[0.15em] ${accentColor} mb-2`}>
        {label}
      </p>
      <p className="text-paper leading-relaxed">{text}</p>
    </div>
  );
}

function splitNarrativeForDisplay(value: string): string[] {
  return value.split(/\n\n+/).flatMap((authoredParagraph) => {
    if (authoredParagraph.length <= 360) return [authoredParagraph];

    const sentences = authoredParagraph.split(
      /(?<=[.!?])\s+(?=[A-Z0-9“"'])/,
    );
    const paragraphs: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      const candidate = current ? `${current} ${sentence}` : sentence;
      if (current.length >= 180 && candidate.length > 340) {
        paragraphs.push(current);
        current = sentence;
      } else {
        current = candidate;
      }
    }

    if (current) {
      if (current.length < 140 && paragraphs.length > 0) {
        const lastIndex = paragraphs.length - 1;
        paragraphs[lastIndex] = `${paragraphs[lastIndex]} ${current}`;
      } else {
        paragraphs.push(current);
      }
    }
    return paragraphs;
  });
}
