import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { db } from '../../../lib/gcp/firebase';

export async function GET(req: NextApiRequest) {
	console.log('Received request:', req, req.url);
	try {
		const snapshot = await db.collection('group').get();
		const group = snapshot.docs.map((doc) => doc.data());
		console.log('Fetched groups:', group);
		return NextResponse.json({
			status: 200,
			message: 'Group読み取り成功',
			data: group,
		});
	} catch (error) {
		console.error('Error fetching groups:', error);
		// エラーレスポンスを返す
		return NextResponse.json({
			status: 500,
			message: 'Group読み取り失敗',
		});
	}
}
