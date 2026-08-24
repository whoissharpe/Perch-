# Roadmap

Sequenced so the falsifiable test happens before the expensive work. Read
[`STRATEGY.md`](STRATEGY.md) first — the kill criterion gates everything below.

## Phase 0 — Foundations ✅

- [x] Workspace: `apps/mobile`, `apps/web`, `packages/core`
- [x] Brand: mark, palette, type, icon pipeline
- [x] Schema: spots / marks / saves / follows, PostGIS, RLS, counter triggers
- [x] Expo app shell: map, feed, saved, profile, capture, spot detail
- [x] Marketing site with a browsable web map

## Phase 1 — Make it real (week 1–2)

- [ ] Supabase project; `npm run db:push`
- [ ] `npm run seed:osm` for one bounding box, and record the real coverage
      numbers — this settles empirically how much OSM actually has
- [ ] Magic-link auth and handle claiming
- [ ] **Wire the capture flow end to end**: upload to the `marks` bucket,
      insert spot if new, insert mark. This is the one path that must not have
      a rough edge
- [ ] Swap the sample data in `apps/mobile/src/sample.ts` for live queries
- [ ] Offline capture queue — take the photo with no signal, upload on return.
      Non-negotiable for the hiking half

## Phase 2 — The test (day 15–45)

- [ ] TestFlight and Play internal testing, one city only
- [ ] Run distribution alongside it — a local account posting the best finds.
      The test is invalid in a vacuum
- [ ] Instrument: marks per user, D7/D30 return rate, marks from non-friends,
      follow graph density
- [ ] **Decision point.** 30 marks from 15 strangers in 30 days, or stop

## Phase 3 — Only if Phase 2 passes

- [ ] Moderation: report flow, takedown queue, EXIF stripping on upload.
      Currently the largest unbuilt piece, and it becomes urgent the moment
      strangers can post video
- [ ] Comments and mentions
- [ ] Collections — sequences worth walking
- [ ] Elevation and sun position per spot

## Phase 4 — Pro (week 8–14)

- [ ] Offline region packs
- [ ] Rest routing: never more than *N* metres between places to sit
- [ ] Shade forecasting by time of day
- [ ] Stripe, €3.50/month or €29/year, 30-day trial

## Later, and only on their terms

- [ ] Memorial dedications, with a parks department as partner and legal review
      first. See `STRATEGY.md` — this is a legal question, not a scheduling one
- [ ] Municipal rest-point inventories and shade gap analysis
- [ ] A rest-aware routing API
