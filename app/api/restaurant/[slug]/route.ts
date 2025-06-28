import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/gcp/firebase';

export async function GET(
	request: NextRequest,
	// { params }: { params: { slug: string } }
	// context: { params: { slug: string } }
	{ params }: any
) {
	try {
		// const { slug } = context.params;
		const requestDocRef = db.collection('restaurant').doc(params.slug);

		const docSnap = await requestDocRef.get();

		if (docSnap.exists) {
			const shops = docSnap.data();

			return NextResponse.json({
				status: 200,
				message: '店リスト取得成功',
				data: shops,
			});
		} else {
			throw new Error('Shop data does not exist');
		}
	} catch (error) {
		console.error('Error fetching groups:', error);
		// エラーレスポンスを返す
		return NextResponse.json({
			status: 500,
			message: '店リスト取得失敗',
		});
	}
}
