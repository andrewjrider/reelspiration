# Reelspiration

Real Stories. Real Proof. Real Reelspiration.

This is a working Next.js build of the site described in
`Reelspiration_Business_Vision_and_Launch_Plan`, mapped directly onto that
document's own Phase 1 MVP checklist. It's a real, deployable app — not a
mockup — backed by the approved 110-record imported library. Public access
and verification state are derived independently so source-link review does
not hide a structurally complete story (see `CONTENT_IMPORT.md`).

## What's actually built (Phase 1, from the brief)

| Brief's Phase 1 checklist item | Status |
|---|---|
| Structured content files for story records | Done — `src/data/types.ts` + `stories.ts` |
| Core data model (people, stories, challenges, collections, sources...) | Done — `StoryRecord` type covers all fields the brief lists |
| Homepage, story page, challenge page, collection page | Done — all live |
| "What are you facing today?" entry point | Done — homepage signature element |
| Search | Not built — see "Not built yet" below |
| Email signup | Accessible form and server endpoint built; provider configuration required (see below) |
| Analytics | Not built |
| Editorial admin area | Not built — CLI tools stand in for now (see below) |
| Load 50+ stories before launch | Done — all 110 structurally complete imported records are public with honest verification states |

## What's built beyond Phase 1's literal checklist

Two things the brief describes narratively but doesn't spec as MVP items —
I built them now because they're the connective tissue between "we have
100 story packages" and "we have a media business":

1. **`scripts/import-stories.mjs`** — takes a raw JSON export of a volume
   (in whatever field names it actually uses) and converts it into
   validated story records, flagging missing fields, unrecognized tags,
   and missing sources before anything can be marked `published`. Tested
   against a sample file with aliased field names and a deliberately
   broken record — see `CONTENT_IMPORT.md` for how to run it against your
   real volumes.

2. **`scripts/export-social.ts`** — takes one published story and
   generates the full deliverable set from the brief's "Master story
   deliverables" list: Reel script (with a live word-count-to-seconds
   check so you know if it's over 60s before you shoot it), extended cut,
   7-slide carousel, LinkedIn adaptation, caption, hashtags, alt text, SEO
   title/meta, a shot-list recommendation from the brief's 5 visual
   templates, and the pre-publish checklist. Run:
   ```
   npm run export:social -- shackleton-endurance
   ```
   Output lands in `exports/shackleton-endurance/package.md`. This is the
   text/creative-brief layer of your content engine — it does not render
   video (nothing can, from text alone; see "Not built yet").

3. **`scripts/export-social-batch.ts`** — the same logic, run against
   every published story at once instead of one at a time, so a
   production day starts with a full batch instead of running the
   single-story command repeatedly:
   ```
   npm run export:social:batch
   npm run export:social:batch -- --collection greatest-comebacks
   npm run export:social:batch -- --challenge need-courage
   npm run export:social:batch -- --slugs kobe-bryant,apollo-13
   ```
   Output lands in `exports/<YYYY-MM-DD>/`, one folder per story plus an
   `INDEX.md` summarizing pacing flags and authored-vs-generated content
   — the thing to skim before opening any individual package.

## Design direction

Deliberately not the generic AI-website look (cream background, serif
headline, terracotta accent). This uses a documentary-archive direction —
deep ink background, warm paper text, a single brass accent standing in
for "verified proof" — because the brief's actual differentiator is trust
and recognizability, not warmth-as-decoration. Newsreader (serif) for
editorial voice, Archivo (grotesk) for structural/stamp-like labels.

## Running it locally

```
npm install
npm run dev
```
Visit http://localhost:3000

## Deploying to Render (reelspiration.com)

1. Push this project to a GitHub repo.
2. In Render: **New → Blueprint**, point it at the repo. `render.yaml` at
   the project root configures the service automatically (Node web
   service, `npm install && npm run build`, `npm run start`).
3. Once deployed, Render gives you a `.onrender.com` URL and instructions
   for adding a custom domain.
4. In GoDaddy, point `reelspiration.com`'s DNS at Render:
   - Add a CNAME record for `www` pointing to the `.onrender.com` address
     Render gives you.
   - For the root domain (`reelspiration.com` with no `www`), Render's
     custom domain instructions will give you the correct A record or
     ALIAS/ANAME setup — GoDaddy supports the A-record path.
   - Add the custom domain in Render's dashboard under the service's
     Settings → Custom Domains; Render issues the SSL certificate
     automatically once DNS resolves.
5. This step requires clicking into your actual GoDaddy and Render
   dashboards — I can't do that from here, but the config on this end is
   already deploy-ready with zero changes needed.

## Not built yet — named honestly, with what I'd recommend

- **Database.** Phase 1 allows structured files OR Postgres; I chose
  files for now. Migration path is a straight export once you're past
  ~150-200 stories or need the submission system (Phase 4). Supabase is
  the natural next step — free tier, native Postgres, works well with
  Next.js and Render.
- **Editorial admin UI.** Right now editing is git-commit-based (open
  `imported-stories.ts`, change `status`, commit). Fine at 100-story
  scale with one or two editors. Once you have outside studios/editors
  touching content, build a real admin — Next.js + Supabase Auth is the
  lightest path, or a headless CMS (Sanity or Payload) if you want a
  proper editorial UI without building one from scratch.
- **Video rendering.** No text-based tool can shoot or animate a Reel
  from a script. Two real paths: (a) human editor works from
  `export:social`'s package.md in Premiere/CapCut, or (b) an AI
  video-generation tool (Runway, HeyGen for narrated portrait-style
  clips, or Creatomate/Remotion for programmatic template-based video —
  Remotion in particular would let you turn the "5 visual templates"
  into literal code templates that auto-populate from each story record,
  which is probably worth building once you have 10-20 stories through
  the pipeline and know which template actually performs).
- **Email delivery provider.** The signup form validates input, exposes
  accessible success/error states, and posts through `/api/newsletter`.
  Production capture remains disabled until `NEWSLETTER_SIGNUP_URL` is
  configured with an HTTPS endpoint that accepts
  `{ "email": "...", "source": "reelspiration.com" }`. An optional bearer
  token can be supplied with `NEWSLETTER_API_KEY`; see `.env.example`.
- **Search.** Punting deliberately — with ~100 stories, category/
  challenge browsing covers most of what search would do. Worth building
  once the library is large enough that browsing stops being sufficient.
- **Analytics.** Recommend Plausible or Vercel Analytics (privacy-
  respecting, simple) over Google Analytics given the brand's trust
  positioning — a few lines to wire in once you pick one.

## Project structure

```
src/
  app/                    Pages (Next.js App Router)
    page.tsx              Homepage
    stories/[slug]/       Canonical story pages
    challenges/[slug]/    "What are you facing" pages
    collections/[slug]/   Themed collection pages
  components/             Shared UI (header, footer, challenge picker, story card)
  data/
    types.ts              The StoryRecord schema — the actual data moat
    stories.ts             Seed stories + merge logic with imports
    imported-stories.ts    Generated by the import script (empty until you run it)
    challenges.ts          Audience-moment taxonomy
    collections.ts         Collection taxonomy
scripts/
  import-stories.mjs      Volume -> validated story records
  export-social.ts        Published story -> full social content package
data-incoming/             Drop raw volume exports here
exports/                    Generated social packages land here
render.yaml                 Render deployment blueprint
CONTENT_IMPORT.md           How to bring in the 10 volumes, step by step
```
