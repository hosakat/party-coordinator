import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { db } from '@/lib/gcp/firebase';
import admin from 'firebase-admin';

export async function POST(request: Request) {
	console.log('shop request update');
	const data = await request.json();
	console.log('Received updates:', data);
	try {
		const requestDocRef = db.collection('shop-request').doc(data.groupId);

		// await requestDocRef.update({
		// 	requestList: admin.firestore.FieldValue.arrayUnion({
		// 		memberName: data.memberName,
		// 		station: data.station,
		// 		allergy: data.allergy,
		// 		maxPrice: data.maxPrice,
		// 		minPrice: data.minPrice,
		// 	}),
		// });

		const docSnap = await requestDocRef.get();

		let currentList = [];

		if (docSnap.exists) {
			const data = docSnap.data();
			currentList = Array.isArray(data?.requestList) ? data.requestList : [];
		}

		const requestList = {
			memberName: data.memberName,
			station: data.station,
			allergy: data.allergy,
			maxPrice: data.maxPrice,
			minPrice: data.minPrice,
		};

		currentList.push(requestList); // 新しいオブジェクトを追加

		await requestDocRef.set({ requestList: currentList }, { merge: true });

		return NextResponse.json({
			status: 200,
			message: '要望追加成功',
		});
	} catch (error) {
		console.error('Error fetching groups:', error);
		// エラーレスポンスを返す
		return NextResponse.json({
			status: 500,
			message: '要望追加失敗',
		});
	}
}
