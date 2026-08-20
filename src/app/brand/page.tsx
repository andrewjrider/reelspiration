import type { Metadata } from "next";
import Link from "next/link";
import AtmosphericBand from "@/components/AtmosphericBand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Reelspiration",
  description:
    "Why Reelspiration publishes recognizable stories of adversity, decisions, and practical next steps.",
  path: "/brand",
  image: "/atmosphere/stone-wall-ruin.png",
});

export default function AboutPage() {
  return (
    <div>
      <AtmosphericBand src="/atmosphere/stone-wall-ruin.png" scrim="heavy">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-14">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
            About Reelspiration
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-paper leading-tight">
            Proof that an ending is not always the end.
          </h1>
          <p className="text-paper-dim mt-5 max-w-2xl leading-relaxed">
            Reelspiration publishes recognizable stories about people, teams,
            and moments shaped by adversity. Each record turns a real event into
            one memorable principle and one practical next step.
          </p>
        </div>
      </AtmosphericBand>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">
        <section>
          <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim">
            What We Publish
          </h2>
          <p className="text-paper leading-relaxed mt-4 max-w-2xl">
            Public records focus on documented events and avoid presenting
            unfinished editorial material as public fact. Story pages identify
            their source record and link to supporting material when those links
            are available.
          </p>
        </section>

        <section>
          <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim">
            What “Verified” Means
          </h2>
          <p className="text-paper leading-relaxed mt-4 max-w-2xl">
            Reelspiration uses the word verified only when a record includes
            documented review metadata and a complete set of linked sources.
            Other public stories clearly show whether source review or editorial
            review remains in progress.
          </p>
        </section>

        <section className="border border-line bg-ink-raised p-6">
          <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-brass">
            Corrections
          </h2>
          <p className="text-paper leading-relaxed mt-3">
            A public corrections contact is being established before newsletter
            signup is enabled. Until then, no story should be treated as having a
            documented verification review unless its record says so explicitly.
          </p>
        </section>

        <Link
          href="/challenges"
          className="inline-block font-stamp text-xs uppercase tracking-[0.14em] bg-brass text-ink px-6 py-3.5 hover:bg-brass-bright transition-colors"
        >
          Browse Stories
        </Link>
      </div>
    </div>
  );
}
