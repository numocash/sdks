import { defineConfig } from "tsup";

export default defineConfig({
  name: "@panoptic-xyz/uniswap-v3-sdk",
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
});
