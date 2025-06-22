'use server';

import { Group } from '@/common/types/group';
import { db } from '@/lib/gcp/firebase';
import { lineClient } from '@/lib/line/lineMessagingApiClient';
import { group } from 'console';

interface ScheduleData {
	groupId: string;
	partyName: string;
	date: string;
	time: string;
	count: number;
}

export async function getParty(partyId: string): Promise<Group | null> {
	const groupDocRef = db.collection('group').doc(partyId);
	const doc = await groupDocRef.get();
	if (!doc.exists) {
		console.log('No such document!');
		return null;
	} else {
		console.log('Document data:', doc.data());
		return doc.data() as Group;
	}
}

export async function sendScheduleNotification(scheduleData: ScheduleData) {
	// 実際のアプリでは、ここでLINE Messaging APIやSlack APIなどを使用
	// 今回はコンソールログとシミュレーション

	const message = `
🍻 飲み会の日程が確定しました！

📅 イベント: ${scheduleData.partyName}
📆 日付: ${scheduleData.date}
⏰ 時間: ${scheduleData.time}
👥 参加予定: ${scheduleData.count}名

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
					partyName: scheduleData.partyName,
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
