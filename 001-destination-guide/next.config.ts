import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  output: "export",
  experimental: { cpus: 2 },
  outputFileTracingRoot: path.resolve(__dirname, ".."),
};
export default config;
