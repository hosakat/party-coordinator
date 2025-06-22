'use server';

import { group } from 'console';

interface ShopRequestData {
	groupId: string;
	memberName: string;
	station: string;
	request: string;
	allergy: string;
	minPrice: string;
	maxPrice: string;
}

export async function submitShopRequest(_prevState: any, formData: FormData) {
	// フォームデータを取得
	const data: ShopRequestData = {
		groupId: formData.get('groupId') as string,
		memberName: formData.get('name') as string,
		station: formData.get('nearestStation') as string,
		request: formData.get('shopRequests') as string,
		allergy: formData.get('allergiesAndDislikes') as string,
		minPrice: formData.get('priceMin') as string,
		maxPrice: formData.get('priceMax') as string,
	};

	// バリデーション
	if (!data.memberName.trim()) {
		return { success: false, message: '名前を入力してください' };
	}

	// if (!data.nearestStation.trim()) {
	// 	return { success: false, message: '最寄り駅を入力してください' };
	// }

	try {
		// DBに要望を登録
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APL_URL}/api/shop-request/insert/${data.groupId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					groupId: data.groupId,
					memberName: data.memberName,
					station: data.station,
					allergy: data.allergy,
					maxPrice: data.maxPrice,
					minPrice: data.minPrice,
				}),
			}
		);

		if (response.status !== 200) {
			throw new Error(
				`要望の登録に失敗しました。エラー：${response.statusText}`
			);
		}
		return {
			success: true,
			message: `要望を受け付けました！お店選びの参考にさせていただきます。`,
		};
	} catch (error) {
		console.error(error);
		return { success: false, message: '要望のDB登録に失敗しました' };
	}
}
