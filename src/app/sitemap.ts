import type { MetadataRoute } from "next";
import { challenges } from "@/data/challenges";
import { collections } from "@/data/collections";
import {
  getPublicPublishedStories,
  getPublicStoriesByChallenge,
} from "@/data/stories";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/challenges"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/collections"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/brand"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const challengeRoutes: MetadataRoute.Sitemap = challenges
    .filter((challenge) => getPublicStoriesByChallenge(challenge.slug).length > 0)
    .map((challenge) => ({
      url: absoluteUrl(`/challenges/${challenge.slug}`),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: absoluteUrl(`/collections/${collection.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const storyRoutes: MetadataRoute.Sitemap = getPublicPublishedStories().map((story) => ({
    url: absoluteUrl(`/stories/${story.slug}`),
    lastModified: story.publishedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...challengeRoutes, ...collectionRoutes, ...storyRoutes];
}
