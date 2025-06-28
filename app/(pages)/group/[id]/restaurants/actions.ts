'use server';

import { messages } from '@/common/consts/messages';
import { Group, ScheduleData } from '@/common/types/group';
import { db } from '@/lib/gcp/firebase';
import { lineClient } from '@/lib/line/lineMessagingApiClient';

export async function getShops(scheduleData: ScheduleData) {
	try {
		// DBに日程を登録
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APL_URL}/api/group/schedule/update/${scheduleData.groupId}`,
			{
				method: 'GET',
			}
		);

		if (response.status !== 200) {
			throw new Error(
				`おすすめの店取得に失敗しました。エラー：${response.statusText}`
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

		return { success: true, message: 'メッセージを送信しました' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'メッセージの送信に失敗しました' };
	}
}
