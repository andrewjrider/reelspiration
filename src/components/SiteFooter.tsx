import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
        <p className="font-stamp text-xs uppercase tracking-[0.12em] text-paper-dim">
          Reelspiration.com
        </p>
        <p className="text-sm text-paper-dim italic">
          Real stories. Real proof. Real Reelspiration.
        </p>
      </div>

      {/* Parent-company signature. Set apart below a hairline rule with
          real breathing room, like a publisher's colophon — the mark is
          allowed to carry its own brand color (the green check) because
          it reads as a signature rather than a competing accent. */}
      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-9 flex flex-col items-center gap-3">
          <span className="font-stamp text-[9px] uppercase tracking-[0.22em] text-paper-dim">
            A Venture Of
          </span>
          <a
            href="https://riderventure.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block opacity-80 hover:opacity-100 transition-opacity"
            aria-label="RiderVenture"
          >
            <Image
              src="/brand/riderventure.png"
              alt="RiderVenture"
              width={640}
              height={148}
              sizes="150px"
              className="w-[150px] h-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
