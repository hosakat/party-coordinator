import { NextResponse } from 'next/server';
import { lineClient } from '@/lib/lineMessagingApiClient';

interface LineMessage {
	type: string; // メッセージタイプ（text、image、video など）
	id: string;
	text?: string; // textメッセージの場合にテキスト内容
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

interface LineSource {
	userId?: string; // ユーザーID
	groupId?: string; // グループID
	type: 'user' | 'group' | 'room'; // メッセージが送られた対象のタイプ
}

type LineEvent = {
	type: string; // イベントタイプ（message、follow、unfollow など）
	replyToken: string;
	source: LineSource;
	timestamp: number; // イベントのタイムスタンプ
	message: LineMessage; // メッセージの詳細
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

type LineWebhook = {
	events: LineEvent[];
};

// const config = {
// 	channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN || '',
// 	channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET || '',
// };

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

export async function POST(req: Request) {
	try {
		// リクエストのヘッダーから署名を取得
		// const signature = req.headers.get('X-Line-Signature') || '';

		// リクエストのボディを取得
		const body = await req.text();

		// // ミドルウェアによるシグネチャ検証
		// if (!middleware(config)) {
		// 	return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
		// }

		const bodyParsed: LineWebhook = JSON.parse(body);

		for (const event of bodyParsed.events) {
			if (event.type === 'join') {
				console.log('Join event received:', event);
				if (event.source.type !== 'group' || !event.source.groupId) {
					console.error('Join event without groupId:', event);
					// throw new Error('グループIDがありません。');
					continue;
				}
				const groupSummary = await lineClient.getGroupSummary(
					event.source.groupId
				);
				console.log('Group Summary:', groupSummary);

				await lineClient.pushMessage({
					to: groupSummary.groupId,
					messages: [
						{ type: 'text', text: `参加しました！ ${groupSummary.groupName}` },
					],
				});
			}
			// メッセージイベントが送られてきた場合
			// if (event.type === 'message' && event.message.type === 'text') {
			// 	const userId = event.source.userId; // ユーザーIDを取得
			// 	const message = event.message.text; // 受け取ったメッセージ

			// 	if (userId) {
			// 		const replyMessage = {
			// 			to: userId,
			// 			messages: [
			// 				{
			// 					type: 'text',
			// 					text: `あなたのメッセージは: ${message}`,
			// 				},
			// 			],
			// 		};

			// 		try {
			// 			// ユーザーにメッセージを送信
			// 			await axios.post(
			// 				'https://api.line.me/v2/bot/message/push',
			// 				replyMessage,
			// 				{
			// 					headers: {
			// 						'Content-Type': 'application/json',
			// 						Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
			// 					},
			// 				}
			// 			);
			// 			console.log('Message sent to user:', userId);
			// 		} catch (error) {
			// 			console.error('Error sending message:', error);
			// 			return NextResponse.json(
			// 				{ error: 'Failed to send message' },
			// 				{ status: 500 }
			// 			);
			// 		}
			// 	}
			// }
		}

		return NextResponse.json(
			{ message: 'Webhook processed successfully' },
			{ status: 200 }
		);
	} catch (error) {
		await lineClient.pushMessage({
			to: process.env.GROUP_ID_OR_USER_ID ?? '',
			messages: [{ type: 'text', text: `エラー ${error}` }],
		});
		console.error('Error processing webhook:', error);
		return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
	}
}
