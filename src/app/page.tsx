import Link from "next/link";
import ChallengePicker from "@/components/ChallengePicker";
import StoryCard from "@/components/StoryCard";
import { getPublishedStories } from "@/data/stories";
import { collections } from "@/data/collections";

export default function Home() {
  const stories = getPublishedStories();
  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <div>
      {/* HERO — the thesis is the question, not a slogan */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-6">
          Real Stories. Real Proof. Real Reelspiration.
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.15] max-w-2xl text-paper">
          When people need proof their story isn&apos;t over,{" "}
          <span className="italic text-brass-bright">they need a story they recognize.</span>
        </h1>
        <p className="text-paper-dim mt-6 max-w-xl leading-relaxed">
          Reelspiration is a verified library of recognizable people, teams, and
          moments — proof that setbacks, rejection, injury, loss, and age don&apos;t
          automatically decide the ending.
        </p>
      </section>

      {/* SIGNATURE ELEMENT — what are you facing today */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-stamp text-xs uppercase tracking-[0.2em] text-paper-dim mb-4">
          What are you facing today?
        </h2>
        <ChallengePicker />
      </section>

      {/* FEATURED STORY */}
      {featured && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="font-stamp text-xs uppercase tracking-[0.2em] text-paper-dim mb-4">
            Featured Record
          </h2>
          <Link
            href={`/stories/${featured.slug}`}
            className="group block border border-line hover:border-brass transition-colors p-8 sm:p-10"
          >
            <span className="font-stamp text-[10px] uppercase tracking-[0.12em] text-brass">
              Verified
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl mt-3 text-paper group-hover:text-brass-bright transition-colors">
              {featured.subject}
            </h3>
            <p className="text-paper-dim mt-4 max-w-2xl leading-relaxed">
              {featured.dek}
            </p>
            <span className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mt-6 inline-block">
              Read the full record →
            </span>
          </Link>
        </section>
      )}

      {/* CURRENT COLLECTION GRID */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-stamp text-xs uppercase tracking-[0.2em] text-paper-dim">
            More Records
          </h2>
          <Link
            href="/collections"
            className="font-stamp text-[10px] uppercase tracking-[0.12em] text-brass hover:text-brass-bright"
          >
            All Collections →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </section>

      {/* COLLECTIONS STRIP */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-stamp text-xs uppercase tracking-[0.2em] text-paper-dim mb-4">
          Browse By Collection
        </h2>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="font-stamp text-[11px] uppercase tracking-[0.1em] border border-line px-3 py-2 text-paper-dim hover:border-brass hover:text-brass transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section id="subscribe" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="border border-brass p-8 sm:p-10 bg-ink-raised">
          <h2 className="font-serif text-2xl text-paper">
            Five Minutes of Reelspiration, once a week.
          </h2>
          <p className="text-paper-dim mt-2 max-w-lg text-sm leading-relaxed">
            Tell us what you&apos;re facing. We&apos;ll send one verified story that
            fits it — no generic pep talks, no daily noise.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 bg-ink border border-line px-4 py-3 text-paper placeholder:text-paper-dim focus:outline-none focus:border-brass"
            />
            <button
              type="submit"
              className="font-stamp text-xs uppercase tracking-[0.12em] bg-brass text-ink px-5 py-3 hover:bg-brass-bright transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
