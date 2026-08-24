# Roadmap

Sequenced so the falsifiable test happens before the expensive work. Read
`STRATEGY.md` first — the kill criterion gates everything below.

## Phase 0 — Seed (days 1–2)

- [x] Repository, design system, landing page
- [ ] Supabase project; run `supabase/migrations/0001_init.sql`
- [ ] `npm run seed:osm` for one bounding box (Lisbon by default)
- [ ] Confirm the real bench count and attribute coverage for that city.
      This settles the "is OSM full or empty" question empirically.

## Phase 1 — The one screen (days 3–10)

- [ ] Magic-link auth (Supabase), minimal profile with a handle
- [ ] Map with clustered pins; solid = sat on, hollow = untouched
- [ ] Bench sheet: three-axis rating, one photo, 280-character note
- [ ] Attribute enrichment — the six tags OSM does not carry
- [ ] Add-a-missing-bench flow
- [ ] Install-to-homescreen (manifest + service worker)

Explicitly not in this phase: feed, follows, comments, leaderboards, badges.

## Phase 2 — The test (days 11–40)

- [ ] Ship to one city and nowhere else
- [ ] Run distribution alongside it — a local account posting the best seeded
      finds. The test is invalid in a vacuum.
- [ ] Instrument: sits per user, D7 and D30 return rate, photos from
      non-friends, attribute edits per session
- [ ] **Decision point.** 30 photos from 15 strangers in 30 days, or stop.

## Phase 3 — Pro, only if Phase 2 passes (weeks 7–12)

- [ ] Rest routing: never more than *N* metres between places to sit
- [ ] Offline city packs
- [ ] Shade forecasting by time of day (sun position against building heights)
- [ ] Step-free approach filtering
- [ ] Stripe Checkout, €3.50/month or €29/year

## Phase 4 — The social layer earns its way in

Only the pieces retention data actually asks for:

- [ ] Collections — sequences worth walking
- [ ] Follows and a quiet feed
- [ ] City leaderboards for attribute contributions, not for sit counts
      (rewarding the behaviour that makes the map useful, not the one that
      makes it noisy)

## Later, and only on their terms

- [ ] Memorial dedications, built with a parks department as a partner. Legal
      review before a single line of code. See `STRATEGY.md`.
- [ ] Municipal rest-point inventories and shade gap analysis
- [ ] A rest-aware routing API
