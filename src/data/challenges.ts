import { Challenge } from "./types";

export const challenges: Challenge[] = [
  {
    slug: "too-old",
    prompt: "I feel too old",
    description:
      "Proof that the clock says less about your ending than you think it does.",
  },
  {
    slug: "rejected",
    prompt: "I was rejected",
    description:
      "Recognizable people who were told no, and what they did the next morning.",
  },
  {
    slug: "starting-over",
    prompt: "I am starting over",
    description:
      "Stories of people who lost the thing they built, and built again.",
  },
  {
    slug: "need-courage",
    prompt: "I need courage",
    description:
      "What courage actually looked like for people history remembers as brave.",
  },
  {
    slug: "recovering",
    prompt: "I am recovering",
    description:
      "Recognizable comebacks from injury, loss, and setbacks that looked permanent.",
  },
  {
    slug: "need-leadership",
    prompt: "I need leadership",
    description:
      "Decisions made under real pressure, by people responsible for other people.",
  },
];

export function getChallenge(slug: string) {
  return challenges.find((c) => c.slug === slug);
}
