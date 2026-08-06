import Link from "next/link";
import { notFound } from "next/navigation";
import { getStory, getAllStories, getStoriesByChallenge } from "@/data/stories";
import { getChallenge } from "@/data/challenges";
import { getCollection } from "@/data/collections";
import StoryCard from "@/components/StoryCard";

export function generateStaticParams() {
  // All statuses get a real URL, including needs-review, so editors have
  // a working preview link. Public nav/listings only surface published
  // stories — see getPublishedStories() usage elsewhere.
  return getAllStories().map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const related = getStoriesByChallenge(story.challenges[0])
    .filter((s) => s.slug !== story.slug)
    .slice(0, 2);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {story.status !== "published" && (
        <div className="border border-rust bg-ink-raised px-4 py-3 mb-8">
          <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-rust">
            {story.status === "needs-review" ? "Needs editorial review" : "Draft"} — not
            visible on public pages, preview only
          </p>
        </div>
      )}

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
        Verified Record
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl text-paper leading-tight">
        {story.subject}
      </h1>
      <p className="text-xl text-paper-dim italic mt-4 leading-relaxed">
        {story.dek}
      </p>

      <div className="mt-12 space-y-10">
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

      {/* Sources / rights — trust infrastructure from the brief */}
      <div className="mt-8 pt-6 border-t border-line">
        <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mb-3">
          Sources
        </p>
        <ul className="space-y-1">
          {story.sources.map((src) => (
            <li key={src.url} className="text-xs text-paper-dim">
              {src.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Related stories */}
      {related.length > 0 && (
        <div className="mt-16">
          <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mb-4">
            If This Was Proof, So Is This
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </div>
      )}
    </article>
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
