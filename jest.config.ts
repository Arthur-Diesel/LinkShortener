module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/config/mockDb.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "js"],
};