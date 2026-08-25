import type { SampleMark } from "@/sample";

/**
 * Perch Picks - real places, verified, and deliberately obscure.
 *
 * Every entry below is somewhere that actually exists. Coordinates come from
 * the place's Wikipedia record (which is checkable against the `source` link
 * on each one), and the photographs are freely licensed images from Wikimedia
 * Commons, credited per the licence.
 *
 * An earlier version of this file invented six spots and scattered them by
 * bearing around the user so they would always be walkable. That was the wrong
 * trade: a pick you cannot actually go and sit on is worse than no pick, and a
 * fabricated photo of a bench that does not exist is a lie the map tells on
 * the team's behalf. Real places have fixed coordinates, so the picks are now
 * sorted by true distance instead - which means most users will see somewhere
 * far away. That is the honest version, and it is also the more interesting
 * one: these are here to show what a spot worth marking looks like, not to
 * pretend the team has been to the end of your street.
 *
 * Every photograph here has been opened and looked at: a bench, or built-in
 * seating, is visible in the frame. That rule cost this list more than half its
 * entries. Fort Caroline, Kingsley Plantation, the Ribault Club, Fort Clinch,
 * the Jacksonville Beach pier, Buckden Pike, Cadair Idris, the Singing Ringing
 * Tree, Stegastein and Gaularfjellet were all dropped, not because they are bad
 * places but because no freely licensed photograph of them shows anywhere to
 * sit. A bench app whose pictures have no bench in them is advertising
 * something it is not.
 *
 * They are also chosen to be unfamiliar. An earlier pass filled this list with
 * Corcovado, Victoria Peak, Griffith Observatory - real, but places everybody
 * has already seen a thousand photographs of, which teaches a new user nothing
 * about what this app is for. A bench a neighbour dragged onto a Galician
 * cliff, a set of marble steps the Adriatic plays like an organ, a memorial
 * with a bronze fox on it - those are the ones that make somebody think there
 * might be something like that near them.
 *
 * Notes are descriptive rather than first-person, because nobody on the team
 * has necessarily sat on all of them. Where a note makes a factual claim, the
 * source link backs it up.
 */

export interface Pick {
  name: string;
  /** City and country, for a place the user has probably never been. */
  place: string;
  kind: SampleMark["kind"];
  lat: number;
  lng: number;
  note: string;
  image: string;
  /** Wikipedia record, so any claim on the card can be checked. */
  source: string;
  /** Photographer and licence. Attribution is a condition, not a courtesy. */
  credit: string;
}

export const PICKS: Pick[] = [
  {
    name: "Treaty Oak",
    place: "Jacksonville, Florida",
    kind: "bench",
    lat: 30.317,
    lng: -81.6581,
    note: "Benches ring a live oak roughly 250 years old whose limbs rest on the ground. In the 1930s a Times-Union reporter invented a story that a treaty had been signed under it, purely to stop developers felling it. The lie worked and the name stuck.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Treaty_Oak.JPG",
    source: "https://en.wikipedia.org/wiki/Treaty_Oak_(Jacksonville)",
    credit: "3bCat · Public domain",
  },
  {
    name: "Southbank Riverwalk",
    place: "Jacksonville, Florida",
    kind: "bench",
    lat: 30.316793,
    lng: -81.647224,
    note: "A mile and a half of boardwalk along the south bank of the St. Johns, benched most of the way, facing the downtown bridges.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Southbank_Riverwalk_2_%28Jacksonville%2C_Florida%29.jpg",
    source: "https://en.wikipedia.org/wiki/Jacksonville,_Florida",
    credit: "PicoOrdinalo · CC BY-SA 4.0",
  },
  {
    name: "Memorial Park",
    place: "Riverside, Jacksonville",
    kind: "bench",
    lat: 30.310644,
    lng: -81.679431,
    note: "Live oaks, a stone balustrade and the St. Johns going past. Laid out in 1924 for Florida's dead of the First World War, around the winged figure of Charles Adrian Pillars's “Life”.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/54/MemParkJaxShade.jpg",
    source: "https://en.wikipedia.org/wiki/Memorial_Park_(Jacksonville)",
    credit: "Mgreason · CC BY-SA 3.0",
  },
  {
    name: "Banco de Loiba",
    place: "Loiba, Galicia, Spain",
    kind: "bench",
    lat: 43.744324,
    lng: -7.752312,
    note: "A plain wooden bench a neighbour put on the cliff in 2009. A band passing through the Ortigueira festival carved “the best bench in the world” into the back, and the name stuck hard enough that the council trademarked it.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Banco_en_Loiba_19X2013.jpg",
    source: "https://www.openstreetmap.org/?mlat=43.744324&mlon=-7.752312#map=18/43.744324/-7.752312",
    credit: "Iago Casabiell González · CC BY-SA 4.0",
  },
  {
    name: "Sea organ",
    place: "Zadar, Croatia",
    kind: "bench",
    lat: 44.117042,
    lng: 15.219999,
    note: "Marble steps down to the Adriatic with pipes underneath. Sitting on them is the only way to hear it — the waves play the thing.",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Zadar-Sea-Organ.jpg",
    source: "https://en.wikipedia.org/wiki/Sea_organ",
    credit: "Ben Snooks · CC BY-SA 2.0",
  },
  {
    name: "Promenade de la Treille",
    place: "Geneva, Switzerland",
    kind: "bench",
    lat: 46.200563,
    lng: 6.1463,
    note: "126 metres of wooden bench along the old city wall, built in 1767. Long thought to be the longest bench in the world, and still just a bench people eat lunch on.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/20251103-Promenade_de_la_Treille-1.jpg",
    source: "https://en.wikipedia.org/wiki/Promenade_de_la_Treille",
    credit: "MHM55 · CC BY-SA 4.0",
  },
  {
    name: "Wave Organ",
    place: "San Francisco, USA",
    kind: "bench",
    lat: 37.808487,
    lng: -122.44021,
    note: "A listening post on a jetty with seats cut from stone salvaged from a demolished cemetery. Best at high tide.",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/San_Francisco_Wave_Organ.jpg",
    source: "https://en.wikipedia.org/wiki/Wave_Organ",
    credit: "Frank Schulenburg · CC BY-SA 4.0",
  },
  {
    name: "Ławeczka Mikołaja Kopernika",
    place: "Olsztyn, Poland",
    kind: "bench",
    lat: 53.77723,
    lng: 20.475392,
    note: "A granite bench with Copernicus already sitting on one end, outside the castle where he ran the administration and did some of his observing. Room for you on the other end.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Kopernik_w_Olsztynie.jpg",
    source: "https://pl.wikipedia.org/wiki/Ławeczka_Mikołaja_Kopernika_w_Olsztynie",
    credit: "Chez Eskay from Karlsruhe, Germany · CC BY 2.0",
  },
  {
    name: "Panchina Gigante",
    place: "Calliano Monferrato, Italy",
    kind: "bench",
    lat: 44.991074,
    lng: 8.280667,
    note: "One of hundreds of oversized benches scattered across the hills of Piedmont. You climb up onto it, and the point is to feel briefly small.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Panchina_gigante_Calliano_Monferrato.jpg",
    source: "https://en.wikipedia.org/wiki/Big_Bench_Community_Project",
    credit: "Andrea Musuruane · CC BY-SA 4.0",
  },
  {
    name: "Mrs Macquarie's Chair",
    place: "Sydney, Australia",
    kind: "bench",
    lat: -33.859706,
    lng: 151.222565,
    note: "A bench cut into the sandstone by convicts in 1810 for a governor's wife who liked to sit and watch for ships from home.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Mrs_Macquarie%27s_Chair_2013.jpg",
    source: "https://en.wikipedia.org/wiki/Mrs_Macquarie%27s_Chair",
    credit: "Mitch Ames · CC BY-SA 3.0",
  },
  {
    name: "Steinerne Bank",
    place: "Munich, Germany",
    kind: "bench",
    lat: 48.150417,
    lng: 11.592641,
    note: "A stone half-circle in the Englischer Garten, put there in 1838 and easy to walk past for years without sitting on.",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/20230304_Stone_bench_Englischer_Garten_Munich_01.jpg",
    source: "https://de.wikipedia.org/wiki/Steinerne_Bank",
    credit: "Flocci Nivis · CC BY 4.0",
  },
];

/** Great-circle distance in metres. */
export function distance(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
) {
  const R = 6_371_000;
  const p = Math.PI / 180;
  const dLat = (bLat - aLat) * p;
  const dLng = (bLng - aLng) * p;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * p) * Math.cos(bLat * p) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * The picks, nearest first. Distances are real, so the top one may still be a
 * flight away - the strip says so rather than hiding it.
 */
export function curatedNear(lat: number, lng: number): SampleMark[] {
  return PICKS.map((p, i) => ({
    id: `perch-${i + 1}`,
    name: p.name,
    kind: p.kind,
    lat: p.lat,
    lng: p.lng,
    image: p.image,
    who: "perch",
    caption: p.note,
    saves: 0,
    isVideo: false,
    // Picks always read as marked so they draw as a full bird rather than a
    // hollow ring - the team's spots should not be the quietest thing on the
    // map.
    marks: 1,
    curated: true,
    note: p.place,
    metresAway: Math.round(distance(lat, lng, p.lat, p.lng)),
    source: p.source,
    credit: p.credit,
  })).sort((a, b) => (a.metresAway ?? 0) - (b.metresAway ?? 0));
}

/** A pick by id. Ids are stable, so this needs no centre. */
export function curatedById(id: string): SampleMark | undefined {
  return curatedNear(0, 0).find((m) => m.id === id);
}
