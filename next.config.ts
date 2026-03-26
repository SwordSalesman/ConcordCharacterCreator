import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"],
	},
	turbopack: {},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
