import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { db } from '@/lib/gcp/firebase';

export async function PUT(request: Request) {
	console.log('schedule update');
	const updates = await request.json();
	console.log('Received updates:', updates);
	try {
		const groupDocRef = db.collection('group').doc(updates.groupId);

		await groupDocRef.set(
			{
				partyName: updates.partyName,
				date: updates.date,
				time: updates.time,
				step: 3,
			},
			{ merge: true }
		);

		return NextResponse.json({
			status: 200,
			message: '日程確定成功',
		});
	} catch (error) {
		console.error('Error fetching groups:', error);
		// エラーレスポンスを返す
		return NextResponse.json({
			status: 500,
			message: '日程確定失敗',
		});
	}
}
