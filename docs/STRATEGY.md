# Strategy

This document exists so the reasoning survives contact with the build.

## The one-line version

Perch is a mobile app: a shared map of places worth stopping, where every spot
carries a photo or video taken by the person who found it.

## What was pressure-tested, and what changed

Before any code, the idea went through a five-advisor review. Four findings
changed the product; two were overruled deliberately. Both are recorded here,
because a decision you cannot remember making is a decision you will make badly
again.

### Findings that changed the build

**1. A bench-collection loop has no return visit.** You sit on the same three
benches and they look identical next year. Untappd works because you drink a
new beer every week. So the loop is not *collecting benches* — it is *seeing
what other people found*, which refreshes without the world changing.

**2. The pins are not a moat.** OpenStreetMap already has enormous numbers of
`amenity=bench` nodes, free under ODbL, one Overpass query away. What it does
not have is a picture, a name somebody gave it, or whether the view is any
good. **The media is the gap, not the pins.** Hence: media is required on every
mark, and seeded spots render hollow until somebody photographs them.

**3. Benches are the wrong ceiling.** Nobody on a ridge cares whether the thing
they are sitting on was installed by a council. Five kinds of spot, and hikers
are a first-class audience rather than an afterthought.

**4. Memorial dedications are legally exposed.** This was the most-recommended
monetization in review *and* the most dangerous: plaques are council property
under real contracts with real families. Selling a "claim" on a bench we do not
own is the fastest path to a takedown and a bad press cycle. Cut from the
product entirely. If it ever returns it is built *with* a parks department, on
their terms, after legal review.

### Findings overruled, deliberately

**The social layer was advised to wait.** The recommendation was to ship a map
first and let follows, feeds and profiles earn their way in on retention data.
The founder chose to build the social layer from day one, on the judgement that
the shared feed *is* the return-visit mechanism rather than a decoration on top
of one. That is a real bet and it should be watched: if people mark once and
never open the app again, this is the assumption that failed.

**"Do not build a native app yet."** The advice was a web PWA — three weeks
cheaper, no App Store review. Overruled: this is a phone-in-hand, camera-out,
standing-on-a-ridge product, and the capture flow is the whole thing.

## The kill criterion

Pre-committed. Do not renegotiate it later.

> 100 seeded spots in one city must draw **30 marks from 15 people who are not
> friends of the founder, within 30 days.**

Known weakness: 15 strangers in 30 days with zero distribution can
false-negative. Run it *with* a distribution attempt — a local account posting
the best finds — not in a vacuum.

## Monetization

**Perch Pro, €3.50/month or €29/year.** Offline maps and saved spots for a
region, rest routing, shade by time of day, trip planning. Marking stays free
forever, because marking is what makes the map worth opening.

Rejected: ads (needs scale we will not have, and poisons a product about quiet
places), municipal data licensing as a *first* revenue line (12–24 month
procurement cycles and data warranties a solo founder cannot underwrite), and
memorial dedications (see above).

## Risks carried knowingly

1. **Retention.** The social layer is doing the work the collection loop cannot.
   If the feed is thin, the app is a one-post joke. Watch D7 and D30 hardest.
2. **Cold start is now worse, not better.** A social product needs people, and
   a map needs coverage. Seeding from OSM solves the map half only.
3. **Platform absorption.** Google or OSM adds a rest-point field. Mitigation is
   the media and the social graph, neither of which is in a tagging schema.
4. **Moderation.** User photo and video from day one means a moderation surface
   from day one. Not yet built. This is the largest unbuilt piece.
5. **The social cost of the core action.** Photographing an empty bench in
   public feels odd. Framing every mark as *the view from it* rather than the
   object removes most of this — the copy does this deliberately.
6. **Founder-market fit.** Several strategic paths bend toward civic and
   accessibility sales, which is a different company. Choose deliberately
   rather than drifting.

## Attribution obligation

Base map data is © OpenStreetMap contributors, ODbL. Attribution is a licence
condition. It must remain visible in both apps and in any derived dataset.
