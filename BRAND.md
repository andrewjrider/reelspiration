# Reelspiration Brand System

The test: someone scrolling should know it's Reelspiration before they read
the username. Everything below exists to pass that test.

## The house rhythm (6 beats)

Every piece of short-form content follows this emotional sequence, no
exceptions. It maps directly to the `StoryRecord` schema — no new fields
needed, just discipline about the order and pacing:

| Beat | Viewer reaction | Schema field | Approx. timing (35-60s Reel) |
|---|---|---|---|
| 1. Hook | "Wait, I didn't know that..." | `dek` | 0-5s |
| 2. Struggle | "I can relate to this." | `adversity` | 5-15s |
| 3. Decision | "That's the turning point." | `decision` | 15-25s |
| 4. Outcome | "That's incredible." | `turningPoint` | 25-35s |
| 5. Reelspiration | "I'm thinking differently now." | `reelspiration` | 35-48s |
| 6. Action | "I can do something today." | `nextStep` | 48-58s |

`worldBefore`, `principle`, and `whyItMatters` are the long-form fields
that only the website's canonical story page uses — they give the Reel
somewhere to send people who want more, which is the whole point of
"library first, distribution engine second."

## The signature Reelspiration moment

A brand needs one recognizable beat, not five competing ones. This is ours:

**The pause before the turn.** Immediately after beat 4 (Outcome), the
video holds on a still frame for a full second of near-silence — music
ducks out, no narration — before the narrator says the same four words
every time: *"...and that's the Reelspiration:"* — then delivers the
line. That exact phrase, same flat cadence, same half-beat of silence
before it, on every single video. Someone who has seen three Reelspiration
videos will recognize the fourth from the pause alone, before a word is
spoken — which means it works even with the sound off, scrolling fast.

Visually, the same moment gets a consistent treatment: the frame desaturates
very slightly, a thin brass rule draws in from the left under the subject's
name, and the wordmark appears bottom-right at reduced opacity. Same
position, same brass color, every time. This is the "seal" — literally,
since the visual language (see below) is built around the idea of a stamp
of verification, not a sticker or a badge.

## Visual identity

**Palette** (already implemented in `globals.css` as CSS custom properties
— this is the production system, not a proposal):

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#121915` | Background. Near-black green-black, not pure black — warmer, less harsh on video. |
| `--ink-raised` | `#1b2420` | Cards, raised panels. |
| `--paper` | `#ece4d3` | Primary text, warm bone — reads as archival paper, not a screen. |
| `--paper-dim` | `#a79f8c` | Secondary text, captions, metadata. |
| `--brass` | `#b8863b` | The single verified/proof accent. Used sparingly — this is the "you know it's Reelspiration" color. |
| `--rust` | `#8c4a34` | Adversity-state tag color only. Never decorative. |
| `--moss` | `#46614f` | Resolution-state tag color only. Never decorative. |

Rule: brass appears on every piece of content — thumbnail corner mark,
end-card rule, the challenge tag on the story page, the "Verified" label.
Rust and moss are functional (they mark which beat of the story you're
reading), not decorative, and should never be used interchangeably with
brass or with each other.

**Typography**: Newsreader (serif) carries every sentence a human is meant
to *feel* — hooks, story copy, the Reelspiration line itself. Archivo
(grotesk, wide letter-spacing) is reserved for structural/stamp language —
labels, tags, timestamps, the wordmark. The pairing itself is the brand
signal: serif for the story, grotesk for the proof stamped on top of it.
Never swap them — Archivo never carries a full sentence of narrative, and
Newsreader never labels a UI element.

## Thumbnail consistency

Every thumbnail, regardless of platform or template family, follows the
same construction:

1. Subject photo, duotone-toned in `--ink` shadows / `--paper` highlights
   (turns any archival or stock photo into on-brand color instantly,
   regardless of its original color cast).
2. Brass corner mark, top-right, fixed size, fixed position — the seal.
3. Bottom third: subject name in Archivo caps, one identifying fact
   directly beneath in Newsreader italic (e.g. "SARA BLAKELY" / *founder,
   rejected twice*). Same two-line structure, every thumbnail.
4. No other text, no arrows, no "swipe up" graphics, no emoji on the
   thumbnail itself — those live in the caption, not the frame.

## Motion style

Restrained and documentary, not hype-reel. Concretely:

- Cuts land on sentence boundaries, never mid-clause.
- Camera moves on stills are slow pans/holds (Ken Burns, not punch-zooms).
- Typography reveals via simple fade-and-rise. No spins, no glitch
  transitions, no bounce easing.
- One exception to "restrained": the signature moment's brass rule-line
  draw-in (see above) — this is the single place motion is allowed to be
  slightly more deliberate/noticeable, because it's the brand's signature,
  not decoration.

## Music direction

Single-instrument-led (solo piano, cello, or sparse strings), not
library-standard "corporate inspiration" builds. Concretely avoid: choir
swells, snare-roll builds, the generic four-chord piano ostinato that
shows up in every stock inspirational track. The score should shift from
minor to major precisely at beat 3 (Decision) — the music turns when the
story turns, not before. Music ducks to near-silent under the signature
pause (see above) and under all narration generally; it is never louder
than the voice.

## Voiceover style

Measured pace — 130-145 words per minute, noticeably slower than typical
Instagram voiceover pacing. Warm, low-to-mid register. Documentary
narrator, not hype-man: think restrained PBS/long-form-documentary
narration, not energetic ad-read. Energy lifts exactly once per video — on
beat 6 (Action) — as the one deliberate exception to the otherwise flat,
measured register. That lift is what makes the Action beat feel different
from everything before it.

## Brand language

Voice: documentary storyteller, not motivational speaker. This was already
in the editorial rules; extending it into a concrete banned-phrase list so
it's enforceable, not just aspirational:

**Never use these as standalone lines** (they're fine as one clause inside
a longer, specific sentence, but never as the takeaway itself):
"you've got this," "never give up," "the only way is up," "believe in
yourself," "everything happens for a reason."

**Other language rules:**
- No exclamation points in story copy (website, captions, carousel text).
  Confidence doesn't need to shout.
- No emoji in story copy or thumbnails. Captions may use exactly one, if
  it's doing real work — never as decoration or a sentence-ending flourish.
- Every Reelspiration line (beat 5) is a specific claim about *this*
  story, not a swappable platitude — if the line could be pasted onto a
  different story unchanged, it's not specific enough yet. This is the
  actual editorial bar, more than any style rule.

## How every website page should feel

The site should feel like an archive you can trust, not a feed you
scroll past. Concretely: generous whitespace, no autoplay, no infinite
scroll tricks, hairline dividers instead of card shadows, and every page
ends the same way a Reel does — a clear next action (related story,
challenge collection, or the email signup), never a dead end.

## Reference implementation

`/brand` on the live site is this document made visible — real color
swatches, real type specimens, a real thumbnail mock, and a real
end-card mock, all built from the actual production CSS tokens rather
than a mockup that could drift from the code. Treat it as the source of
truth for anyone producing content who wasn't in this conversation.
