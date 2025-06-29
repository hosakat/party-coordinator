import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	env: {
		LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,
		LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN,
		FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
		NEXT_PUBLIC_APL_URL: process.env.NEXT_PUBLIC_APL_URL,
	},
	output: 'standalone',
};

export default nextConfig;
