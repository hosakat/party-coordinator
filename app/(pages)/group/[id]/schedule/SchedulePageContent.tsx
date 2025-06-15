'use client';

import { useState } from 'react';
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
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { sendScheduleNotification } from './actions';
import React from 'react';

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
};

export default function SchedulePageContent({ partyId }: { partyId: string }) {
	console.log('partyId:', partyId);
	// const { partyId } = await params;
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<Date>();
	const [selectedTime, setSelectedTime] = useState<string>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const nomikai = nomikaiData[partyId as unknown as keyof typeof nomikaiData];

	if (!nomikai) {
		return <div>飲み会が見つかりません</div>;
	}

	const handleGroupApiRequest = async () => {
		try {
			const res = await fetch('/api/group', {
				method: 'GET',
			});
			if (!res.ok) throw new Error('APIリクエスト失敗');
			const data = await res.json();
			alert('グループAPIリクエスト成功: ' + JSON.stringify(data));
		} catch (error) {
			alert('グループAPIリクエスト失敗: ' + error);
		}
	};

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

			await sendScheduleNotification({
				groupId: partyId,
				title: nomikai.title,
				date: scheduledDateTime.toLocaleDateString('ja-JP'),
				time: selectedTime,
				participants: nomikai.participants,
			});

			// 成功後、一覧画面に戻る
			router.push('/');
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
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
				>
					<ArrowLeft className="h-4 w-4" />
					飲み会一覧に戻る
				</Link>

				<div className="flex items-center gap-3 mb-2">
					<h1 className="text-3xl font-bold">{nomikai.title}</h1>
					<Badge variant="secondary">日程調整中</Badge>
				</div>
				<p className="text-muted-foreground">{nomikai.description}</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>日付を選択</CardTitle>
						<CardDescription>飲み会の開催日を選択してください</CardDescription>
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
					<Card>
						<CardHeader>
							<CardTitle>時間を選択</CardTitle>
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
										<span className="font-medium">イベント:</span>{' '}
										{nomikai.title}
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
										{nomikai.participants}名
									</div>
								</div>

								<Button
									className="w-full mt-4"
									onClick={handleScheduleConfirm}
									disabled={isSubmitting}
								>
									<Send className="h-4 w-4 mr-2" />
									{isSubmitting ? '送信中...' : '日程を確定してメッセージ送信'}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
			<div className="mb-4">
				<Button onClick={handleGroupApiRequest} variant="outline">
					グループAPIリクエスト
				</Button>
			</div>
		</div>
	);
}
