'use server';

import { messages } from '@/common/consts/messages';
import { Group, ScheduleData } from '@/common/types/group';
import { db } from '@/lib/gcp/firebase';
import { lineClient } from '@/lib/line/lineMessagingApiClient';

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
		await lineClient.pushMessage({
			to: scheduleData.groupId ?? '',
			messages: [
				{ type: 'text', text: messages.schedule_confirm(scheduleData) },
			],
		});
		// LINE Messaging APIのpushMessageはエラー時に例外を投げるため、ここでの追加チェックは不要

		await lineClient.pushMessage({
			to: scheduleData.groupId ?? '',
			messages: [
				{ type: 'text', text: messages.shop_request(scheduleData.groupId) },
			],
		});

		await lineClient.pushMessage({
			to: scheduleData.groupId ?? '',
			messages: [{ type: 'text', text: messages.shop_request_complete }],
		});

		return { success: true, message: '日程を登録しました！' };
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message:
				'日程の登録が失敗しました。時間を置いてからもう一度お試しください！',
		};
	}
}
