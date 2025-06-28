import { NextResponse } from 'next/server';
import { lineClient } from '@/lib/line/lineMessagingApiClient';
import { db } from '@/lib/gcp/firebase';
import { messages } from '@/common/consts/messages';

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

export async function POST(req: Request) {
	// if (process.env.VERCEL_ENV === 'production') {
	try {
		// リクエストのボディを取得
		const body: LineWebhook = await req.json();

		for (const event of body.events) {
			console.log('Received event:', event);
			// グループに参加した時
			if (event.type === 'join') {
				console.log('Join event received:', event);
				if (event.source.type !== 'group' || !event.source.groupId) {
					console.error('Join event without groupId:', event);
					// throw new Error('グループIDがありません。');
					continue;
				}

				// グループの情報を取得し、DBに登録
				const groupSummary = await lineClient.getGroupSummary(
					event.source.groupId
				);
				console.log('Group Summary:', groupSummary);

				const groupCount = await lineClient.getGroupMemberCount(
					event.source.groupId
				);

				// 認証アカウントでないとメンバー一覧は取得できない
				// const groupMembers = await lineClient.getGroupMembersIds(
				// 	event.source.groupId
				// );

				const groupDocRef = db.collection('group').doc(groupSummary.groupId);

				await groupDocRef.set({
					groupId: groupSummary.groupId,
					groupName: groupSummary.groupName,
					partyName: groupSummary.groupName,
					count: groupCount.count,
					step: 1, // 日程調整中
					// memberIds: groupMembers.memberIds,
					createdAt: event.timestamp,
				});

				await lineClient.pushMessage({
					to: groupSummary.groupId,
					messages: [
						{
							type: 'text',
							text: messages.join,
						},
					],
				});

				await lineClient.pushMessage({
					to: groupSummary.groupId,
					messages: [
						{
							type: 'text',
							text: messages.start_schedule,
						},
					],
				});

				await lineClient.pushMessage({
					to: groupSummary.groupId,
					messages: [
						{
							type: 'text',
							text: messages.schedule_url(groupSummary.groupId),
						},
					],
				});
			} else if (event.type === 'message') {
				// メッセージイベントの処理
				console.log('Message event received:', event);

				if (event.message.type === 'text') {
					const text = event.message.text?.trim();
					// ここで店選びを開始させる
				}
			}
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
	// } else {
	// 	// ビルド環境では処理しない
	// 	return new NextResponse('Build environment - Skipping Webhook', {
	// 		status: 200,
	// 	});
	// }
}
