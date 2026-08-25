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
  // --- Jacksonville, Florida ---
  {
    name: "Treaty Oak",
    place: "Jacksonville, Florida",
    kind: "bench",
    lat: 30.317,
    lng: -81.6581,
    note: "A live oak roughly 250 years old whose lower limbs rest on the ground and are sat on constantly. In the 1930s a Times-Union reporter invented a story that a treaty had been signed under it, purely to stop developers felling it. The lie worked and the name stuck.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Treaty_Oak%2C_Jacksonville_Florida_%2826709370248%29.jpg",
    source: "https://en.wikipedia.org/wiki/Treaty_Oak_(Jacksonville)",
    credit: "Lorie Shaull from Washington, United States · CC BY-SA 2.0",
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
    name: "Cummer Gardens",
    place: "Riverside, Jacksonville",
    kind: "bench",
    lat: 30.315108,
    lng: -81.676582,
    note: "Early-20th-century riverfront gardens behind the museum, with an oak on the lawn older than the city's street grid.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Cummer_Museum%2C_Jacksonville%2C_FL%2C_US_%2802%29.jpg",
    source: "https://en.wikipedia.org/wiki/Cummer_Museum_of_Art_and_Gardens",
    credit: "bubba73 · CC BY-SA 3.0",
  },
  {
    name: "Fort Caroline",
    place: "Jacksonville, Florida",
    kind: "viewpoint",
    lat: 30.386944,
    lng: -81.500556,
    note: "The bluff over the St. Johns where the French tried to settle in 1564 and were massacred for it. Quiet now, in a way that takes a minute to sit with.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Fort_Caroline_moat_FOCA1566.jpg",
    source: "https://en.wikipedia.org/wiki/Fort_Caroline",
    credit: "NPS Photo · Public domain",
  },
  {
    name: "Kingsley Plantation",
    place: "Fort George Island, Jacksonville",
    kind: "viewpoint",
    lat: 30.438333,
    lng: -81.438056,
    note: "The oldest surviving plantation house in Florida, with the tabby ruins of twenty-five slave cabins in an arc behind it. Not a pleasant view. Worth sitting with anyway.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/KingsleyPlantationSunset2.jpg",
    source: "https://en.wikipedia.org/wiki/Kingsley_Plantation",
    credit: "Original uploader was Emanuel Kingsley at en.wikipedia · Public domain",
  },
  {
    name: "The Ribault Club",
    place: "Fort George Island, Jacksonville",
    kind: "bench",
    lat: 30.427929,
    lng: -81.424574,
    note: "A 1928 winter club for northerners, now state-run and open. The porch faces the river and the rocking chairs are free to use.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ribault_Club_on_Fort_George_Island.jpg",
    source: "https://en.wikipedia.org/wiki/Fort_George_Island",
    credit: "Mwanner · CC BY-SA 3.0",
  },
  {
    name: "Fort Clinch",
    place: "Fernandina Beach, Florida",
    kind: "viewpoint",
    lat: 30.704689,
    lng: -81.454461,
    note: "Five brick bastions at the mouth of the St. Marys, never finished and never fought over. You can sit on the ramparts and watch container ships come in over Cumberland Sound.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Fernandina_Beach_FL_Fort_Clinch_fort18.jpg",
    source: "https://en.wikipedia.org/wiki/Fort_Clinch_State_Park",
    credit: "Ebyabe · CC BY-SA 3.0",
  },
  {
    name: "Jacksonville Beach Pier",
    place: "Jacksonville Beach, Florida",
    kind: "viewpoint",
    lat: 30.293568,
    lng: -81.387706,
    note: "1,300 feet of pier with benches down both sides. Sunrise is the reason to be here, and you will not be the only one.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Fishing_Pier%2C_Jacksonville_Beach_%28Florida%29.jpg",
    source: "https://en.wikipedia.org/wiki/Jacksonville_Beach,_Florida",
    credit: "Olga Ernst · CC BY-SA 4.0",
  },

  // --- elsewhere ---
  {
    name: "Banco de Loiba",
    place: "Loiba, Galicia, Spain",
    kind: "bench",
    lat: 43.744324,
    lng: -7.752312,
    note: "A plain bench a neighbour put on the cliff in 2009. A band passing through the Ortigueira festival carved “the best bench in the world” into the back, and the name stuck hard enough that the council trademarked it.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Acantilados_de_Loiba_Ortigueira_A_Coru%C3%B1a_05.jpg",
    source: "https://es.wikipedia.org/wiki/Banco_de_Loiba",
    credit: "Tanja Freibott · CC BY-SA 4.0",
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
    name: "Big Bench Community Project",
    place: "Paroldo, Piedmont, Italy",
    kind: "bench",
    lat: 44.446359,
    lng: 8.065386,
    note: "One of hundreds of oversized benches scattered across the Langhe hills. You climb onto it and the point is to feel briefly small.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Panchina_gigante_n._44_%28Paroldo%29_01.jpg",
    source: "https://en.wikipedia.org/wiki/Big_Bench_Community_Project",
    credit: "Superchilum · CC BY-SA 4.0",
  },
  {
    name: "Buckden Pike",
    place: "Yorkshire Dales, England",
    kind: "trail_rest",
    lat: 54.204816,
    lng: -2.061884,
    note: "A memorial to a Polish bomber crew that crashed here in 1942. The one survivor followed fox tracks down to a farm; there is a bronze fox head set into the cross.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Buckden_Pike.jpg",
    source: "https://en.wikipedia.org/wiki/Buckden_Pike",
    credit: "Chris Heaton · CC BY-SA 2.0",
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
    name: "Cadair Idris",
    place: "Gwynedd, Wales",
    kind: "trail_rest",
    lat: 52.699595,
    lng: -3.9088,
    note: "The name means Idris's chair. The legend is that anyone who sleeps a night on it wakes as a poet or a madman.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cadair_Idris_wide_view.jpg",
    source: "https://en.wikipedia.org/wiki/Cadair_Idris",
    credit: "NotFromUtrecht · CC BY-SA 3.0",
  },
  {
    name: "Singing Ringing Tree",
    place: "Burnley, England",
    kind: "viewpoint",
    lat: 53.756635,
    lng: -2.227228,
    note: "Stacked steel pipes on a hill above the town. The wind plays it, tunelessly, and you sit below it and listen.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/82/Singing_Ringing_Tree_-_A_Panopticon_for_Burnley_-_geograph.org.uk_-_5939881.jpg",
    source: "https://en.wikipedia.org/wiki/Singing_Ringing_Tree",
    credit: "JThomas · CC BY-SA 2.0",
  },
  {
    name: "Wave Organ",
    place: "San Francisco, USA",
    kind: "bench",
    lat: 37.808487,
    lng: -122.44021,
    note: "A listening post on a jetty, built out of stone salvaged from a demolished cemetery. Best at high tide.",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/San_Francisco_Wave_Organ.jpg",
    source: "https://en.wikipedia.org/wiki/Wave_Organ",
    credit: "Frank Schulenburg · CC BY-SA 4.0",
  },
  {
    name: "Ławeczka Mikołaja Kopernika w Olsztynie",
    place: "Olsztyn, Poland",
    kind: "bench",
    lat: 53.77723,
    lng: 20.475392,
    note: "A bench with Copernicus already sitting on it, outside the castle where he ran the administration and did some of his observing.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Kopernik_w_Olsztynie.jpg",
    source: "https://pl.wikipedia.org/wiki/%C5%81aweczka_Miko%C5%82aja_Kopernika_w_Olsztynie",
    credit: "Chez Eskay from Karlsruhe, Germany · CC BY 2.0",
  },
  {
    name: "Stegastein",
    place: "Aurland, Norway",
    kind: "viewpoint",
    lat: 60.908176,
    lng: 7.21312,
    note: "A wooden platform that runs 30 m out from the hillside and stops at a glass rail, 650 m above the fjord.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Stegastein_viewpoint_-_panoramio_%281%29.jpg",
    source: "https://en.wikipedia.org/wiki/Stegastein",
    credit: "TomasEE · CC BY 3.0",
  },
  {
    name: "Mrs Macquarie's Chair",
    place: "Sydney, Australia",
    kind: "bench",
    lat: -33.859706,
    lng: 151.222565,
    note: "An actual bench, cut into the sandstone by convicts in 1810 for a governor's wife who liked to sit and watch for ships.",
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
    note: "A stone half-circle in the Englischer Garten, put there in 1838 and easy to walk past for years.",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/20230304_Stone_bench_Englischer_Garten_Munich_01.jpg",
    source: "https://de.wikipedia.org/wiki/Steinerne_Bank",
    credit: "Flocci Nivis · CC BY 4.0",
  },
  {
    name: "Gaularfjellet",
    place: "Sogndal, Norway",
    kind: "viewpoint",
    lat: 61.35149,
    lng: 6.518606,
    note: "A rest stop on a mountain road, built as architecture rather than a lay-by. Norway did dozens of these and almost nobody outside the country knows.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/%22Eine_fantastische_Aussicht%22._06.jpg",
    source: "https://en.wikipedia.org/wiki/Gaularfjellet",
    credit: "Holger Uwe Schmitt · CC BY-SA 4.0",
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
