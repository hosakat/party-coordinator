import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	MapPin,
	JapaneseYenIcon as Yen,
	ExternalLink,
	Star,
} from 'lucide-react';
import Link from 'next/link';
import { ApiResponse } from '@/common/types/apiResponse';

// 飲食店データの型定義
type Restaurant = {
	name: string;
	station: string;
	budget: string;
	summary: string;
	mapUrl?: string; // Google MapsのURLをオプションで追加
};

type RestaurantGroup = {
	shops: Restaurant[];
};

// Google Maps URLを生成する関数
function generateGoogleMapsUrl(
	restaurantName: string,
	station: string
): string {
	const query = encodeURIComponent(`${restaurantName} ${station}`);
	return `https://www.google.com/maps/search/${query}`;
}

// 価格帯に応じた色を返す関数
function getBudgetColor(budget: string): string {
	// 正規表現で「〜」と「円」に挟まれた数字（カンマ付き）を取得
	const match = budget.match(/～\s*([\d,]+)円/);

	if (match) {
		const price = parseInt(match[1].replace(/,/g, ''), 10);
		if (price <= 3000) return 'bg-green-100 text-green-800';
		if (price <= 5000) return 'bg-blue-100 text-blue-800';
		if (price <= 8000) return 'bg-yellow-100 text-yellow-800';
		return 'bg-red-100 text-red-800';
	} else {
		return 'bg-gray-100 text-gray-800';
	}
}

export default async function RestaurantsPage() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_APL_URL}/api/restaurant/group1`,
		{
			method: 'GET',
		}
	);
	const result = (await response.json()) as ApiResponse<RestaurantGroup>;
	console.log('Fetched restaurants:', result);
	if (result.status !== 200) {
		throw new Error(`飲食店データの取得に失敗しました: ${result.message}`);
	}
	const restaurants = result.data.shops;
	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
						<Star className="h-8 w-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
						おすすめ飲食店
					</h1>
				</div>
				<p className="text-muted-foreground text-lg">
					飲み会にぴったりな厳選されたお店をご紹介！
					みんなで楽しい時間を過ごしましょう 🎊
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{restaurants.map((restaurant) => (
					<Card
						key={restaurant.name}
						className="hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-200 bg-gradient-to-br from-white to-yellow-50"
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<CardTitle className="text-xl mb-2">
										{restaurant.name}
									</CardTitle>
									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
										<MapPin className="h-4 w-4" />
										<span>{restaurant.station}周辺</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Yen className="h-4 w-4 text-muted-foreground" />
								<Badge
									className={getBudgetColor(restaurant.budget)}
									variant="secondary"
								>
									{restaurant.budget}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-sm leading-relaxed mb-4">
								{restaurant.summary}
							</CardDescription>

							<div className="space-y-2">
								<Button
									asChild
									variant="outline"
									className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-lg"
									size="sm"
								>
									<Link
										href={generateGoogleMapsUrl(
											restaurant.name,
											restaurant.station
										)}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4 mr-2" />
										Google Mapで場所を確認
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 shadow-lg">
				<h3 className="font-bold text-amber-900 mb-3 text-lg">
					📍 お店選びのヒント
				</h3>
				<ul className="text-sm text-amber-800 space-y-2">
					<li>
						• 💰 価格帯は一人当たりの目安です（飲み放題込みの場合が多いです）
					</li>
					<li>• 📞 事前に予約を取ることをおすすめします</li>
					<li>• 🗺️ Google Mapで実際の場所や口コミもご確認ください</li>
					<li>
						• 🚨 アレルギーや苦手な食べ物がある場合は事前にお店に相談しましょう
					</li>
				</ul>
			</div>
		</div>
	);
}
