import { NextRequest, NextResponse } from 'next/server';
// import { middleware as lineMiddleware } from '@line/bot-sdk';
import crypto from 'crypto';

const lineConfig = {
	channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN || '',
	channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET || '',
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

export function middleware(req: NextRequest) {
	// LINE Webhookの署名（X-Line-Signature）を取得
	const signature = req.headers.get('X-Line-Signature') || '';

	// リクエストボディを取得
	const body = req.body ? JSON.stringify(req.body) : '';

	// 署名の検証
	if (!verifySignature(signature, body)) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	return NextResponse.next();
}

function verifySignature(signature: string, body: string) {
	const hmac = crypto.createHmac('SHA256', lineConfig.channelSecret);
	hmac.update(body);
	const computedSignature = hmac.digest('base64');
	return computedSignature === signature;
}

export const config = {
	matcher: ['/api/:path*'],
};
