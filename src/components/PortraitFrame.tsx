import Image from "next/image";
import { StoryRecord } from "@/data/types";
import { getChallenge } from "@/data/challenges";

interface PortraitFrameProps {
  story: StoryRecord;
  /**
   * Path to a real photo (e.g. "/portraits/kobe-bryant.jpg"), once one
   * exists and its rights are cleared. Until then, renders the archival
   * plate below — a composed typographic treatment, not a missing-image
   * box. Drop a file in /public/portraits/ and pass its path here; the
   * duotone treatment, corner mark, and caption all apply automatically.
   */
  imageSrc?: string;
  aspect?: "portrait" | "square";
  size?: "sm" | "lg";
}

export default function PortraitFrame({
  story,
  imageSrc,
  aspect = "portrait",
  size = "lg",
}: PortraitFrameProps) {
  const aspectClass = aspect === "portrait" ? "aspect-[4/5]" : "aspect-square";
  const captionPad = size === "sm" ? "p-3" : "p-4";
  const nameSize = size === "sm" ? "text-[10px]" : "text-[11px]";
  const dekSize = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <div className={`relative ${aspectClass} w-full overflow-hidden bg-ink-raised border border-line`}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={story.subject}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 640px) 33vw, 90vw"}
          className="object-cover"
          style={{
            filter: "grayscale(1) contrast(1.05)",
            mixBlendMode: "luminosity",
          }}
        />
      ) : (
        <ArchivalPlate story={story} size={size} />
      )}

      {imageSrc && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,25,21,0.15) 0%, rgba(18,25,21,0.55) 100%), linear-gradient(0deg, #121915 0%, transparent 55%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      <div className="absolute top-3 right-3 w-3 h-3 border border-brass rotate-45" />

      {/* Caption bar only renders over real photos. The archival plate
          already carries the name and dek as part of its composition —
          repeating them underneath would read as a mistake. */}
      {imageSrc && (
        <div className={`absolute bottom-0 left-0 right-0 ${captionPad} bg-gradient-to-t from-ink via-ink/70 to-transparent`}>
          <p className={`font-stamp ${nameSize} uppercase tracking-[0.1em] text-paper`}>
            {story.subject}
          </p>
          <p className={`font-serif italic ${dekSize} text-paper-dim mt-0.5 line-clamp-1`}>
            {story.dek}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * The no-photo treatment: a composed typographic plate built from
 * metadata the story already carries (subject, dek, pattern tags,
 * challenge, source id). Reads as a deliberate archival record card
 * rather than a placeholder waiting for an image.
 */
function ArchivalPlate({
  story,
  size,
}: {
  story: StoryRecord;
  size: "sm" | "lg";
}) {
  const challenge = getChallenge(story.challenges[0]);
  const isLarge = size === "lg";

  // Pattern tags come through as "Late Bloomer • Reinvention • Starting Again"
  const patternTags = (story.pattern ?? "")
    .split("•")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
      {/* Engraved guilloche field — the texture of a certificate or
          banknote, scaled large and kept very low contrast so it reads
          as material, not decoration. */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id={`plate-${story.slug}`} cx="30%" cy="18%" r="95%">
            <stop offset="0%" stopColor="#222e28" />
            <stop offset="100%" stopColor="#121915" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#plate-${story.slug})`} />
        <g stroke="#b8863b" strokeOpacity="0.13" fill="none">
          {Array.from({ length: 26 }).map((_, i) => (
            <circle
              key={i}
              cx={330}
              cy={430}
              r={30 + i * 22}
              strokeWidth="0.6"
            />
          ))}
        </g>
        {/* Horizontal rule field, like ledger paper */}
        <g stroke="#ece4d3" strokeOpacity="0.04">
          {Array.from({ length: 22 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              x2="400"
              y1={40 + i * 21}
              y2={40 + i * 21}
              strokeWidth="0.5"
            />
          ))}
        </g>
      </svg>

      {/* TOP: classification line */}
      <div className={`relative ${isLarge ? "p-6" : "p-4"}`}>
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-brass" />
          <span className={`font-stamp ${isLarge ? "text-[10px]" : "text-[9px]"} uppercase tracking-[0.18em] text-brass`}>
            {challenge?.prompt ?? "Record"}
          </span>
        </div>
      </div>

      {/* MIDDLE: the name, set as the hero of the composition. Vertically
          centered in the remaining space so the plate reads balanced
          whether or not the story carries pattern tags below. */}
      <div className={`relative flex-1 flex flex-col justify-center ${isLarge ? "px-6" : "px-4"}`}>
        <h3
          className={`font-serif text-paper leading-[0.95] ${
            isLarge ? "text-[2.6rem]" : "text-[1.6rem]"
          }`}
        >
          {story.subject}
        </h3>
        <p
          className={`font-serif italic text-brass-bright mt-2 leading-snug ${
            isLarge ? "text-base" : "text-[12px]"
          }`}
        >
          {story.dek}
        </p>
      </div>

      {/* BOTTOM: pattern tags + record id, the "archival" metadata */}
      <div className={`relative ${isLarge ? "p-6" : "p-4"}`}>
        {patternTags.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
            {patternTags.map((tag) => (
              <span
                key={tag}
                className={`font-stamp uppercase tracking-[0.1em] text-paper-dim ${
                  isLarge ? "text-[9px]" : "text-[8px]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-2.5">
          <span className={`font-stamp uppercase tracking-[0.14em] text-paper-dim ${isLarge ? "text-[9px]" : "text-[8px]"}`}>
            Verified Record
          </span>
          {story.sourceId && (
            <span className={`font-stamp tracking-[0.1em] text-brass ${isLarge ? "text-[9px]" : "text-[8px]"}`}>
              {story.sourceId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
