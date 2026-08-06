import { stories } from "@/data/stories";

const swatches = [
  { name: "Ink", token: "--ink", hex: "#121915", role: "Background" },
  { name: "Ink Raised", token: "--ink-raised", hex: "#1b2420", role: "Cards, panels" },
  { name: "Paper", token: "--paper", hex: "#ece4d3", role: "Primary text" },
  { name: "Paper Dim", token: "--paper-dim", hex: "#a79f8c", role: "Secondary text" },
  { name: "Brass", token: "--brass", hex: "#b8863b", role: "The proof accent — the one everyone should recognize" },
  { name: "Rust", token: "--rust", hex: "#8c4a34", role: "Adversity-state tag only" },
  { name: "Moss", token: "--moss", hex: "#46614f", role: "Resolution-state tag only" },
];

const beats = [
  { n: 1, name: "Hook", reaction: "\u201cWait, I didn't know that...\u201d", field: "dek" },
  { n: 2, name: "Struggle", reaction: "\u201cI can relate to this.\u201d", field: "adversity" },
  { n: 3, name: "Decision", reaction: "\u201cThat's the turning point.\u201d", field: "decision" },
  { n: 4, name: "Outcome", reaction: "\u201cThat's incredible.\u201d", field: "turningPoint" },
  { n: 5, name: "Reelspiration", reaction: "\u201cI'm thinking differently now.\u201d", field: "reelspiration" },
  { n: 6, name: "Action", reaction: "\u201cI can do something today.\u201d", field: "nextStep" },
];

export default function BrandPage() {
  const sample = stories[0];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
        Internal Reference
      </p>
      <h1 className="font-serif text-4xl text-paper">Brand System</h1>
      <p className="text-paper-dim mt-3 max-w-lg leading-relaxed">
        Built from the live production tokens in globals.css — if this page
        and the site ever look different, this page is wrong, not the site.
        Full rationale in /BRAND.md.
      </p>

      {/* COLOR */}
      <section className="mt-16">
        <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim mb-4">
          Color
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
          {swatches.map((s) => (
            <div key={s.token} className="bg-ink p-4">
              <div
                className="h-16 w-full border border-line mb-3"
                style={{ background: s.hex }}
              />
              <p className="font-stamp text-[11px] uppercase tracking-[0.1em] text-paper">
                {s.name}
              </p>
              <p className="font-stamp text-[10px] text-paper-dim mt-1">{s.token}</p>
              <p className="text-xs text-paper-dim mt-1">{s.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TYPE */}
      <section className="mt-16">
        <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim mb-4">
          Typography
        </h2>
        <div className="border border-line p-8 space-y-8">
          <div>
            <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-brass mb-2">
              Newsreader — carries the story
            </p>
            <p className="font-serif text-3xl text-paper">
              The mission failed completely, and the leadership didn&apos;t.
            </p>
            <p className="font-serif text-xl italic text-paper-dim mt-2">
              Italic for the hook and the dek — the emotional entry point.
            </p>
          </div>
          <div>
            <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-brass mb-2">
              Archivo — carries the proof
            </p>
            <p className="font-stamp text-sm uppercase tracking-[0.12em] text-paper">
              Verified Record — I Was Rejected — Your Next Step
            </p>
          </div>
        </div>
      </section>

      {/* THE 6 BEATS */}
      <section className="mt-16">
        <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim mb-4">
          The House Rhythm
        </h2>
        <div className="border border-line divide-y divide-line">
          {beats.map((b) => (
            <div key={b.n} className="p-4 flex items-center gap-4">
              <span className="font-stamp text-xs text-brass w-6">
                {String(b.n).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="font-serif text-lg text-paper">{b.name}</p>
                <p className="text-sm text-paper-dim italic">{b.reaction}</p>
              </div>
              <span className="font-stamp text-[10px] text-paper-dim uppercase tracking-[0.1em]">
                {b.field}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* THUMBNAIL MOCK */}
      <section className="mt-16">
        <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim mb-4">
          Thumbnail Construction
        </h2>
        <div className="flex gap-6 flex-wrap">
          <div className="w-48 aspect-[9/16] bg-ink-raised border border-line relative overflow-hidden">
            <div className="absolute top-3 right-3 w-3 h-3 border border-brass rotate-45" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink to-transparent">
              <p className="font-stamp text-[11px] uppercase tracking-[0.1em] text-paper">
                {sample.subject}
              </p>
              <p className="font-serif italic text-[11px] text-paper-dim mt-0.5">
                {sample.challenges[0] === "rejected" ? "rejected twice, built anyway" : sample.dek.slice(0, 30) + "..."}
              </p>
            </div>
          </div>
          <div className="max-w-sm text-sm text-paper-dim leading-relaxed">
            <p>Brass corner mark, fixed position, every thumbnail.</p>
            <p className="mt-2">
              Name in Archivo caps, one identifying fact beneath in
              Newsreader italic. No other text on the frame — everything
              else lives in the caption.
            </p>
          </div>
        </div>
      </section>

      {/* END CARD / SIGNATURE MOMENT MOCK */}
      <section className="mt-16 mb-8">
        <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim mb-4">
          The Signature Moment
        </h2>
        <div className="border border-line p-8 bg-ink-raised">
          <p className="text-paper-dim text-sm leading-relaxed max-w-lg">
            One second of near-silence after the Outcome beat. Frame holds.
            Then, same four words, every time:
          </p>
          <p className="font-serif text-2xl italic text-brass-bright mt-4">
            &ldquo;...and that&apos;s the Reelspiration:&rdquo;
          </p>
          <div className="mt-6 h-px w-24 bg-brass" />
          <p className="font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim mt-3">
            Reelspiration
          </p>
        </div>
      </section>
    </div>
  );
}
