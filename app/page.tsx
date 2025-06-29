import Link from 'next/link';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Calendar,
	Store,
	Utensils,
	Users,
	ArrowRight,
	Sparkles,
} from 'lucide-react';

export default function HomePage() {
	return (
		<div className="container mx-auto p-6">
			{/* ヒーローセクション */}
			<div className="text-center mb-12">
				<div className="mb-6">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
						🍻 飲み会幹事 イイカンジ 🍻
					</h1>
					<p className="text-xl text-muted-foreground mb-2">
						飲み会の企画・幹事をサポートするアプリです
					</p>
					<p className="text-lg text-muted-foreground mb-2">
						日程調整からお店選びまで、すべてをスムーズに！ ✨
					</p>
					<p className="text-md text-muted-foreground">
						※この画面はユーザーからは基本的には見えない説明用の画面になります。
					</p>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg mb-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						🎉 このアプリでできること
					</h2>
					<div className="grid md:grid-cols-2 gap-4 text-left">
						{/* <div className="flex items-start gap-3">
							<div className="p-2 bg-blue-500 rounded-full">
								<Calendar className="h-5 w-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-800">日程管理</h3>
								<p className="text-sm text-gray-600">
									飲み会の企画から日程確定まで一括管理
								</p>
							</div>
						</div> */}
						<div className="flex items-start gap-3">
							<div className="p-2 bg-green-500 rounded-full">
								<Store className="h-5 w-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-800">要望収集</h3>
								<p className="text-sm text-gray-600">
									参加者の要望やアレルギー情報を事前収集
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="p-2 bg-yellow-500 rounded-full">
								<Utensils className="h-5 w-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-800">お店選び</h3>
								<p className="text-sm text-gray-600">
									おすすめ飲食店の情報とマップ連携
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="p-2 bg-purple-500 rounded-full">
								<Sparkles className="h-5 w-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-800">
									自動通知・リマインド
								</h3>
								<p className="text-sm text-gray-600">
									幹事としてのファシリテーションのための、LINEへの自動メッセージ送信
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 機能カード */}
			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
				{/* 飲み会管理 */}

				{/* 日程確定 */}
				<Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 bg-gradient-to-br from-white to-green-50">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
								<Calendar className="h-6 w-6 text-white" />
							</div>
							<CardTitle className="text-2xl">📅 日程確定</CardTitle>
						</div>
						<CardDescription className="text-base">
							カレンダーで日程を選択し、確定後は自動でメッセージ送信。スムーズな日程調整が可能です。
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 mb-6">
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>カレンダーでの日付選択</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>時間帯の選択機能</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>確定内容のプレビュー</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>確定を受けてLINEへの自動メッセージ送信機能</span>
							</div>
						</div>
						<Link href={`/group/${process.env.SAMPLE_GROUP_ID}/schedule`}>
							<Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
								サンプル画面を見る
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* お店選び要望 */}
				<Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 bg-gradient-to-br from-white to-orange-50">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full">
								<Store className="h-6 w-6 text-white" />
							</div>
							<CardTitle className="text-2xl">🍽️ お店選び要望</CardTitle>
						</div>
						<CardDescription className="text-base">
							参加者の要望やアレルギー情報を事前に収集。みんなが満足できるお店選びをサポートします。
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 mb-6">
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
								<span>最寄り駅の入力</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
								<span>価格帯やお店の要望の入力</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
								<span>アレルギー・苦手な食べ物の登録</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
								<span>
									お店選びAIエージェントサービスへのリクエスト項目になる
								</span>
							</div>
						</div>
						<Link href={`/group/${process.env.SAMPLE_GROUP_ID}/shop-request`}>
							<Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg">
								サンプル画面を見る
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* おすすめ飲食店 */}
				<Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
								<Utensils className="h-6 w-6 text-white" />
							</div>
							<CardTitle className="text-2xl">⭐ おすすめ飲食店</CardTitle>
						</div>
						<CardDescription className="text-base">
							洗練されたAIエージェントにより厳選された飲食店の情報を確認。価格帯や特徴、Google
							Mapsとの連携で場所も簡単チェック。
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 mb-6">
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
								<span>厳選されたお店の一覧表示</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
								<span>価格帯・最寄り駅の情報</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
								<span>お店の特徴・おすすめポイント</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
								<span>Google Maps連携機能</span>
							</div>
						</div>
						<Link href={`/group/${process.env.SAMPLE_GROUP_ID}/restaurants`}>
							<Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg">
								サンプル画面を見る
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* 使い方の流れ */}
			<div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
				<h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
					🚀 使い方の流れ
				</h2>
				<div className="grid md:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
							1
						</div>
						<h3 className="font-semibold text-gray-800 mb-2">
							LINEグループに「イイカンジ」を招待
						</h3>
						<p className="text-sm text-gray-600">
							飲み会用LINEグループにLINE公式アカウント「イイカンジ」を招待する（詳細は下欄）
						</p>
						<p className="text-sm text-gray-600">
							あとはイイカンジがメッセージを送ってくれるので、そのリクエストに答えていくだけ
						</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
							2
						</div>
						<h3 className="font-semibold text-gray-800 mb-2">日程確定</h3>
						<p className="text-sm text-gray-600">
							日程を調整し、アプリの日程入力で決まった日程を送信する
						</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
							3
						</div>
						<h3 className="font-semibold text-gray-800 mb-2">要望を収集</h3>
						<p className="text-sm text-gray-600">
							参加者にお店選びの要望を入力してもらう
						</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
							4
						</div>
						<h3 className="font-semibold text-gray-800 mb-2">お店を選択</h3>
						<p className="text-sm text-gray-600">
							おすすめ飲食店から最適なお店を選んで予約する
						</p>
					</div>
				</div>
			</div>

			{/* LINE公式アカウント案内 */}
			<div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg text-center">
				<h2 className="text-2xl font-bold text-green-800 mb-4">
					📱 LINE公式アカウントを友達登録＆招待！
				</h2>
				<p className="text-lg text-green-700 mb-6">
					まずはこちらのQRコードから公式LINEアカウント「イイカンジ」を友達登録して、
					<br />
					飲み会の参加者グループに招待してください！
				</p>

				<div className="flex flex-col items-center gap-6">
					{/* QRコード */}
					<div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-300">
						<div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-400">
							{/* <img src="/M_gainfriends_2dbarcodes_GW.png" /> */}
							<img src="https://qr-official.line.me/gs/M_604lkalu_GW.png?oat_content=qr"></img>
						</div>
					</div>

					{/* 説明テキスト */}
					<div className="bg-white p-4 rounded-xl border-2 border-green-200 max-w-md">
						<h3 className="font-bold text-green-800 mb-2">
							🎉 LINEでもっと便利に！
						</h3>
						<ul className="text-sm text-green-700 space-y-1 text-left">
							<li>• 📅 日程確定の自動通知</li>
							<li>• 🍽️ お店情報の共有</li>
							<li>• 💬 参加者同士のコミュニケーション</li>
							<li>• 📝 リマインダー機能</li>
						</ul>
					</div>
				</div>

				<p className="text-sm text-green-600 mt-4">
					※ QRコードを読み取って友達登録後、飲み会グループへ招待をしてください
				</p>
			</div>
		</div>
	);
}
