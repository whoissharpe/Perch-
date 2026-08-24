/**
 * Seed one city's benches from OpenStreetMap via the Overpass API.
 *
 *   npm run seed:osm
 *
 * Deliberately scoped to a single bounding box. Seeding the world is the
 * mistake that makes every city equally empty — see docs/STRATEGY.md.
 *
 * Bench data is © OpenStreetMap contributors, licensed ODbL. That attribution
 * is a licence condition, not a courtesy: it must stay visible in the product.
 */

import { createClient } from "@supabase/supabase-js";

const OVERPASS = "https://overpass-api.de/api/interpreter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CITY = process.env.SEED_CITY_NAME ?? "Lisbon";
const BBOX = process.env.SEED_BBOX ?? "38.6913,-9.2300,38.7955,-9.0900";

interface OverpassElement {
  type: "node" | "way";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** OSM tags -> the attributes Perch cares about. Absent tag means unknown. */
function attributesFromTags(tags: Record<string, string> = {}): string[] {
  const out: string[] = [];
  if (tags.backrest === "yes") out.push("backrest");
  if (tags.armrest === "yes") out.push("armrests");
  if (tags["wheelchair"] === "yes") out.push("step_free");
  return out;
}

async function fetchBenches(): Promise<OverpassElement[]> {
  // `nwr` catches benches mapped as ways (long seating walls) too.
  const query = `
    [out:json][timeout:120];
    nwr["amenity"="bench"](${BBOX});
    out center tags;
  `;

  console.log(`Querying Overpass for benches in ${CITY} (${BBOX})...`);
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

  const elements = await fetchBenches();

  const rows = elements
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (lat == null || lon == null) return null;

      return {
        osm_id: el.id,
        source: "osm" as const,
        geom: `SRID=4326;POINT(${lon} ${lat})`,
        city: CITY,
        name: el.tags?.name ?? null,
        attributes: attributesFromTags(el.tags),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  console.log(`Found ${rows.length} benches. Upserting...`);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  // Chunked, and keyed on osm_id so re-running is idempotent.
  const CHUNK = 500;
  let written = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("benches")
      .upsert(chunk, { onConflict: "osm_id", ignoreDuplicates: false });

    if (error) throw new Error(`Upsert failed at row ${i}: ${error.message}`);

    written += chunk.length;
    process.stdout.write(`\r  ${written}/${rows.length}`);
  }

  console.log(`\nSeeded ${written} benches into ${CITY}.`);
  console.log("Attribution: bench data © OpenStreetMap contributors (ODbL).");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
