import type { NextConfig } from "next";

const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/emprego_ma" : "",
  images: { unoptimized: true },
};

export default nextConfig;
