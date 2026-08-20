import Image from "next/image";
import AtmosphericBand from "./AtmosphericBand";
import type { StoryHeroMedia as StoryHeroMediaRecord } from "@/data/types";

interface StoryHeroMediaProps {
  subject: string;
  sourceId?: string;
  media?: StoryHeroMediaRecord;
  fallbackSrc: string;
}

export default function StoryHeroMedia({
  subject,
  sourceId,
  media,
  fallbackSrc,
}: StoryHeroMediaProps) {
  if (media?.kind === "image") {
    return (
      <MediaFrame caption={media.caption}>
        <div className="relative aspect-[16/9]">
          <Image src={media.src} alt={media.alt} fill priority sizes="(max-width: 768px) 100vw, 960px" className="object-cover" />
        </div>
      </MediaFrame>
    );
  }

  if (media?.kind === "video") {
    return (
      <MediaFrame caption={media.caption}>
        <video className="aspect-video w-full bg-ink" controls preload="metadata" poster={media.poster} aria-label={media.title}>
          <source src={media.src} />
          Your browser does not support embedded video.
        </video>
      </MediaFrame>
    );
  }

  if (media?.kind === "embed") {
    return (
      <MediaFrame caption={media.caption}>
        <iframe
          src={media.src}
          title={media.title}
          className="aspect-video w-full border-0 bg-ink"
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </MediaFrame>
    );
  }

  const atmosphereSrc = media?.kind === "atmosphere" ? media.src : fallbackSrc;
  const atmosphereAlt = media?.kind === "atmosphere" ? media.alt : "";

  return (
    <MediaFrame caption={media?.caption}>
      <AtmosphericBand src={atmosphereSrc} scrim="light">
        <div
          className="relative flex aspect-[16/7] min-h-64 flex-col justify-between p-7 sm:p-10"
          role={atmosphereAlt ? "img" : undefined}
          aria-label={atmosphereAlt || undefined}
        >
          <div className="absolute inset-5 border border-brass/35" aria-hidden="true" />
          <p className="relative font-stamp text-[11px] uppercase tracking-[0.18em] text-brass">
            Reelspiration Original
          </p>
          <div className="relative">
            <p className="max-w-2xl font-serif text-3xl text-paper sm:text-5xl">{subject}</p>
            <div className="mt-4 h-px w-16 bg-brass" aria-hidden="true" />
          </div>
          <p className="relative font-stamp text-[10px] uppercase tracking-[0.16em] text-paper-dim">
            {sourceId ? `Record ${sourceId}` : "An archival record"}
          </p>
        </div>
      </AtmosphericBand>
    </MediaFrame>
  );
}

function MediaFrame({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className="mx-auto w-full max-w-5xl px-6 pt-10 sm:pt-12">
      <div className="overflow-hidden border border-line bg-ink-raised">{children}</div>
      {caption ? <figcaption className="mt-2 text-sm text-paper-dim">{caption}</figcaption> : null}
    </figure>
  );
}
