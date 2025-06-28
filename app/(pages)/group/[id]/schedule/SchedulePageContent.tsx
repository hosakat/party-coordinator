'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { getParty, sendScheduleNotification } from './actions';
import React from 'react';
import { Group } from '@/common/types/group';
import { TextInput } from '@/components/ui/textInput';

// サンプルデータ（実際のアプリでは props や API から取得）
const nomikaiData = {
	1: {
		title: '新年会',
		description: '2025年の新年を祝う飲み会',
		participants: 8,
	},
	2: {
		title: '歓送迎会',
		description: '新メンバーの歓迎と退職者の送別会',
		participants: 12,
	},
	3: {
		title: 'プロジェクト打ち上げ',
		description: '大型プロジェクト完了の打ち上げ',
		participants: 6,
	},
	4: {
		title: '月例飲み会',
		description: '毎月恒例のチーム飲み会',
		participants: 10,
	},
	C42a4b55007a96fcf7cea2ed90381eb4a: {
		title: 'テスト飲み会',
		description: '開発テスト飲み会',
		participants: 10,
	},
	Cede8f22919893905b58d3108b994fd7b: {
		title: 'テスト飲み会2',
		description: '開発テスト飲み会',
		participants: 10,
	},
};

export default function SchedulePageContent({ partyId }: { partyId: string }) {
	const [partyData, setPartyData] = useState<Group | null>(null);
	const [loading, setLoading] = useState(true);
	const [partyName, setPartyName] = useState<string>();
	const [selectedDate, setSelectedDate] = useState<Date>();
	const [selectedTime, setSelectedTime] = useState<string>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitState, setSubmitState] = useState<'none' | 'false' | 'true'>(
		'none'
	);
	const [message, setMessage] = useState<string>('');

	const fetchParty = useCallback(async () => {
		setLoading(true);
		const data = await getParty(partyId);
		setPartyData(data);
		setPartyName(data?.partyName);
		setLoading(false);
	}, [partyId]);

	useEffect(() => {
		fetchParty();
	}, [fetchParty]);

	if (loading) {
		return <div>読み込み中...</div>;
	}
	if (!partyData) {
		return <div>飲み会が見つかりません</div>;
	}

	const handleScheduleConfirm = async () => {
		if (!selectedDate || !selectedTime) return;

		setIsSubmitting(true);

		try {
			const scheduledDateTime = new Date(selectedDate);
			const [hours, minutes] = selectedTime.split(':');
			scheduledDateTime.setHours(
				Number.parseInt(hours),
				Number.parseInt(minutes)
			);

			const response = await sendScheduleNotification({
				groupId: partyId,
				partyName: partyName || partyData.partyName,
				date: scheduledDateTime.toLocaleDateString('ja-JP'),
				time: selectedTime,
				count: partyData.count,
			});

			if (response.success) {
				setSubmitState('true');
				setMessage(response.message);
			} else {
				setSubmitState('false');
				setMessage(response.message);
			}
		} catch (error) {
			console.error('スケジュール確定エラー:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const timeOptions = [
		'17:00',
		'17:30',
		'18:00',
		'18:30',
		'19:00',
		'19:30',
		'20:00',
		'20:30',
		'21:00',
		'21:30',
		'22:00',
	];

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<TextInput
						label="飲み会名"
						// defaultValue={partyData.partyName}
						value={partyName}
						onChange={(e) => setPartyName(e.target.value)}
						placeholder="例: 新年会"
						className="mb-4"
					/>
					<Badge
						variant="secondary"
						className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
					>
						日程調整中
					</Badge>
				</div>
				{/* <p className="text-muted-foreground">{partyData.description}</p> */}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card className="shadow-xl border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
					<CardHeader>
						<CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							日付を選択
						</CardTitle>
						<CardDescription>
							飲み会の開催日を選択してください ✨
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={setSelectedDate}
							disabled={(date) => date < new Date()}
							className="rounded-md border"
						/>
					</CardContent>
				</Card>

				<div className="space-y-6">
					<Card className="shadow-xl border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
						<CardHeader>
							<CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								時間を選択
							</CardTitle>
							<CardDescription>開始時間を選択してください</CardDescription>
						</CardHeader>
						<CardContent>
							<Select value={selectedTime} onValueChange={setSelectedTime}>
								<SelectTrigger>
									<SelectValue placeholder="時間を選択" />
								</SelectTrigger>
								<SelectContent>
									{timeOptions.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>

					{selectedDate && selectedTime && (
						<Card>
							<CardHeader>
								<CardTitle>確定内容</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm">
									<div>
										<span className="font-medium">イベント:</span> {partyName}
									</div>
									<div>
										<span className="font-medium">日付:</span>{' '}
										{selectedDate.toLocaleDateString('ja-JP')}
									</div>
									<div>
										<span className="font-medium">時間:</span> {selectedTime}
									</div>
									<div>
										<span className="font-medium">参加予定:</span>{' '}
										{partyData.count}名
									</div>
								</div>

								<Button
									className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg text-lg py-6"
									onClick={handleScheduleConfirm}
									disabled={isSubmitting}
								>
									<Send className="h-5 w-5 mr-2" />
									{isSubmitting ? '送信中...' : '日程を確定する'}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
			{submitState !== 'none' && (
				<div
					className={`mt-4 p-4 rounded-md ${
						submitState === 'true'
							? 'bg-green-50 text-green-800 border border-green-200'
							: 'bg-red-50 text-red-800 border border-red-200'
					}`}
				>
					<p className="font-medium">{message}</p>
				</div>
			)}
		</div>
	);
}
