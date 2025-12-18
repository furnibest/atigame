import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	
	// Performance optimizations
	experimental: {
		optimizePackageImports: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
	},
	
	// Image optimization
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.supabase.co',
				pathname: '/storage/v1/object/public/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/**',
			},
		],
		formats: ['image/webp', 'image/avif'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 3600, // 1 hour cache
		dangerouslyAllowSVG: false,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		unoptimized: false,
	},
	
	// Headers for caching and security
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
				],
			},
			{
				source: '/static/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		];
	},
};

export default withBundleAnalyzer(nextConfig);
