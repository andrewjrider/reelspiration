import { getPublicPublishedStory } from "@/data/stories";
import { createStoryShareImage } from "@/lib/share-card-image";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const story = getPublicPublishedStory(slug);

  if (!story) {
    return new Response("Story not found", { status: 404 });
  }

  const download = new URL(request.url).searchParams.get("download") === "1";
  return createStoryShareImage(story, download);
}
