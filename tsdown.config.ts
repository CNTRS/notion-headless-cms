import { defineConfig } from "tsdown";

export default defineConfig({
    entry: { "notion-headless-cms": "src/main.ts" },
    format: ["esm"],
    dts: true,
    exports: { legacy: true },
});
