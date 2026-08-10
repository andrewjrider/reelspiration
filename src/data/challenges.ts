import { Challenge } from "./types";

// Naming note: these were originally first-person confessions ("I was
// rejected", "I am starting over"). That framing asked visitors to
// self-diagnose and admit a problem before they'd seen anything — a
// therapy-intake pattern, not a browsing pattern. Reworded to
// third-person, outcome-forward labels: same taxonomy, same routing,
// same six pages, but clicking now feels like picking a kind of story
// rather than raising your hand about a personal problem.

export const challenges: Challenge[] = [
  {
    slug: "too-old",
    prompt: "Late Starts",
    description:
      "People who began the thing they're remembered for long after the world said the window had closed.",
  },
  {
    slug: "rejected",
    prompt: "Told No",
    description:
      "The rejections that became footnotes — and what these people did the next morning.",
  },
  {
    slug: "starting-over",
    prompt: "Fresh Starts",
    description:
      "They lost what they built, and built again. Usually bigger.",
  },
  {
    slug: "need-courage",
    prompt: "Uncommon Courage",
    description:
      "What courage actually looked like, moment to moment, for people history calls brave.",
  },
  {
    slug: "recovering",
    prompt: "Strong Recoveries",
    description:
      "Comebacks from injury, loss, and setbacks that everyone assumed were permanent.",
  },
  {
    slug: "need-leadership",
    prompt: "Leadership Stories",
    description:
      "Decisions made under real pressure, by people responsible for other people.",
  },
];

export function getChallenge(slug: string) {
  return challenges.find((c) => c.slug === slug);
}
