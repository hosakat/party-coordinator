import { NextRequest, NextResponse } from 'next/server';
import { middleware as lineMiddleware } from '@line/bot-sdk';

const lineConfig = {
	channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN || '',
	channelSecret:
		process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET ||
		'492e9c5deca67bd09bdbe85c97b9488f',
};

// // 署名検証を行う関数
// function verifySignature(signature: string, body: string) {
// 	const hmac = crypto.createHmac(
// 		'SHA256',
// 		process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET || ''
// 	);
// 	hmac.update(body);
// 	const computedSignature = hmac.digest('base64');
// 	return computedSignature === signature;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(req: NextRequest) {
	try {
		// ミドルウェアによるシグネチャ検証
		const response = lineMiddleware(lineConfig);
		return response;
	} catch (error) {
		console.error('Error processing webhook:', error);
		return NextResponse.json(
			{ error: 'Authorization error at middleware' },
			{ status: 500 }
		);
	}
}

export const config = {
	matcher: ['/api/:path*'],
};
