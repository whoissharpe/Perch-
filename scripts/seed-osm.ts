/**
 * Seed one area's spots from OpenStreetMap via the Overpass API.
 *
 *   npm run seed:osm
 *
 * These arrive as *pins without photos* — deliberately. A seeded spot shows
 * as a hollow outline on the map until somebody actually goes and marks it.
 * That contrast is the product: open data says a bench exists, Perch says
 * whether it is any good.
 *
 * Scoped to a single bounding box on purpose. Seeding the world is the
 * mistake that makes every place equally empty.
 *
 * Base map data is © OpenStreetMap contributors, licensed ODbL. Attribution
 * is a licence condition, not a courtesy.
 */

import { createClient } from "@supabase/supabase-js";

const OVERPASS = "https://overpass-api.de/api/interpreter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AREA = process.env.SEED_CITY_NAME ?? "Lisbon";
const BBOX = process.env.SEED_BBOX ?? "38.6913,-9.2300,38.7955,-9.0900";

type SpotKind = "bench" | "viewpoint" | "trail_rest" | "picnic" | "shelter";

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Map OSM tagging onto the five kinds Perch understands. */
function kindFor(tags: Record<string, string> = {}): SpotKind | null {
  if (tags.amenity === "bench") return "bench";
  if (tags.tourism === "viewpoint") return "viewpoint";
  if (tags.amenity === "picnic_table" || tags.leisure === "picnic_table") return "picnic";
  if (tags.amenity === "shelter") return "shelter";
  return null;
}

function nameFor(kind: SpotKind, tags: Record<string, string> = {}): string {
  if (tags.name) return tags.name;
  return {
    bench: "Unnamed bench",
    viewpoint: "Viewpoint",
    trail_rest: "Trail rest",
    picnic: "Picnic table",
    shelter: "Shelter",
  }[kind];
}

function attributesFrom(tags: Record<string, string> = {}): string[] {
  const out: string[] = [];
  if (tags.backrest === "yes") out.push("backrest");
  if (tags.wheelchair === "yes") out.push("step_free");
  if (tags.covered === "yes" || tags.shelter === "yes") out.push("shade");
  return out;
}

async function fetchSpots(): Promise<OverpassElement[]> {
  const query = `
    [out:json][timeout:180];
    (
      nwr["amenity"="bench"](${BBOX});
      nwr["tourism"="viewpoint"](${BBOX});
      nwr["amenity"="picnic_table"](${BBOX});
      nwr["amenity"="shelter"](${BBOX});
    );
    out center tags;
  `;

  console.log(`Querying Overpass for spots in ${AREA} (${BBOX})...`);
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) {
    throw new Error(
      `Overpass returned ${res.status}. It rate limits aggressively — wait a minute and retry.`,
    );
  }

  const json = (await res.json()) as { elements: OverpassElement[] };
  return json.elements ?? [];
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env.local.",
    );
  }

  const elements = await fetchSpots();

  const rows = elements
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      const kind = kindFor(el.tags);
      if (lat == null || lon == null || kind == null) return null;

      return {
        kind,
        geom: `SRID=4326;POINT(${lon} ${lat})`,
        name: nameFor(kind, el.tags),
        place: AREA,
        attributes: attributesFrom(el.tags),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const byKind = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.kind] = (acc[r.kind] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Found ${rows.length} spots:`, byKind);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const CHUNK = 500;
  let written = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase.from("spots").insert(chunk);
    if (error) throw new Error(`Insert failed at row ${i}: ${error.message}`);

    written += chunk.length;
    process.stdout.write(`\r  ${written}/${rows.length}`);
  }

  console.log(`\nSeeded ${written} spots into ${AREA}.`);
  console.log("They will show as hollow pins until somebody marks them.");
  console.log("Attribution: base map data © OpenStreetMap contributors (ODbL).");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
