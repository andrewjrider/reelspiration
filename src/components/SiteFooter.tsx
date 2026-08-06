export default function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
        <p className="font-stamp text-xs uppercase tracking-[0.12em] text-paper-dim">
          Reelspiration.com
        </p>
        <p className="text-sm text-paper-dim italic">
          Real stories. Real proof. Real Reelspiration.
        </p>
      </div>

      {/* RiderVenture group credit */}
      <div className="border-t border-line">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-center sm:justify-start gap-3">
          <a
            href="https://riderventure.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5"
          >
            <span className="flex items-center justify-center w-5 h-5 border border-brass text-brass font-stamp text-[10px] group-hover:bg-brass group-hover:text-ink transition-colors">
              RV
            </span>
            <span className="font-stamp text-[11px] uppercase tracking-[0.14em] text-paper-dim group-hover:text-brass transition-colors">
              A RiderVenture Company
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
