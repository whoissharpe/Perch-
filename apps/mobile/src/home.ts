/**
 * Where the map opens before there is a location fix.
 *
 * This existed in three places that had drifted apart: the screens fell back
 * to Jacksonville while both map canvases still hard-coded Lisbon from an
 * early version. The result was a first run where the picks rail offered
 * Treaty Oak "21 min walk" over a map of Arroios and Graça — the suggestions
 * and the map were in different countries and neither was wrong on its own.
 *
 * Jacksonville because that is where the first real picks are: an empty-handed
 * first run should still open onto something walkable.
 */
export const HOME = { lat: 30.3322, lng: -81.6557 } as const;
