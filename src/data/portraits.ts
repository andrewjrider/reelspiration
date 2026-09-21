// Mosaic-style portrait art, cropped from Andrew's commissioned composite
// sheet. Keyed by story slug. Drop a new file in /public/portraits/ and add
// an entry here to light up a story's PortraitFrame with a real image
// instead of the archival-plate fallback.
export const PORTRAITS: Record<string, string> = {
  "kobe-bryant": "/portraits/kobe-bryant.jpg",
  "muhammad-ali": "/portraits/muhammad-ali.jpg",
  "nelson-mandela": "/portraits/nelson-mandela.jpg",
  "marie-curie": "/portraits/marie-curie.jpg",
  "abraham-lincoln": "/portraits/abraham-lincoln.jpg",
  "colonel-harland-sanders": "/portraits/colonel-harland-sanders.jpg",
  "ernest-shackleton": "/portraits/ernest-shackleton.jpg",
  "henry-ford": "/portraits/henry-ford.jpg",
  "oprah-winfrey": "/portraits/oprah-winfrey.jpg",
  "sara-blakely": "/portraits/sara-blakely.jpg",
  "wilma-rudolph": "/portraits/wilma-rudolph.jpg",
  "amy-purdy": "/portraits/amy-purdy.jpg",
  "tiger-woods": "/portraits/tiger-woods.jpg",
  "steve-jobs": "/portraits/steve-jobs.jpg",
};

export function portraitSrc(slug: string): string | undefined {
  return PORTRAITS[slug];
}
