import type { Metadata } from "next";
import { Wordmark } from "@/components/landing/Chrome";
import PerchMapClient from "@/components/map/PerchMapClient";
import "./map.css";

export const metadata: Metadata = {
  title: "The map",
  description:
    "Every spot people have marked around you, with the photo they took from it.",
};

export default function MapPage() {
  return (
    <div className="map-page">
      <header className="map-bar">
        <Wordmark size={26} />
        <span className="meta">Lisbon</span>
      </header>
      <PerchMapClient />
    </div>
  );
}
