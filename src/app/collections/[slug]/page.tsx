import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/data/collections";
import { getPublicStoriesByCollection } from "@/data/stories";
import { atmosphereForCollection } from "@/data/atmosphere";
import StoryCard from "@/components/StoryCard";
import AtmosphericBand from "@/components/AtmosphericBand";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { robots: { index: false, follow: false } };

  return pageMetadata({
    title: collection.name,
    description: collection.description,
    path: `/collections/${collection.slug}`,
    image: atmosphereForCollection(collection.slug),
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const stories = getPublicStoriesByCollection(slug);

  return (
    <div>
      <AtmosphericBand src={atmosphereForCollection(slug)} scrim="heavy">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
            Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-paper">
            {collection.name}
          </h1>
          <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
            {collection.description}
          </p>
        </div>
      </AtmosphericBand>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stories.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        ) : (
          <p className="text-paper-dim italic border border-line p-8 text-center">
            No records have been published for this collection yet.
          </p>
        )}
      </div>
    </div>
  );
}
