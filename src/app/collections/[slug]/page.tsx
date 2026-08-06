import { notFound } from "next/navigation";
import { collections, getCollection } from "@/data/collections";
import { getStoriesByCollection } from "@/data/stories";
import StoryCard from "@/components/StoryCard";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const stories = getStoriesByCollection(slug);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
        Collection
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl text-paper">
        {collection.name}
      </h1>
      <p className="text-paper-dim mt-4 max-w-lg leading-relaxed">
        {collection.description}
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
            New records for this collection are in production.
          </p>
        )}
      </div>
    </div>
  );
}
