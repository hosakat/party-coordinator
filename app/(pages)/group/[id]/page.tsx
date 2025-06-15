import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

export default async function SchedulePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<div>
			<h2>飲み会名：あああ(更新できるようにする)</h2>
			<p>グループ名: {id}</p>
			<p>ここにスケジュール管理のコンテンツを表示します。</p>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card key={id} className="hover:shadow-lg transition-shadow">
					<div className="pt-4">
						<Link href={`/group/${id}/schedule`}>
							<Button className="w-full">日程を確定する</Button>
						</Link>
					</div>
				</Card>
			</div>
		</div>
	);
}
