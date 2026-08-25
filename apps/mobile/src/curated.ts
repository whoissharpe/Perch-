import type { SampleMark } from "@/sample";

/**
 * Perch Picks - real places, verified.
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
    name: "Calton Hill",
    place: "Edinburgh, Scotland",
    kind: "viewpoint",
    lat: 55.955278,
    lng: -3.182222,
    note: "Benches ring the summit beside the National Monument, looking over Princes Street to the Firth of Forth.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Edinburgh_Calton_Hill.jpg",
    source: "https://en.wikipedia.org/wiki/Calton_Hill",
    credit: "Saffron Blaze · CC BY 3.0",
  },
  {
    name: "Parc de Belleville",
    place: "Paris, France",
    kind: "viewpoint",
    lat: 48.870833,
    lng: 2.384722,
    note: "The terrace at the top of the park is one of the highest public viewpoints in the city.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Parc_Belleville_-_Paris_XX_%28FR75%29_-_2021-06-10_-_2.jpg",
    source: "https://en.wikipedia.org/wiki/Parc_de_Belleville",
    credit: "Chabe01 · CC BY-SA 4.0",
  },
  {
    name: "Fløyen",
    place: "Bergen, Norway",
    kind: "viewpoint",
    lat: 60.39835,
    lng: 5.34541,
    note: "320 m above the harbour, reached by the funicular or a walk up from the fish market.",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Fl%C3%B8yen_fjerde_sundagen_i_advent.jpg",
    source: "https://en.wikipedia.org/wiki/Fl%C3%B8yen",
    credit: "Christoffer Hjeltnes Støle · CC BY-SA 4.0",
  },
  {
    name: "Victoria Peak",
    place: "Hong Kong",
    kind: "viewpoint",
    lat: 22.275556,
    lng: 114.143889,
    note: "Lugard Road runs level around the peak, with benches facing the harbour most of the way.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7d/High_West_and_Victoria_Peak_from_Victoria_Gap_%28crop1%29.jpg",
    source: "https://en.wikipedia.org/wiki/Victoria_Peak",
    credit: "Daniel Case · CC BY-SA 3.0",
  },
  {
    name: "Mrs Macquarie's Chair",
    place: "Sydney, Australia",
    kind: "bench",
    lat: -33.859467,
    lng: 151.222203,
    note: "An actual bench: sandstone, cut into the rock by convicts in 1810 for Elizabeth Macquarie.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Mrs_Macquarie%27s_Chair_2013.jpg",
    source: "https://en.wikipedia.org/wiki/Mrs_Macquarie%27s_Chair",
    credit: "Mitch Ames · CC BY-SA 3.0",
  },
  {
    name: "Signal Hill",
    place: "Cape Town, South Africa",
    kind: "viewpoint",
    lat: -33.917778,
    lng: 18.402778,
    note: "The standard place to watch the sun go down over the Atlantic, above the noon gun.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Lions_Head_%26_Signal_Hill_wza.jpg",
    source: "https://en.wikipedia.org/wiki/Signal_Hill_(Cape_Town)",
    credit: "Winstonza · CC BY-SA 3.0",
  },
  {
    name: "Twin Peaks",
    place: "San Francisco, USA",
    kind: "viewpoint",
    lat: 37.751586,
    lng: -122.447722,
    note: "Two hills near the geographic centre of the city, looking straight down Market Street.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Twin_Peaks_2022_Aerial.png",
    source: "https://en.wikipedia.org/wiki/Twin_Peaks_(San_Francisco)",
    credit: "InvadingInvader · CC BY-SA 4.0",
  },
  {
    name: "Bethesda Terrace and Fountain",
    place: "New York, USA",
    kind: "bench",
    lat: 40.774123,
    lng: -73.971135,
    note: "The terrace benches face the lake across the Angel of the Waters, under the tiled arcade.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Bethesda_Terrace_and_Fountain%2C_Central_Park%2C_2025.jpg",
    source: "https://en.wikipedia.org/wiki/Bethesda_Terrace_and_Fountain",
    credit: "Julian Lupyan · CC0",
  },
  {
    name: "Trolltunga",
    place: "Odda, Norway",
    kind: "trail_rest",
    lat: 60.13318,
    lng: 6.75472,
    note: "A rock shelf 700 m above Ringedalsvatnet. A serious walk in — ten to twelve hours there and back.",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Trolltunga_2017.jpg",
    source: "https://en.wikipedia.org/wiki/Trolltunga",
    credit: "kallerna · CC BY-SA 3.0",
  },
  {
    name: "Lake Louise",
    place: "Banff, Canada",
    kind: "viewpoint",
    lat: 51.411667,
    lng: -116.228056,
    note: "Benches along the lakeshore path face Victoria Glacier across the water.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/1_lake_louise_pano_2019.jpg",
    source: "https://en.wikipedia.org/wiki/Lake_Louise_(Alberta)",
    credit: "Chensiyuan · CC BY-SA 4.0",
  },
  {
    name: "Griffith Observatory",
    place: "Los Angeles, USA",
    kind: "viewpoint",
    lat: 34.118333,
    lng: -118.300333,
    note: "The lawns and terrace walls look over the whole basin, with the Hollywood sign to the west.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Griffith_observatory_2006.jpg",
    source: "https://en.wikipedia.org/wiki/Griffith_Observatory",
    credit: "Matthew Field · CC BY 2.5",
  },
  {
    name: "Mount Royal",
    place: "Montreal, Canada",
    kind: "viewpoint",
    lat: 45.506389,
    lng: -73.588889,
    note: "The Kondiaronk Belvedere overlooks downtown from the mountain the city is named after.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Le_Plateau-Mont-Royal_-_Mont-Royal.jpg",
    source: "https://en.wikipedia.org/wiki/Mount_Royal",
    credit: "Chicoutimi · Public domain",
  },
  {
    name: "Mount Takao",
    place: "Tokyo, Japan",
    kind: "trail_rest",
    lat: 35.625278,
    lng: 139.243611,
    note: "An hour from Shinjuku. Rest stops the whole way up, and Fuji on a clear winter day.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Mount_Takao_20051023.jpg",
    source: "https://en.wikipedia.org/wiki/Mount_Takao",
    credit: "Ans~jawiki at Japanese Wikipedia · CC BY-SA 3.0",
  },
  {
    name: "Corcovado",
    place: "Rio de Janeiro, Brazil",
    kind: "viewpoint",
    lat: -22.952417,
    lng: -43.211667,
    note: "The mountain under the statue, looking over Guanabara Bay and the Tijuca forest.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/PanoramaRio_%28cropped%29.jpg",
    source: "https://en.wikipedia.org/wiki/Corcovado",
    credit: "beckstei · CC BY 3.0",
  },
  {
    name: "Gellért Hill",
    place: "Budapest, Hungary",
    kind: "viewpoint",
    lat: 47.486389,
    lng: 19.045833,
    note: "Steep paths up from the Danube, with benches on the terraces below the Citadella.",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Gell%C3%A9rtHillSkyline.jpg",
    source: "https://en.wikipedia.org/wiki/Gell%C3%A9rt_Hill",
    credit: "Wikimedia Commons · CC BY-SA 4.0",
  },
  {
    name: "Montjuïc",
    place: "Barcelona, Spain",
    kind: "viewpoint",
    lat: 41.364167,
    lng: 2.160833,
    note: "The hill above the port; the gardens on the seaward side look down over the container terminal.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Fale_-_Spain_-_Barcelona_-_8.jpg",
    source: "https://en.wikipedia.org/wiki/Montju%C3%AFc",
    credit: "Fabio Alessandro Locati · CC BY-SA 3.0",
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
