// Metro needs to be told about the workspace root, or it will not resolve
// @perch/core from packages/ and will not watch it for changes.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Left on (the default) deliberately: npm hoists most packages to the
// workspace root, and disabling hierarchical lookup breaks resolution of
// anything that did not get hoisted.

module.exports = config;
