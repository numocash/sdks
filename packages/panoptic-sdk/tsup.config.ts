import { defineConfig } from "tsup";

export default defineConfig({
  name: "panoptic-sdk",
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
});
