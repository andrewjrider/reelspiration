import Link from "next/link";
import { collections } from "@/data/collections";
import { getStoriesByCollection } from "@/data/stories";
import AtmosphericBand from "@/components/AtmosphericBand";

export default function CollectionsIndex() {
  return (
    <div>
      <AtmosphericBand src="/atmosphere/tahoe-shoreline.png" scrim="heavy">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
            The Library
          </p>
          <h1 className="font-serif text-4xl text-paper max-w-xl leading-tight">
            Collections
          </h1>
          <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
            Grouped by theme rather than by moment — for when you know what kind
            of story you&apos;re looking for.
          </p>
        </div>
      </AtmosphericBand>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
          {collections.map((c) => {
            const count = getStoriesByCollection(c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="group bg-ink hover:bg-ink-raised transition-colors p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl text-paper group-hover:text-brass-bright transition-colors">
                    {c.name}
                  </h2>
                  <span className="font-stamp text-[10px] text-paper-dim">
                    {count} {count === 1 ? "record" : "records"}
                  </span>
                </div>
                <p className="text-paper-dim text-sm mt-2 leading-relaxed">
                  {c.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
