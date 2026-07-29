const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },

  // Only run TypeScript tests from the tests directory
  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  // Never run compiled tests from dist
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
};