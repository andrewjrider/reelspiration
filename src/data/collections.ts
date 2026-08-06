import { Collection } from "./types";

export const collections: Collection[] = [
  {
    slug: "business-builders",
    name: "Business Builders",
    description: "Founders and operators who built through rejection and ruin.",
  },
  {
    slug: "athletic-adversity",
    name: "Athletic Adversity",
    description: "Athletes whose bodies or circumstances tried to end the story early.",
  },
  {
    slug: "greatest-comebacks",
    name: "Greatest Comebacks",
    description: "The clearest before-and-after arcs in the library.",
  },
  {
    slug: "historic-decisions",
    name: "Historic Decisions",
    description: "Single choices, made under pressure, that changed what came next.",
  },
  {
    slug: "teams-that-refused-to-quit",
    name: "Teams That Refused to Quit",
    description: "Crews, squads, and companies that held together when it mattered.",
  },
  {
    slug: "entrepreneurs",
    name: "Entrepreneurs",
    description: "People who bet on an idea nobody else believed in yet.",
  },
  {
    slug: "athletes",
    name: "Athletes",
    description: "Competitive careers defined as much by setback as by talent.",
  },
  {
    slug: "military-courage",
    name: "Military Courage",
    description: "Command decisions and acts of service under real stakes.",
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
