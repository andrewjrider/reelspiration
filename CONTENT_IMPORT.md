# Bringing in the 10 volumes

You said the real content — 10 volumes, ~100 stories, each with person /
conflict / resolution etc. — is coming next. Here's exactly what happens
when it does, so nothing here is guesswork you have to wait on me for.

## The short version

1. Export each volume as JSON (array of objects — one object per story).
   Field names don't need to match our schema exactly; see the alias list
   in `scripts/import-stories.mjs`.
2. Drop the file(s) in `data-incoming/`.
3. Run: `node scripts/import-stories.mjs data-incoming/volume-1.json`
   This is a **dry run** — it prints a validation report and changes
   nothing.
4. Fix whatever the report flags (missing fields, unrecognized challenge/
   collection tags, missing sources).
5. Re-run with `--write` to generate `src/data/imported-stories.ts`.
6. Every imported story lands as `draft` or `needs-review` — **nothing
   auto-publishes**. An editor opens `src/data/imported-stories.ts`,
   reviews each record, and flips `status` to `"published"` when it's
   ready. This preserves the brief's fact-check/approval gate instead of
   dumping raw content onto the live site.

> Current library note: the approved 110-record volume import is activated by
> `src/data/stories.ts`, which independently derives public availability and
> verification state. Do not regenerate `imported-stories.ts` merely to change
> public verification labels or restore source-review stories to the catalog.

## If your volumes use different field names

They probably will — "person" instead of "subject," "conflict" instead of
"adversity," and so on. Open `scripts/import-stories.mjs` and add your
field names to the `ALIASES` object at the top. This takes one line per
field name, no schema changes needed elsewhere. Send me (or whoever's
running the import) one full sample record from an actual volume and this
gets tuned in minutes, not hours.

## What "the 100 stories" become on the site, concretely

Every record in `src/data/imported-stories.ts` automatically:
- Gets a canonical page at `/stories/{slug}`
- Appears on every `/challenges/{slug}` page matching its tags
- Appears on every `/collections/{slug}` page matching its tags
- Is eligible to be the homepage's featured story
- Shows up in "related stories" on other pages sharing a challenge tag

No page template changes are needed as volume 2 through 10 come in — that
was the point of building the schema before the pages.

## Why nothing here uses a database yet

The brief's own Phase 1 note allows "structured content files **or**
Supabase/Postgres." JSON/TS files get you to ~100–300 stories with zero
infra cost, instant static-page generation, and full version history for
free via git. The migration path to Postgres (when you add the
submission system in Phase 4, or need runtime editing instead of a
git-commit-per-edit workflow) is a straight data export — the
`StoryRecord` type in `src/data/types.ts` becomes the table schema
directly. I'd hold off on a database until the editorial admin UI
(Phase 1's last bullet) is the actual bottleneck, not before.
