const { transform } = require("@babel/core");

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["<rootDir>/../tests"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
  },
  setupFiles: [
    "<rootDir>/../tests/common/setup.ts"
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"]
};