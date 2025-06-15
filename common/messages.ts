export const messages = {
	join: '招待ありがとう！\n幹事を担当するいいカンジです。よろしくね！',
	start_schedule:
		'まずは日程を決めよう！\n以下のリンクから出欠表を作ってね。\n\nhttps://chouseisan.com/',
	manage_url: (groupId: string) =>
		`管理画面はこちらです。\n${process.env.NEXT_PUBLIC_APL_URL}/group/${groupId}`,
};
