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
  { elementType: "geometry", stylers: [{ color: "#16211d" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7e8c86" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0e1613" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1b2c25" }, { visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e2b26" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#25342d" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1512" }] },
  { featureType: "water", elementType: "labels.text", stylers: [{ visibility: "off" }] },
];
