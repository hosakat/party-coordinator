export type Group = {
	groupId: string;
	groupName: string;
	partyName: string;
	count: number;
	step: number; // 1: 日程調整中, 2: 日程調整リマインド済み, 3: 日程決定済・条件調整中
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
