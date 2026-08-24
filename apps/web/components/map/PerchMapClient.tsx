"use client";

import dynamic from "next/dynamic";

/**
 * `ssr: false` is only legal inside a Client Component in the App Router, and
 * MapLibre touches `window` at import time — so the boundary lives here rather
 * than in app/map/page.tsx, which needs to stay a Server Component to export
 * metadata.
 */
const PerchMap = dynamic(() => import("./PerchMap"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <span className="meta">Loading Lisbon&hellip;</span>
    </div>
  ),
});

export default function PerchMapClient() {
  return <PerchMap />;
}
