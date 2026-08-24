/**
 * Google Maps style arrays that pull the basemap into the Perch palette:
 * paper ground, pine water and parks, roads reduced to quiet hairlines, and
 * almost no labels — the map is a backdrop for the pins, not the subject.
 *
 * Applies on Android (Google provider). Apple Maps on iOS ignores
 * customMapStyle and follows userInterfaceStyle instead.
 */

type MapStyle = { featureType?: string; elementType?: string; stylers: object[] }[];

export const MAP_STYLE_LIGHT: MapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f4f5f2" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#77837d" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fcfcfa" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e2ebe4" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fbfbf9" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f0efe9" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfdcd6" }] },
  { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] },
];

export const MAP_STYLE_DARK: MapStyle = [
  // Deep pine rather than black — every surface keeps a green cast so the
  // basemap belongs to the brand instead of just being dark.
  { elementType: "geometry", stylers: [{ color: "#0f1f19" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6f8279" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a1712" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#163025" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#193028" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1f3a30" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#08150f" }] },
  { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] },
];
