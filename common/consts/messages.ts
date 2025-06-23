import { ScheduleData } from '../types/group';

export const messages = {
	join: '招待ありがとう！\n幹事を担当するいいカンジです。よろしくね！',
	start_schedule:
		'まずは日程を決めよう！\n以下のリンクから出欠表を作ってね。\n\nhttps://chouseisan.com/',
	// manage_url: (groupId: string) =>
	// 	`管理画面はこちらです。\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}`,
	schedule_url: (groupId: string) =>
		`日程が決まったらこちらのフォームで教えてください！\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}/schedule`,
	schedule_confirm: (data: ScheduleData) => `🍻 飲み会の日程が確定しました！

🍻 ${data.partyName}
📆 日付: ${data.date}
⏰ 時間: ${data.time}
👥 参加予定: ${data.count}名

予定の確保をお願いします！📆
  `,
	shop_request: (groupId: string) =>
		`次に、飲み会のお店選びに関するご要望を以下のフォームからお聞かせください！\n\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}/shop-request\n\nいただいた情報を参考に、皆さんに喜んでいただけるお店を選定します！`,
};
