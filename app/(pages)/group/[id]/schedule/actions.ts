'use server';

import { lineClient } from '@/lib/line/lineMessagingApiClient';

interface ScheduleData {
	groupId: string;
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

	try {
		// DBに日程を登録
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APL_URL}/api/group/schedule/update/${scheduleData.groupId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					groupId: scheduleData.groupId,
					date: scheduleData.date,
					time: scheduleData.time,
				}),
			}
		);

		if (response.status !== 200) {
			throw new Error(
				`日程の登録に失敗しました。エラー：${response.statusText}`
			);
		}

		// LINEに日程確定メッセージを送信
		const res = await lineClient.pushMessage({
			to: scheduleData.groupId ?? process.env.GROUP_ID_OR_USER_ID ?? '',
			messages: [{ type: 'text', text: message }],
		});
		// LINE Messaging APIのpushMessageはエラー時に例外を投げるため、ここでの追加チェックは不要

		return { success: true, message: 'メッセージを送信しました' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'メッセージの送信に失敗しました' };
	}
}
