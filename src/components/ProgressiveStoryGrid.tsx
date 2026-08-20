import EditorialStoryFeature from "@/components/EditorialStoryFeature";
import StoryCard from "@/components/StoryCard";
import { StoryRecord } from "@/data/types";

interface ProgressiveStoryGridProps {
  stories: StoryRecord[];
  initialCount?: number;
  showContext?: boolean;
}

function StoryItems({
  stories,
  startIndex,
  showContext,
}: {
  stories: StoryRecord[];
  startIndex: number;
  showContext: boolean;
}) {
  return stories.map((story, localIndex) => {
    const index = startIndex + localIndex;
    return index > 0 && index % 7 === 6 ? (
      <EditorialStoryFeature key={story.slug} story={story} />
    ) : (
      <StoryCard key={story.slug} story={story} showContext={showContext} />
    );
  });
}

export default function ProgressiveStoryGrid({
  stories,
  initialCount = 12,
  showContext = true,
}: ProgressiveStoryGridProps) {
  const initialStories = stories.slice(0, initialCount);
  const remainingStories = stories.slice(initialCount);

  return (
    <div>
      <div
        data-story-grid="initial"
        data-initial-story-count={initialStories.length}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <StoryItems
          stories={initialStories}
          startIndex={0}
          showContext={showContext}
        />
      </div>

      {remainingStories.length > 0 && (
        <details className="group mt-8">
          <summary className="list-none cursor-pointer border border-brass text-brass hover:bg-brass hover:text-ink transition-colors px-5 py-3.5 font-stamp text-[11px] uppercase tracking-[0.14em] flex items-center justify-center gap-3 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show More Stories</span>
            <span className="hidden group-open:inline">Hide Additional Stories</span>
            <span className="opacity-70">{remainingStories.length}</span>
          </summary>
          <div
            data-story-grid="more"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
          >
            <StoryItems
              stories={remainingStories}
              startIndex={initialStories.length}
              showContext={showContext}
            />
          </div>
        </details>
      )}
    </div>
  );
}
