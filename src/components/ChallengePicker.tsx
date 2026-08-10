import Link from "next/link";
import { challenges } from "@/data/challenges";

export default function ChallengePicker() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
      {challenges.map((c, i) => (
        <Link
          key={c.slug}
          href={`/challenges/${c.slug}`}
          className="group bg-ink hover:bg-ink-raised transition-colors p-6 flex flex-col min-h-[168px]"
        >
          <div className="flex items-start justify-between">
            <span className="font-stamp text-[11px] text-brass">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim opacity-0 group-hover:opacity-100 transition-opacity">
              Read →
            </span>
          </div>
          <div className="mt-5">
            <p className="font-serif text-2xl text-paper group-hover:text-brass-bright transition-colors">
              {c.prompt}
            </p>
            <p className="text-paper-dim text-[13px] leading-relaxed mt-2">
              {c.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
