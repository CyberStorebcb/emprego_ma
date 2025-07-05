import type { NextConfig } from "next";

const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: "/emprego_ma",
  }),
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/emprego_ma" : "",
  },
};

export default nextConfig;
