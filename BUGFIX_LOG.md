# Bug fix log

## 2026-08-06 — Content bleeding between story fields (found live in production)

**What happened:** After deploying to Render, I spot-checked the live site
and found Kobe Bryant's and Ernest Shackleton's story pages had run-on
text — content meant for "The Reelspiration," "The Principle," and "Your
Next Step" was bleeding together into a single garbled block, and in
Shackleton's case leaking into the main story paragraph too.

**Root cause:** `scripts/parse-volumes.mjs`'s section-boundary detection
(the logic that decides where one field's text ends and the next
begins) only recognized `#`-style markdown headings or standalone
bold-all-caps lines as stop points. Several volumes — Volume 10
prominently, but not only Volume 10 — format their section labels as
grid-table cells that wrap across lines with leading whitespace and
trailing line-continuation backslashes (e.g. `  **THE REELSPIRATION\`
on its own line, with the actual content following on the next line).
That format never matched the stop-detection regex, so extraction kept
reading forward into the next field's content, then the next, until it
happened to hit a boundary the old regex did recognize.

The start-detection side of the same function was already tolerant of
this formatting (via `stripMd()`), which is why the *first* field in a
run usually looked fine and the bleed only became visible a field or two
later — a good reminder that asymmetric validation (permissive going in,
strict coming out) is its own bug pattern.

**Fix:** Replaced the ad-hoc regex stop-check with a shared list of
known section-label strings (`KNOWN_HEADINGS`) and a stop condition that
compares the stripped, lowercased line against that list — the same
normalization already used for start-detection. This makes stop
detection format-agnostic: it no longer matters whether the source uses
`#` headings, bold-all-caps lines, or wrapped table cells.

**Verification before re-deploying:**
1. Re-ran the parser and story-builder across all 110 stories.
2. Wrote a corpus-wide scan checking every core field (`canonicalStory`,
   `reelspiration`, `principle`, `nextStep`, `whyItMatters`, `decision`)
   for the presence of another field's label text — the actual signature
   of this bug. Found 9 flagged instances, manually inspected each one:
   all 9 were the literal phrase "the decision" appearing naturally in
   prose (e.g. "before pride makes the decision for you"), not parser
   bleed. Zero real bleed remaining.
3. Rebuilt locally and curl-checked the previously-broken pages
   (Kobe Bryant, Ernest Shackleton) directly against the rendered HTML,
   not just the parsed JSON, to confirm the fix holds through the full
   pipeline into what actually ships to the browser.
4. Only then committed and let Render's auto-deploy pick it up.

**Lesson for next time:** "Spot-check a few stories" isn't the same as
"scan the corpus for the specific failure signature." The first pass at
QA on this import checked that fields were *present* and *non-empty* —
it didn't check that they were *correctly bounded*. Both matter, and
they can pass or fail independently of each other.
