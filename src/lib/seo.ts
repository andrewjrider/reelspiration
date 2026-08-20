import type { Metadata } from "next";

export const SITE_NAME = "Reelspiration";
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reelspiration.com",
);
export const DEFAULT_DESCRIPTION =
  "Recognizable stories of perseverance, real adversity, and one practical takeaway.";
export const DEFAULT_SOCIAL_IMAGE = "/atmosphere/painted-desert-storm.png";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: imageUrl, alt: `${SITE_NAME} — real stories and real proof` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
