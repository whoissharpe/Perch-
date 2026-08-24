import type { Metadata } from "next";
import { Wordmark } from "@/components/landing/Chrome";
import PerchMapClient from "@/components/map/PerchMapClient";
import "./map.css";

export const metadata: Metadata = {
  title: "Lisbon map",
  description:
    "Every bench in Lisbon, seeded from OpenStreetMap. Solid pins have been sat on; hollow ones are waiting.",
};

export default function MapPage() {
  return (
    <div className="map-page">
      <header className="map-bar">
        <Wordmark />
        <span className="meta">Lisbon</span>
      </header>
      <PerchMapClient />
    </div>
  );
}
