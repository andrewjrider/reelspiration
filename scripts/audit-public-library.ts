import { challenges } from "../src/data/challenges";
import { collections } from "../src/data/collections";
import {
  getHiddenStoriesWithReasons,
  getPublicPublishedStories,
  getPublicStoriesByChallenge,
  getPublicStoriesByCollection,
} from "../src/data/stories";

const baseUrl = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const publicStories = getPublicPublishedStories();
const hiddenStories = getHiddenStoriesWithReasons();
const representativeSlugs = [
  "steve-jobs",
  "michael-jordan",
  "walt-disney",
  "tom-brady",
  "kobe-bryant",
  "colonel-harland-sanders",
  "abraham-lincoln",
  "winston-churchill",
  "oprah-winfrey",
  "apollo-13",
];

function storyLinks(html: string): Set<string> {
  return new Set(
    [...html.matchAll(/<a[^>]+href="\/stories\/([^"]+)"/g)].map(
      (match) => match[1],
    ),
  );
}

async function main() {
  const publicRouteResults = await Promise.all(
    publicStories.map(async (story) => ({
      slug: story.slug,
      status: (await fetch(`${baseUrl}/stories/${story.slug}`)).status,
    })),
  );
  const hiddenRouteResults = await Promise.all(
    hiddenStories.map(async (story) => ({
      ...story,
      status: (await fetch(`${baseUrl}/stories/${story.slug}`)).status,
    })),
  );

  const homeResponse = await fetch(`${baseUrl}/`);
  const home = await homeResponse.text();
  const browseAllResponse = await fetch(`${baseUrl}/stories`);
  const browseAll = await browseAllResponse.text();
  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  const robotsResponse = await fetch(`${baseUrl}/robots.txt`);

  const representative = await Promise.all(
    representativeSlugs.map(async (slug) => {
      const story = publicStories.find((candidate) => candidate.slug === slug);
      if (!story) return { slug, status: 0, reason: "missing from public data" };

      const response = await fetch(`${baseUrl}/stories/${slug}`);
      const html = await response.text();
      const mainHtml = html.slice(html.indexOf("<main"));
      const shareImageResponse = await fetch(`${baseUrl}/api/share-card/${slug}`);
      const relatedSlugs =
        html.match(/data-related-story-slugs="([^"]*)"/)?.[1].split(",").filter(Boolean) ?? [];
      const hierarchyLabels = [
        "The Story",
        ...(story.decision ? ["The Decision"] : []),
        "The Reelspiration",
        "The Principle",
        "Your Next Step",
        "Share This Reelspiration",
        "Weekly Proof",
        "More Like This",
        "Sources &amp; Record Status",
      ];
      const hierarchyIndexes = hierarchyLabels.map((label) => mainHtml.indexOf(label));
      const expectedLabel =
        story.verificationStatus === "editorial-review"
          ? "Editorial Review in Progress"
          : story.verificationStatus === "verified"
            ? "Verified Record"
            : "Source Review in Progress";

      return {
        slug,
        status: response.status,
        verificationStatus: story.verificationStatus,
        labelPresent: html.includes(expectedLabel),
        canonicalPresent: html.includes(
          `rel="canonical" href="https://reelspiration.com/stories/${slug}"`,
        ),
        openGraphPresent: html.includes('property="og:title"'),
        shareImageMetadataPresent: html.includes(`/api/share-card/${slug}`),
        shareImageStatus: shareImageResponse.status,
        shareImageType: shareImageResponse.headers.get("content-type"),
        structuredDataPresent: html.includes('"@type":"Article"'),
        artifactFree: !/---|Production approval checklist|Final brand card/i.test(html),
        hierarchyCorrect:
          hierarchyIndexes.every((index) => index >= 0) &&
          hierarchyIndexes.every((index, position) => position === 0 || index > hierarchyIndexes[position - 1]),
        relatedCount: relatedSlugs.length,
        relatedUnique: new Set(relatedSlugs).size === relatedSlugs.length && !relatedSlugs.includes(slug),
      };
    }),
  );

  const challengeChecks = await Promise.all(
    challenges.map(async (challenge) => {
      const html = await (await fetch(`${baseUrl}/challenges/${challenge.slug}`)).text();
      const initialCount = Number(
        html.match(/data-initial-story-count="(\d+)"/)?.[1] ?? 0,
      );
      return {
        slug: challenge.slug,
        expected: getPublicStoriesByChallenge(challenge.slug).length,
        actual: storyLinks(html).size,
        expectedInitial: Math.min(12, getPublicStoriesByChallenge(challenge.slug).length),
        initialCount,
        correctContext: html.includes(">Challenge<"),
        hasDisclosure:
          getPublicStoriesByChallenge(challenge.slug).length <= 12 ||
          html.includes("Show More Stories"),
      };
    }),
  );
  const collectionChecks = await Promise.all(
    collections.map(async (collection) => {
      const html = await (await fetch(`${baseUrl}/collections/${collection.slug}`)).text();
      const initialCount = Number(
        html.match(/data-initial-story-count="(\d+)"/)?.[1] ?? 0,
      );
      return {
        slug: collection.slug,
        expected: getPublicStoriesByCollection(collection.slug).length,
        actual: storyLinks(html).size,
        expectedInitial: Math.min(12, getPublicStoriesByCollection(collection.slug).length),
        initialCount,
        hasDisclosure:
          getPublicStoriesByCollection(collection.slug).length <= 12 ||
          html.includes("Show More Stories"),
      };
    }),
  );

  const expectedSitemapUrls =
    6 +
    challenges.filter((challenge) => getPublicStoriesByChallenge(challenge.slug).length > 0)
      .length +
    collections.length +
    publicStories.length;
  const sitemapUrlCount = (sitemap.match(/<url>/g) ?? []).length;
  const unknownStatus = (await fetch(`${baseUrl}/stories/not-a-real-record`)).status;

  const result = {
    inventory: {
      total: publicStories.length + hiddenStories.length,
      public: publicStories.length,
      verified: publicStories.filter((story) => story.verificationStatus === "verified")
        .length,
      sourceReview: publicStories.filter(
        (story) => story.verificationStatus === "source-review",
      ).length,
      editorialReview: publicStories.filter(
        (story) => story.verificationStatus === "editorial-review",
      ).length,
      hidden: hiddenStories,
    },
    routes: {
      publicTested: publicRouteResults.length,
      publicFailures: publicRouteResults.filter((result) => result.status !== 200),
      hiddenFailures: hiddenRouteResults.filter((result) => result.status !== 404),
      unknownStatus,
    },
    homepage: {
      status: homeResponse.status,
      countMatches: new RegExp(
        `${publicStories.length}<\\/span>\\s*(?:<!-- -->)?\\s*public records`,
        "i",
      ).test(home),
      storyAppearances: storyLinks(home).size,
      expectedStoryAppearances: 17,
    },
    browseAll: {
      status: browseAllResponse.status,
      storyCount: storyLinks(browseAll).size,
      expectedStoryCount: publicStories.length,
    },
    sitemap: {
      status: sitemapResponse.status,
      expectedUrlCount: expectedSitemapUrls,
      actualUrlCount: sitemapUrlCount,
      allPublicStoriesPresent: publicStories.every((story) =>
        sitemap.includes(`/stories/${story.slug}`),
      ),
      hiddenStoriesAbsent: hiddenStories.every(
        (story) => !sitemap.includes(`/stories/${story.slug}`),
      ),
    },
    robotsStatus: robotsResponse.status,
    representative,
    challengeChecks,
    collectionChecks,
  };

  console.log(JSON.stringify(result, null, 2));

  const failed =
    result.routes.publicFailures.length > 0 ||
    result.routes.hiddenFailures.length > 0 ||
    result.routes.unknownStatus !== 404 ||
    !result.homepage.countMatches ||
    result.homepage.storyAppearances !== result.homepage.expectedStoryAppearances ||
    result.browseAll.status !== 200 ||
    result.browseAll.storyCount !== result.browseAll.expectedStoryCount ||
    result.sitemap.status !== 200 ||
    result.sitemap.expectedUrlCount !== result.sitemap.actualUrlCount ||
    !result.sitemap.allPublicStoriesPresent ||
    !result.sitemap.hiddenStoriesAbsent ||
    result.robotsStatus !== 200 ||
    result.representative.some(
      (story) =>
        story.status !== 200 ||
        !("labelPresent" in story) ||
        !story.labelPresent ||
        !story.canonicalPresent ||
        !story.openGraphPresent ||
        !story.shareImageMetadataPresent ||
        story.shareImageStatus !== 200 ||
        story.shareImageType !== "image/png" ||
        !story.structuredDataPresent ||
        !story.artifactFree ||
        !story.hierarchyCorrect ||
        story.relatedCount !== 3 ||
        !story.relatedUnique,
    ) ||
    result.challengeChecks.some(
      (check) =>
        check.expected !== check.actual ||
        check.expectedInitial !== check.initialCount ||
        !check.correctContext ||
        !check.hasDisclosure,
    ) ||
    result.collectionChecks.some(
      (check) =>
        check.expected !== check.actual ||
        check.expectedInitial !== check.initialCount ||
        !check.hasDisclosure,
    );

  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
