const app = require("./app.json");

/**
 * Expo config, with one thing decided at build time: the base URL.
 *
 * A local `expo export` serves from the root, so the bundle's absolute asset
 * paths (`/_expo/...`) resolve fine. GitHub Pages serves a project site from
 * `/<repo>/` instead, and those same absolute paths 404 — which is the usual
 * reason an Expo web export goes blank the moment it is deployed anywhere
 * other than a domain root.
 *
 * So the deploy workflow sets EXPO_BASE_URL and everything else stays shared.
 * Leave it unset for local builds.
 */
module.exports = () => ({
  ...app.expo,
  experiments: {
    ...app.expo.experiments,
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
