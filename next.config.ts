import type { NextConfig } from "next";


const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
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

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
