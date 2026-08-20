"use client";

import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2" onClick={closeMenu}>
          <span className="font-stamp text-xs text-brass">R</span>
          <span className="font-stamp text-sm uppercase tracking-[0.2em] text-paper">
            Reelspiration
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden sm:flex items-center gap-6 font-stamp text-xs uppercase tracking-[0.12em] text-paper-dim">
          <Link href="/challenges" className="hover:text-brass transition-colors">
            Stories
          </Link>
          <Link href="/collections" className="hover:text-brass transition-colors">
            Collections
          </Link>
          <Link href="/brand" className="hover:text-brass transition-colors">
            About
          </Link>
          <Link
            href="/#subscribe"
            className="border border-brass text-brass px-3 py-1.5 hover:bg-brass hover:text-ink transition-colors"
          >
            Weekly Proof
          </Link>
        </nav>
        <button
          type="button"
          className="sm:hidden font-stamp text-[10px] uppercase tracking-[0.14em] text-paper border border-line px-3 py-2 hover:border-brass hover:text-brass transition-colors"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${menuOpen ? "block" : "hidden"} sm:hidden border-t border-line bg-ink`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 grid gap-px bg-line">
          {[
            ["Stories", "/challenges"],
            ["Collections", "/collections"],
            ["About", "/brand"],
            ["Weekly Proof", "/#subscribe"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="bg-ink px-4 py-3 font-stamp text-[11px] uppercase tracking-[0.12em] text-paper-dim hover:text-brass hover:bg-ink-raised transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
