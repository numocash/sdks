import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    coverage: {
      reporter: process.env.CI ? ["lcov"] : ["text", "json", "html"],
      exclude: ["**/dist/**", "**/*.test.ts", "**/*.test-d.ts", "**/_test/**"],
    },
  },
});
