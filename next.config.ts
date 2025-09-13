import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	distDir: "build",
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"],
	},
};

export default nextConfig;
