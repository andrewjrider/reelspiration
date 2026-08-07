import Image from "next/image";
import { StoryRecord } from "@/data/types";

interface PortraitFrameProps {
  story: StoryRecord;
  /**
   * Path to a real photo (e.g. "/portraits/kobe-bryant.jpg"), once one
   * exists. Until then, renders the engraved-seal placeholder below —
   * intentional art direction, not a missing-image box. Drop a real
   * file in /public/portraits/ and pass its path here to swap it in;
   * the duotone treatment, corner mark, and caption bar all apply
   * automatically, no other changes needed.
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
  const initial = story.subject.trim().charAt(0).toUpperCase();
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
        <EngravedSeal initial={initial} uid={story.slug} />
      )}

      {/* Duotone ink wash — applies over real photos too, ties every
          portrait to the same palette regardless of source image */}
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

      {/* Brass corner mark — the seal, per brand system */}
      <div className="absolute top-3 right-3 w-3 h-3 border border-brass rotate-45" />

      {/* Caption bar */}
      <div className={`absolute bottom-0 left-0 right-0 ${captionPad} bg-gradient-to-t from-ink via-ink/70 to-transparent`}>
        <p className={`font-stamp ${nameSize} uppercase tracking-[0.1em] text-paper`}>
          {story.subject}
        </p>
        <p className={`font-serif italic ${dekSize} text-paper-dim mt-0.5 line-clamp-1`}>
          {story.dek}
        </p>
      </div>
    </div>
  );
}

function EngravedSeal({ initial, uid }: { initial: string; uid: string }) {
  const bgId = `sealBg-${uid}`;
  const filterId = `grainSealFilter-${uid}`;
  const patternId = `grainSeal-${uid}`;

  return (
    <svg
      viewBox="0 0 400 500"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={bgId} cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#1b2420" />
          <stop offset="100%" stopColor="#121915" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${bgId})`} />

      {/* Concentric engraved rings */}
      <g fill="none" stroke="#b8863b" strokeOpacity="0.55">
        <circle cx="200" cy="210" r="118" strokeWidth="1" />
        <circle cx="200" cy="210" r="104" strokeWidth="0.5" />
        <circle cx="200" cy="210" r="96" strokeWidth="0.5" />
      </g>

      {/* Radiating fine lines, like an engraved plate */}
      <g stroke="#b8863b" strokeOpacity="0.28" strokeWidth="0.5">
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i / 48) * Math.PI * 2;
          const r1 = 96;
          const r2 = 118;
          const x1 = 200 + Math.cos(angle) * r1;
          const y1 = 210 + Math.sin(angle) * r1;
          const x2 = 200 + Math.cos(angle) * r2;
          const y2 = 210 + Math.sin(angle) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Subject initial */}
      <text
        x="200"
        y="235"
        textAnchor="middle"
        fontFamily="Newsreader, Georgia, serif"
        fontStyle="italic"
        fontSize="92"
        fill="#ece4d3"
        fillOpacity="0.92"
      >
        {initial}
      </text>

      {/* Fine grain texture */}
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <pattern id={patternId} width="100%" height="100%">
        <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity="0.05" />
      </pattern>
      <rect width="400" height="500" fill={`url(#${patternId})`} opacity="0.4" />
    </svg>
  );
}
