export type Group = {
	groupId: string;
	groupName: string;
	partyName: string;
	count: number;
	step: number; // 1: 日程調整中, 2: 日程確定, 3: 開催済み
	createdAt: number; // タイムスタンプ
	// memberIds?: string[]; // メンバーIDの配列（オプション）
	date?: string; // YYYY-MM-DD形式
	time?: string; // HH:mm形式
};
export type ScheduleData = {
	groupId: string;
	partyName: string;
	date: string;
	time: string;
	count: number;
};
