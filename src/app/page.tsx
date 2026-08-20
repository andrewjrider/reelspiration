import type { Metadata } from "next";
import Link from "next/link";
import ChallengePicker from "@/components/ChallengePicker";
import StoryCard from "@/components/StoryCard";
import PortraitFrame from "@/components/PortraitFrame";
import AtmosphericBand from "@/components/AtmosphericBand";
import {
  getPublicPublishedStories,
  getPublicStoriesByCollection,
} from "@/data/stories";
import { collections } from "@/data/collections";
import { StoryRecord } from "@/data/types";
import NewsletterSignup from "@/components/NewsletterSignup";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Real Stories. Real Proof.",
  description:
    "A published library of recognizable people, teams, and moments that prove a setback does not have to decide the ending.",
  path: "/",
});

const editorialGroupSpecs = [
  {
    title: "Business & Entrepreneurship",
    description: "Builders who kept moving when the first version failed.",
    href: "/collections/business-builders",
    collection: "business-builders",
    preferredSlugs: [
      "steve-jobs",
      "walt-disney",
      "colonel-harland-sanders",
      "sara-blakely",
    ],
  },
  {
    title: "Athletic Adversity",
    description: "Competitors whose defining work began after the setback.",
    href: "/collections/athletic-adversity",
    collection: "athletic-adversity",
    preferredSlugs: [
      "bethany-hamilton",
      "simone-biles",
      "jackie-robinson",
      "niki-lauda",
    ],
  },
  {
    title: "History & Leadership",
    description: "Decisions made under pressure, with consequences beyond one life.",
    href: "/collections/historic-decisions",
    collection: "historic-decisions",
    preferredSlugs: [
      "abraham-lincoln",
      "nelson-mandela",
      "rosa-parks",
      "winston-churchill",
    ],
  },
  {
    title: "Greatest Comebacks",
    description: "The library's clearest proof that an ending can become a turn.",
    href: "/collections/greatest-comebacks",
    collection: "greatest-comebacks",
    preferredSlugs: [
      "malala-yousafzai",
      "terry-fox",
      "tiger-woods",
      "robert-downey-jr",
    ],
  },
] as const;

export default function Home() {
  const stories = getPublicPublishedStories();
  const featured = stories[0];
  const totalRecords = stories.length;
  const usedSlugs = new Set(featured ? [featured.slug] : []);
  const editorialGroups = editorialGroupSpecs.map((group) => {
    const candidates = getPublicStoriesByCollection(group.collection);
    const bySlug = new Map(candidates.map((story) => [story.slug, story]));
    const selected = group.preferredSlugs
      .map((slug) => bySlug.get(slug))
      .filter((story): story is StoryRecord => Boolean(story))
      .filter((story) => !usedSlugs.has(story.slug));

    for (const story of candidates) {
      if (selected.length >= 4) break;
      if (!usedSlugs.has(story.slug) && !selected.some((item) => item.slug === story.slug)) {
        selected.push(story);
      }
    }
    selected.slice(0, 4).forEach((story) => usedSlugs.add(story.slug));

    return { ...group, stories: selected.slice(0, 4) };
  });

  return (
    <div className="overflow-hidden">
      {/* HERO — asymmetric split, real scale, a portrait anchoring the page
          instead of a wall of text opening the site */}
      <AtmosphericBand src="/atmosphere/painted-desert-storm.png" scrim="heavy">
        <section className="relative max-w-6xl mx-auto px-6 pt-14 sm:pt-20 pb-16">
        {/* oversized ghost numeral — editorial scale device, very low
            opacity, purely textural */}
        <span
          aria-hidden
          className="hidden lg:block absolute -top-6 -left-4 font-stamp text-[280px] leading-none text-paper select-none pointer-events-none"
          style={{ opacity: 0.03 }}
        >
          01
        </span>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-stamp text-xs uppercase tracking-[0.25em] text-brass mb-7">
              Real Stories. Real Proof. Real Reelspiration.
            </p>
            <h1 className="font-serif text-[2.75rem] sm:text-6xl lg:text-[4.25rem] leading-[1.02] tracking-tight text-paper">
              When people need proof
              <br />
              their story isn&apos;t over,{" "}
              <span className="italic text-brass-bright">they need a story</span>
              <br className="hidden sm:block" />
              {" "}
              <span className="italic text-brass-bright">they recognize.</span>
            </h1>
            <p className="text-paper-dim mt-8 max-w-md leading-relaxed text-[15px]">
              A public library of recognizable people, teams, and moments —
              proof that setbacks, rejection, injury, loss, and age
              don&apos;t automatically decide the ending.
            </p>

            <div className="mt-10 flex items-center gap-8">
              <Link
                href="/challenges"
                className="font-stamp text-xs uppercase tracking-[0.14em] bg-brass text-ink px-6 py-3.5 hover:bg-brass-bright transition-colors"
              >
                Find Your Story
              </Link>
              <div className="font-stamp text-[11px] uppercase tracking-[0.1em] text-paper-dim">
                <span className="text-paper text-base font-serif tracking-normal not-italic mr-1.5">
                  {totalRecords}
                </span>{" "}
                public records
              </div>
            </div>
          </div>

          {featured && (
            <Link
              href={`/stories/${featured.slug}`}
              className="group block relative"
            >
              <div className="relative">
                <PortraitFrame story={featured} size="lg" />
                {/* brass bracket offset behind the frame for depth */}
                <div className="absolute -bottom-3 -right-3 w-full h-full border border-brass -z-10" />
              </div>
              <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mt-4 group-hover:text-brass transition-colors">
                Featured Record — Read the story →
              </p>
            </Link>
          )}
        </div>
      </section>
      </AtmosphericBand>

      {/* SIGNATURE ELEMENT — story categories, framed as an invitation to
          browse rather than a prompt to self-diagnose */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-stamp text-xs uppercase tracking-[0.2em] text-paper-dim">
            Start With a Story
          </h2>
          <span className="hidden sm:block font-serif italic text-paper-dim text-sm">
            Six kinds of proof, {totalRecords} public records
          </span>
        </div>
        <ChallengePicker />
      </section>

      {/* MORE RECORDS — now carrying real visual weight via PortraitFrame */}
      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {editorialGroups.slice(0, 2).map((group) => (
          <EditorialGroup key={group.title} {...group} />
        ))}
      </section>

      {/* PULL-QUOTE DIVIDER — a breath between sections, not just more text */}
      <AtmosphericBand src="/atmosphere/stone-wall-ruin.png" scrim="light" className="mb-24">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="font-serif text-2xl sm:text-3xl italic text-paper leading-snug">
            &ldquo;A closed door tells you about that door.
            <br className="hidden sm:block" /> It doesn&apos;t tell you about
            the building.&rdquo;
          </p>
        </div>
      </AtmosphericBand>

      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {editorialGroups.slice(2).map((group) => (
          <EditorialGroup key={group.title} {...group} />
        ))}
      </section>

      {/* COLLECTIONS STRIP */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-7">
          <div>
            <h2 className="font-stamp text-xs uppercase tracking-[0.2em] text-paper-dim">
              Continue Browsing
            </h2>
            <p className="font-serif text-2xl text-paper mt-2">
              Every published record remains in the library.
            </p>
          </div>
          <Link
            href="/stories"
            className="font-stamp text-[11px] uppercase tracking-[0.14em] bg-brass text-ink px-5 py-3.5 hover:bg-brass-bright transition-colors text-center"
          >
            Browse All {totalRecords} Stories
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="font-stamp text-[11px] uppercase tracking-[0.1em] border border-line px-4 py-2.5 text-paper-dim hover:border-brass hover:text-brass transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE — full-width band, more presence than a boxed card */}
      <AtmosphericBand src="/atmosphere/tahoe-sunset.png" scrim="light">
        <section id="subscribe" className="border-y border-brass">
          <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-paper max-w-lg">
                Five Minutes of Reelspiration, once a week.
              </h2>
              <p className="text-paper-dim mt-3 max-w-md text-sm leading-relaxed">
                Tell us what you&apos;re facing. We&apos;ll send one public story
                that fits it — no generic pep talks, no daily noise.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </section>
      </AtmosphericBand>
    </div>
  );
}

function EditorialGroup({
  title,
  description,
  href,
  stories,
}: {
  title: string;
  description: string;
  href: string;
  stories: StoryRecord[];
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="font-serif text-3xl text-paper">{title}</h2>
          <p className="text-paper-dim text-sm mt-2 leading-relaxed">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="font-stamp text-[11px] uppercase tracking-[0.12em] text-brass hover:text-brass-bright shrink-0"
        >
          Explore Collection →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stories.map((story) => (
          <StoryCard key={story.slug} story={story} showContext={false} />
        ))}
      </div>
    </div>
  );
}
