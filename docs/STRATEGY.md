# Strategy

This document exists so the reasoning survives contact with the build. If you
are about to add a feature, check it against the kill criterion first.

## The one-line version

Perch is a map of the world's best places to sit down. It is not a social
network about benches, and the difference is the whole strategy.

## What we are actually betting on

A bench social network fails for a reason that has nothing to do with
distribution: **benches have no return visit.** Untappd works because you drink
a new beer every week. Strava works because you run 200 times a year. You sit
on the same three benches and they look identical next year. One photogenic
post per user, then silence.

So the loop cannot be *collecting benches*. It has to be *needing the map*.

The bet is that "where can I stop" is a real, recurring question for a large
and growing group of people — anyone with bad knees, a heart condition, a late
pregnancy, or eighty-three years behind them — and that nobody is answering it.
Google Maps will not route you along a path with places to rest. Nothing will.

The hobbyist bench-hunter community is the **data collection mechanism**. Rest
routing is the **product people pay for**. Do not confuse the two.

## What the data is and is not

OpenStreetMap already contains a very large number of `amenity=bench` nodes,
free under ODbL, one Overpass query away. So the pins are not a moat — they are
a download, and `scripts/seed-osm.ts` does it in an afternoon.

What OSM almost never has is the part that decides whether a bench is worth
walking to: backrest, armrests, shade at 2pm, step-free approach, whether the
view is any good. **The attributes are the gap, not the pins.** Every sit makes
the map more valuable in a way no satellite pass can reproduce.

Coverage is also wildly uneven — heavily mapped in Germany, the UK and the
Netherlands, thin almost everywhere else. Verify before repeating either
"OSM has everything" or "OSM has nothing". One query settles it.

## The kill criterion

Pre-committed, before any code was written. Do not renegotiate it later.

> 100 OSM-seeded benches in one city must draw **30 photos from 15 people who
> are not friends of the founder, within 30 days.**

If that fails, the loop is dead and no amount of design saves it. Two weeks to
build, thirty days to learn.

Known weakness of this test: 15 strangers in 30 days with zero distribution can
false-negative. So run it *with* a distribution attempt — a local bench account
posting the seeded city's best finds — not in a vacuum.

## Scope discipline

Shipped in v1:

- The map, seeded so it is never empty
- Three-axis rating (view, shade, comfort) and a photo
- Attribute enrichment — the tags OSM lacks
- Magic-link auth

Explicitly **not** in v1, and each for a reason:

| Deferred | Why |
|---|---|
| Feed, follows, comments, leaderboards | Earn their way in on week 6, only if retention justifies them |
| Native iOS/Android | Three extra weeks and an App Store review for zero learning. The web gets camera, geolocation and install-to-homescreen today |
| Seeding more than one city | Every city equally empty is the failure mode |
| Municipal data licensing | 12–24 month procurement cycles and data warranties a solo founder cannot underwrite. A 2028 conversation |
| Memorial dedications | See below — this one is a legal question, not a scheduling one |

## Monetization

**Perch Pro, €3.50/month or €29/year.** Rest routing, offline maps, shade
forecasting, step-free filters. The people who need rest routing are the people
who will pay for it. No ads on a map about quiet places.

Rejected, deliberately:

- **Ads.** Requires scale we will not have, and poisons the product's whole tone.
- **Municipal licensing as a first revenue line.** Real budgets exist — Chief
  Heat Officers, EU Accessibility Act rest-point inventories — but they buy on
  an 18-month cycle from vendors who can warrant coverage. Have the answer
  before selling it.
- **Memorial bench dedications as the first dollar.** This was the single most
  recommended monetization in review, and it is the most legally exposed.
  Plaques are council property under real contracts with real families. Selling
  a "claim" on a bench we do not own is the fastest path to a takedown and a
  bad press cycle. Build it *with* parks departments on their terms, or not at
  all. See the `#dedications` section of the landing page — the position is
  stated publicly on purpose.

## Risks we are carrying knowingly

1. **Platform absorption.** Google or OSM adds a rest-point field and the moat
   evaporates. Mitigation: the attribute layer and the routing, not the pins.
2. **Demand-side assumption.** Everyone obsesses over collecting bench data;
   far fewer ask whether a tired person opens an app instead of looking around.
   Rest *routing* — planned before you leave the house — is the answer to this,
   which is why it is the paid feature.
3. **The social cost of the core action.** Photographing an empty bench in
   public feels odd. Framing the photo as *the view from it* rather than the
   bench itself removes most of this.
4. **Founder-market fit.** Almost every strategic path here bends toward civic
   and accessibility sales. That is a different company from a consumer app.
   Decide deliberately which one is being built rather than drifting.
5. **Street furniture advertising already exists** as a multi-billion-dollar
   industry (JCDecaux, Outfront, Clear Channel). That is simultaneously the
   incumbent, a potential buyer, and a potential acquirer. Not a v1 concern,
   but it means "benches have no commercial supply side" is false.

## Attribution obligation

Bench data is © OpenStreetMap contributors, licensed **ODbL**. Attribution is a
licence condition, not a courtesy. It must remain visible in the product and in
any derived dataset that ever leaves it.
