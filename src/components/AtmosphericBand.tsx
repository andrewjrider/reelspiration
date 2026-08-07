import { ReactNode } from "react";

interface AtmosphericBandProps {
  src: string;
  children: ReactNode;
  /** How dark the ink scrim is — "heavy" for text-on-image sections like
   * the hero, "light" for shorter accent bands where the image should
   * read more clearly. */
  scrim?: "heavy" | "light";
  className?: string;
}

/**
 * A landscape photo, toned into the brand palette, used as a section
 * background. Uses CSS background-image rather than next/image so
 * height can flex naturally with content instead of requiring a fixed
 * pixel height up front.
 */
export default function AtmosphericBand({
  src,
  children,
  scrim = "heavy",
  className = "",
}: AtmosphericBandProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-ink ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(0.85) contrast(1.08) brightness(0.55)",
        }}
      />
      {/* Brass color wash — ties any photo back to the brand palette
          instead of leaving it a neutral desaturated image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(184,134,59,0.16) 0%, rgba(18,25,21,0.1) 45%, rgba(18,25,21,0.5) 100%)",
          mixBlendMode: "overlay",
        }}
      />
      {/* Ink scrim for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            scrim === "heavy"
              ? "linear-gradient(180deg, rgba(18,25,21,0.7) 0%, rgba(18,25,21,0.5) 40%, rgba(18,25,21,0.85) 100%)"
              : "linear-gradient(180deg, rgba(18,25,21,0.35) 0%, rgba(18,25,21,0.6) 100%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
