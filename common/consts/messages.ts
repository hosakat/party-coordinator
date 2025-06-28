import { ScheduleData } from '../types/group';

export const messages = {
	join: '招待ありがとう！\n幹事を担当するいいカンジです。よろしくね！',
	start_schedule:
		'まずは日程を決めよう！\n以下のリンクから出欠表を作ってね。\n\nhttps://chouseisan.com/',
	// manage_url: (groupId: string) =>
	// 	`管理画面はこちらです。\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}`,
	schedule_url: (groupId: string) =>
		`日程が決まったらこちらのフォームで教えてください！\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}/schedule`,
	schedule_confirm: (data: ScheduleData) => `🍻 飲み会の日程が確定したよ！

🍻 ${data.partyName}
📆 日付: ${data.date}
⏰ 時間: ${data.time}
👥 参加予定: ${data.count}名

予定の確保をよろしくね！
  `,
	shop_request: (groupId: string) =>
		`次に、飲み会のお店選びに関するご要望を以下のフォームから聞かせてね！\n\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}/shop-request\n\n入力してもらった情報を参考に、みんなに喜んでもらえるお店を選定します！`,
	shop_request_complete:
		'全員の入力が終わったら、\n「イイカンジ、お店を選んで！」\nとメッセージを送ってね！',
	search_complete: (groupId: string) =>
		`お店の選定が完了しました！👏\n以下のリンクからお店の情報を確認してね！\n\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}/restaurants`,
	offer_reservation: `ぜひお店のリストを参考にして、\n予約をお願いします！`,
};
