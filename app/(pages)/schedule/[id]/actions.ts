'use server';

import { lineClient } from '@/lib/line/lineMessagingApiClient';

interface ScheduleData {
	title: string;
	date: string;
	time: string;
	participants: number;
}

export async function sendScheduleNotification(scheduleData: ScheduleData) {
	// 実際のアプリでは、ここでLINE Messaging APIやSlack APIなどを使用
	// 今回はコンソールログとシミュレーション

	const message = `
🍻 飲み会の日程が確定しました！

📅 イベント: ${scheduleData.title}
📆 日付: ${scheduleData.date}
⏰ 時間: ${scheduleData.time}
👥 参加予定: ${scheduleData.participants}名

皆さん、お疲れ様でした！
詳細は後日お知らせします。
  `.trim();

	// シミュレーション: 実際のAPI呼び出し
	console.log('=== メッセージ送信シミュレーション ===');
	console.log('送信先: LINE/Slack/Discord など');
	console.log('メッセージ内容:');
	console.log(message);
	console.log('=====================================');

	// // 実際のLINE Messaging API呼び出し例:
	// const response = await fetch('https://api.line.me/v2/bot/message/push', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN}`,
	// 	},
	// 	body: JSON.stringify({
	// 		to: process.env.GROUP_ID_OR_USER_ID, // 実際のグループIDまたはユーザーIDを指定
	// 		messages: [
	// 			{
	// 				type: 'text',
	// 				text: message,
	// 			},
	// 		],
	// 	}),
	// });

	const res = await lineClient.pushMessage({
		to: process.env.GROUP_ID_OR_USER_ID ?? '',
		messages: [{ type: 'text', text: message }],
	});

	console.log(res);

	// 成功をシミュレート
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return { success: true, message: 'メッセージを送信しました' };
}
