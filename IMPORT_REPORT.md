# Import Report — 10 Volumes + Military Commanders Companion

## Current public-library activation

All 110 structurally complete records are now public without rewriting the
generated data in `src/data/imported-stories.ts`. The original imported
`published` / `needs-review` values documented below are retained as an import
snapshot; `src/data/stories.ts` now separates public availability from
verification state at runtime.

Public records display one of `Verified Record`, `Source Review in Progress`,
or `Editorial Review in Progress`. Missing source URLs do not hide an otherwise
complete story, and no record is labeled verified without complete linked
sources and explicit verification metadata.

## Original import snapshot

- 11 files uploaded, 10 parsed as volumes (1 skipped, see below)
- **110 stories** parsed with 0 missing core fields, 0 slug collisions
- **13 published** (curated launch set, one strong recognizable name per
  volume) — live on the site now
- **97 needs-review** — parsed, validated, have a working preview URL at
  `/stories/{slug}`, but not on public pages until an editor approves them

Nothing was auto-published beyond the curated 13. Every other record
needs a human to open it, read it, and change `status` to `"published"`
in `src/data/imported-stories.ts`.

## What "needs-review" actually means here

The parser and validator confirm a record is *structurally* complete —
every required field has real text in it. They cannot confirm the facts
are right, the sources are sufficient, or the tone matches your bar. That
judgment is exactly the "editorial pass" your own brief specifies before
anything publishes, and I didn't shortcut it. Open any `/stories/{slug}`
URL to preview a needs-review story — it renders identically to a
published page except for a banner at the top.

## The 13 published now

Kobe Bryant, Colonel Harland Sanders, Sara Blakely, Wilma Rudolph, Marie
Curie, Abraham Lincoln, Ernest Shackleton, George Washington, Audie
Murphy, Amy Purdy, Tiger Woods, Apollo 13, Henry Ford — one per volume,
chosen for name recognition per your own Recognition/Story
Strength/Relatability/Ripple filter. This is a judgment call I made to
give the site something real to browse; swap any of these out freely.

## Issues found — need your decision, not just my fix

**1. Volume 7 has two versions with a real conflict.**
`Reelspiration_Volume_7_..._Planning_Manuscript.docx` uses the same
RS-C001–C010 IDs as the finished `Reelspiration_Volume_7_...Comebacks.docx`,
but for a completely different set of subjects:

| ID | Planning manuscript | Finished volume |
|---|---|---|
| RS-C001 | Michael Jordan | Tiger Woods |
| RS-C002 | Steve Jobs | Robert Downey Jr. |
| RS-C003 | Walt Disney | George Foreman |
| RS-C004 | Bethany Hamilton | Tina Turner |
| ...| (6 more) | (6 more) |

I imported the finished manuscript and skipped the planning doc entirely
— it reads like an earlier draft that got replaced. But I'm flagging it
rather than assuming: if the planning-doc subjects were meant to become
an *additional* volume rather than a discarded draft, say so and I'll
parse it as Volume 11.

**2. Volume 3 and Volume 6 both use the "RS-S" ID prefix.**
Volume 3 (Inventors/Scientists) and Volume 6 (Survival/Recovery) each
independently number their stories RS-S001 through RS-S010 — presumably
S for "Science" and S for "Survival" respectively. This doesn't break
anything on the site (slugs are derived from subject names, not source
IDs), but it will cause confusion in any spreadsheet or reference that
uses the RS-code as a key. Worth a renumbering pass on your end — maybe
RS-SC for Volume 3 and RS-SV for Volume 6.

**3. Challenge-tag assignment is a keyword heuristic, not an editorial
read.** Every story's "what are you facing" tags were assigned by
matching keywords in the audience-moment text against the site's 6
challenge slugs. Distribution came out reasonable (recovering: 35,
leadership: 26, starting-over: 24, courage: 20, too-old: 14, rejected: 4)
but "rejected" is thin and some individual assignments are worth a second
look — Serena Williams landed in "starting-over," for instance, which is
defensible but not the only reasonable read. Spot-check before treating
these as final.

**4. Two authored Reel scripts run slightly over the 60-second target —
correcting an earlier version of this note.** This report originally
flagged widespread pacing problems (scripts running 400+ words) based on
a check done before the parser bugfix — that finding was itself a
symptom of the same field-boundary bug (bled content inflating word
counts), not a real property of your manuscripts. See BUGFIX_LOG.md.
After the fix, a corpus-wide check across all 110 stories shows only 2
genuinely over the 60s target: Doolittle Raid (63s) and Apollo 13 (62s).
Trivial trims, not a pattern. `npm run export:social:batch` flags these
automatically in its summary index going forward.

## What got carried over per story (when present in the source)

Canonical narrative, decision beat, Why This Changed History / Why This
Matters, THE REELSPIRATION, THE PRINCIPLE, YOUR NEXT STEP, the authored
60-second Reel voiceover, the 7-slide carousel, the LinkedIn adaptation
(only ~30 stories had this section authored — the rest fall back to
`export:social`'s generated version), visual storyboard direction,
editorial guardrails, starting sources, the audience-moment phrasing, and
the REELSPIRATION PATTERN tag line.

## Retired

The 4 hand-written placeholder stories from the original MVP (Sanders,
Blakely, Hamilton, Shackleton) are removed — your real volumes have
richer, sourced versions of all 4.

## How to publish a story

Open `src/data/imported-stories.ts`, find the record by `slug`, change
`"status": "needs-review"` to `"status": "published"`. Rebuild. That's
the whole workflow until Phase 1's editorial admin UI exists (see
README.md's "Not built yet" section — still the biggest real gap here).
