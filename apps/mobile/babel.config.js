const path = require("path");

// In a monorepo, babel-preset-expo cannot infer where the router's app/
// directory lives, and expo-router's require.context call fails with
// "Invalid call ... process.env.EXPO_ROUTER_APP_ROOT". Set it explicitly.
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, "app");

module.exports = function (api) {
  api.cache(true);
  // expo-router/babel was folded into babel-preset-expo in SDK 50 — listing
  // it separately errors out. The preset handles the router on its own.
  return {
    presets: ["babel-preset-expo"],
  };
};
