/**
 * Google Maps style arrays that pull the basemap into the Perch palette:
 * warm bone ground, olive parks and water, roads reduced to quiet hairlines,
 * and almost no labels — the map is a backdrop for the pins, not the subject.
 *
 * Applies on Android (Google provider). Apple Maps on iOS ignores
 * customMapStyle and follows userInterfaceStyle instead.
 */

type MapStyle = { featureType?: string; elementType?: string; stylers: object[] }[];

export const MAP_STYLE_LIGHT: MapStyle = [
  { elementType: "geometry", stylers: [{ color: "#eeece1" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7b8479" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f4f2e9" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dbe2cf" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#faf8f0" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f6f4ea" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e9e6d8" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d4c2" }] },
  { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] },
];

export const MAP_STYLE_DARK: MapStyle = [
  // Muted forest rather than black — every surface keeps a green cast so the
  // basemap belongs to the brand instead of just being dark.
  { elementType: "geometry", stylers: [{ color: "#151d15" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#78826f" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f150f" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1d2a1b" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f2b1e" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#273526" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c130c" }] },
  { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] },
];
