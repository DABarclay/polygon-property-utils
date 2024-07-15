module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  //Optionally, you can specify the path to your TypeScript config file
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
    testMatch: [
      "*/tests/**/*.ts", // Matches any .ts files in subdirectories under tests
      "tests/*.ts", // Matches any .ts files directly under the tests folder
    ],
  },
};
