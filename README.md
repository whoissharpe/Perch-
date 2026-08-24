<div align="center">

# Perch

**Every good place to sit down.**

A map of the world's benches — the ones with the view, the shade and the quiet.
Seeded from open data, finished by the people who actually sat there.

</div>

---

## What this is

Not a social network about benches. A map of where a person can actually stop,
with the attributes that decide whether a bench is worth walking to: a backrest,
shade at two in the afternoon, a step-free approach, and something worth looking
at.

The bench-hunting community fills the map. **Rest routing** — planning a walk so
you never go further than you can manage between places to sit — is the part
people pay for.

Read [`docs/STRATEGY.md`](docs/STRATEGY.md) before adding a feature. It contains
a pre-committed kill criterion, and the reasoning for everything deliberately
left out.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 18, TypeScript |
| Data | Supabase — Postgres + PostGIS, auth, storage |
| Map | MapLibre GL with open vector tiles |
| Styling | Hand-written CSS with design tokens. No utility framework |
| Seed | OpenStreetMap via the Overpass API |

Styling is deliberately plain CSS: the design system in
[`app/globals.css`](app/globals.css) is the source of truth for both the app and
the standalone page in `design/`, and neither needs a build step to render.

## Getting started

```bash
npm install
cp .env.example .env.local
```

Create a Supabase project, then paste its URL and keys into `.env.local`.

Apply the schema — PostGIS, RLS policies, the rolling-average trigger and the
`benches_nearby` lookup all live in one migration:

```bash
supabase db push
```

Seed one city. **One.** Seeding the world is the mistake that makes every city
equally empty:

```bash
npm run seed:osm
```

Then:

```bash
npm run dev
```

The landing page is at `/`, the map at `/map`.

## Layout

```
app/
  globals.css        design system — tokens, bezels, motion
  page.tsx           landing page
  map/               the one screen
components/
  landing/           nav, footer, scroll reveal
  map/               MapLibre canvas + bench sheet
lib/
  types.ts           Bench, Sit, the three axes
  supabase/          browser and server clients
supabase/
  migrations/        schema, RLS, PostGIS lookup
scripts/
  seed-osm.ts        Overpass -> Postgres, idempotent on osm_id
docs/
  STRATEGY.md        the bet, the kill criterion, what is deferred and why
  ROADMAP.md         phased so the cheap test happens before the costly build
  BRAND.md           palette, type, motion, voice
design/
  preview.html       standalone landing page, no build required
```

## The three axes

Five stars tell you nothing about a bench. Perch rates three things, because
three things decide whether it is worth the walk:

**View** · **Shade** · **Comfort**

Plus the attributes open data almost never carries: backrest, armrests,
step-free approach, shaded at 2pm, water nearby, quiet.

## Before you add a feature

The v1 scope excludes feeds, follows, comments, leaderboards, native apps, and
every city but one. Each exclusion has a reason written down in
`docs/STRATEGY.md`. If you are adding one of them back, the retention data
should be the argument — not the roadmap.

## Attribution

Bench data © [OpenStreetMap](https://www.openstreetmap.org/copyright)
contributors, licensed under **ODbL**. Attribution is a licence condition, not a
courtesy: it must stay visible in the product and in any derived dataset.

## Licence

MIT — see [LICENSE](LICENSE). Note that the MIT licence covers this source code
only; the seeded bench data remains under ODbL.
