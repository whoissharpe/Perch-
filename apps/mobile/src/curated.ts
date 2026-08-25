import type { SampleMark } from "@/sample";

/**
 * Perch Picks — spots the team has marked themselves.
 *
 * These exist so a new user never opens the map onto nothing. An empty map is
 * the whole cold-start problem: there is no reason to add a spot to a product
 * that looks abandoned. A handful of good ones nearby says what the app is for
 * and, more usefully, sets the bar for what a mark should look like.
 *
 * They are placed by bearing and distance from wherever the user is standing
 * rather than at fixed coordinates, so they are always walkable — a curated
 * spot in Lisbon is worth nothing to somebody in Leeds. The trade is that they
 * are not real places until the team replaces them with real ones, which is
 * why every one is flagged `curated` and rendered as a Perch pick rather than
 * passed off as a neighbour's find.
 */

const IMG = (id: string) =>
  `https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/${id}`;

interface Pick {
  name: string;
  kind: SampleMark["kind"];
  who: string;
  caption: string;
  /** Why the team marked it — shown on the pick itself. */
  note: string;
  saves: number;
  image: string;
  /** Compass bearing in degrees from the user, and metres out. */
  bearing: number;
  metres: number;
}

const PICKS: Pick[] = [
  {
    name: "The first one we ever marked",
    kind: "bench",
    who: "perch",
    caption: "This is the bench the whole app came from. Face east, go early.",
    note: "Where Perch started",
    saves: 1840,
    image: IMG(
      "hf_20260824_154126_ea2a1269-48dc-4854-91fa-b57eb4c658e9_min.webp",
    ),
    bearing: 22,
    metres: 620,
  },
  {
    name: "Ten minutes off the path",
    kind: "viewpoint",
    who: "perch",
    caption:
      "Everybody walks past the turning. Take it. The view opens up all at once.",
    note: "Worth the detour",
    saves: 1216,
    image: IMG(
      "hf_20260824_164312_ac1ff28d-04e9-4a7a-b415-15aec8d786ff_min.webp",
    ),
    bearing: 128,
    metres: 1150,
  },
  {
    name: "Best seat for a sunset",
    kind: "bench",
    who: "perch",
    caption: "Arrive twenty minutes before. The wait is the point.",
    note: "Go at golden hour",
    saves: 2032,
    image: IMG(
      "hf_20260824_164312_677fa363-cac0-4752-98de-f4409353446c_min.webp",
    ),
    bearing: 265,
    metres: 880,
  },
  {
    name: "Quiet at any hour",
    kind: "trail_rest",
    who: "perch",
    caption:
      "Not much of a view. Completely empty, always. Some days that is the better thing.",
    note: "Never busy",
    saves: 743,
    image: IMG(
      "hf_20260824_164312_0ec2b755-dd79-4817-a7a7-b96bdaa0b9e2_min.webp",
    ),
    bearing: 310,
    metres: 1420,
  },
  {
    name: "Under the big tree",
    kind: "bench",
    who: "perch",
    caption: "Shade all afternoon. The only one on this stretch that has it.",
    note: "Shade in summer",
    saves: 967,
    image: IMG(
      "hf_20260824_164312_b636ebfc-0488-4d25-bc4a-38d8b85d0fde_min.webp",
    ),
    bearing: 195,
    metres: 540,
  },
  {
    name: "Where the path meets the water",
    kind: "viewpoint",
    who: "perch",
    caption: "Sit on the low wall rather than the bench. Better angle.",
    note: "Local favourite",
    saves: 1508,
    image: IMG(
      "hf_20260824_164312_1c54099f-193a-4961-a785-be26af776441_min.webp",
    ),
    bearing: 78,
    metres: 1680,
  },
];

/** Metres north/east of a point, as a latitude/longitude offset. */
function offset(lat: number, lng: number, bearing: number, metres: number) {
  const rad = (bearing * Math.PI) / 180;
  const dLat = (metres * Math.cos(rad)) / 111_320;
  const dLng =
    (metres * Math.sin(rad)) /
    (111_320 * Math.cos((lat * Math.PI) / 180) || 1);
  return { lat: lat + dLat, lng: lng + dLng };
}

/**
 * The team's picks, ringed around a centre — the user's location when we have
 * it, the map's default otherwise.
 */
export function curatedNear(lat: number, lng: number): SampleMark[] {
  const built = build(lat, lng);
  // Remember the most recent ring so the detail screen can resolve a pick by
  // id without knowing which centre produced it. Rebuilding from a fallback
  // centre there would show the right photo at the wrong coordinates.
  latest = built;
  return built;
}

let latest: SampleMark[] = [];

/** A pick by id, from the ring the map most recently built. */
export function curatedById(id: string): SampleMark | undefined {
  if (latest.length === 0) latest = build(38.7223, -9.1394);
  return latest.find((m) => m.id === id);
}

function build(lat: number, lng: number): SampleMark[] {
  return PICKS.map((p, i) => {
    const { lat: pLat, lng: pLng } = offset(lat, lng, p.bearing, p.metres);
    return {
      id: `perch-${i + 1}`,
      name: p.name,
      kind: p.kind,
      lat: pLat,
      lng: pLng,
      image: p.image,
      who: p.who,
      caption: p.caption,
      saves: p.saves,
      isVideo: false,
      // Curated spots always read as marked so they draw as a full bird —
      // an outline ring would make the team's picks the quietest thing on
      // the map, which is backwards.
      marks: 1,
      curated: true,
      note: p.note,
      metresAway: p.metres,
    };
  });
}
