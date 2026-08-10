import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-stamp text-xs text-brass">R</span>
          <span className="font-stamp text-sm uppercase tracking-[0.2em] text-paper">
            Reelspiration
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 font-stamp text-xs uppercase tracking-[0.12em] text-paper-dim">
          <Link href="/challenges" className="hover:text-brass transition-colors">
            Stories
          </Link>
          <Link href="/collections" className="hover:text-brass transition-colors">
            Collections
          </Link>
          <Link href="/brand" className="hover:text-brass transition-colors">
            Brand
          </Link>
          <Link
            href="/#subscribe"
            className="border border-brass text-brass px-3 py-1.5 hover:bg-brass hover:text-ink transition-colors"
          >
            Weekly Proof
          </Link>
        </nav>
      </div>
    </header>
  );
}
