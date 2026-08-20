interface ReelspirationShareCardProps {
  subject: string;
  quote: string;
  storyPath: string;
}

export default function ReelspirationShareCard({ subject, quote, storyPath }: ReelspirationShareCardProps) {
  return (
    <div className="relative overflow-hidden border border-brass/60 bg-ink-raised p-7 sm:p-9">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-brass/15" aria-hidden="true" />
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border border-brass/20" aria-hidden="true" />
      <p className="relative font-stamp text-[10px] uppercase tracking-[0.18em] text-brass">The Reelspiration</p>
      <blockquote className="relative mt-5 font-serif text-2xl italic leading-snug text-paper sm:text-3xl">
        “{quote}”
      </blockquote>
      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="font-serif text-xl text-paper">{subject}</p>
          <p className="mt-1 font-stamp text-[10px] uppercase tracking-[0.14em] text-paper-dim">Reelspiration</p>
        </div>
        <p className="font-stamp text-[10px] tracking-[0.08em] text-paper-dim">reelspiration.com{storyPath}</p>
      </div>
    </div>
  );
}
