import Link from "next/link";
import { challenges } from "@/data/challenges";

export default function ChallengePicker() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
      {challenges.map((c, i) => (
        <Link
          key={c.slug}
          href={`/challenges/${c.slug}`}
          className="group bg-ink hover:bg-ink-raised transition-colors p-6 flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-start justify-between">
            <span className="font-stamp text-[11px] text-brass">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim opacity-0 group-hover:opacity-100 transition-opacity">
              Enter →
            </span>
          </div>
          <div>
            <p className="font-serif text-xl italic text-paper">&ldquo;{c.prompt}&rdquo;</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
