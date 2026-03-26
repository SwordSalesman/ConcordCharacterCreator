import type { NextConfig } from "next";

/*
Next step of the upgrade to allow for API routes:
  1. npm install @cloudflare/next-on-pages
  2. Change the build command from next build to npx @cloudflare/next-on-pages
  3. Remove output: 'export' from next.config.ts
  4. Add a wrangler.toml for Cloudflare Workers config
*/

const nextConfig: NextConfig = {
	/* config options here */
	output: "export",
	distDir: "build",
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"],
	},
	turbopack: {},
};

export default nextConfig;
