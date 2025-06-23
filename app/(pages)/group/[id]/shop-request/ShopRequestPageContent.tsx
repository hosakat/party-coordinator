'use client';

import { useActionState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Store } from 'lucide-react';
import Link from 'next/link';
import { submitShopRequest } from './actions';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import React from 'react';

export default function ShopRequestPage({ groupId }: { groupId: string }) {
	const [state, action, isPending] = useActionState(submitShopRequest, null);

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<div className="mb-6">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
				>
					<ArrowLeft className="h-4 w-4" />
					飲み会一覧に戻る
				</Link>

				<div className="flex items-center gap-3 mb-2">
					<Store className="h-8 w-8 text-primary" />
					<h1 className="text-3xl font-bold">お店選び要望</h1>
				</div>
				<p className="text-muted-foreground">
					飲み会のお店選びに関するご要望をお聞かせください。
					いただいた情報を参考に、皆さんに喜んでいただけるお店を選定いたします。
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>要望入力フォーム</CardTitle>
					<CardDescription>
						お店選びの参考にさせていただくため、以下の情報をご入力ください
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">
								名前 <span className="text-red-500">*</span>
							</Label>
							<Input
								id="name"
								name="name"
								placeholder="山田太郎"
								required
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="nearestStation">最寄り駅</Label>
							<Input
								id="nearestStation"
								name="nearestStation"
								placeholder="新宿駅、渋谷駅など"
								// required
								disabled={isPending}
							/>
							<p className="text-sm text-muted-foreground">
								アクセスしやすい駅をお教えください
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="priceMin">価格帯下限</Label>
								<Select name="priceMin" defaultValue="0" disabled={isPending}>
									<SelectTrigger>
										<SelectValue placeholder="下限を選択" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">指定なし</SelectItem>
										<SelectItem value="1000">1,000円</SelectItem>
										<SelectItem value="1500">1,500円</SelectItem>
										<SelectItem value="2000">2,000円</SelectItem>
										<SelectItem value="2500">2,500円</SelectItem>
										<SelectItem value="3000">3,000円</SelectItem>
										<SelectItem value="3500">3,500円</SelectItem>
										<SelectItem value="4000">4,000円</SelectItem>
										<SelectItem value="4500">4,500円</SelectItem>
										<SelectItem value="5000">5,000円</SelectItem>
										<SelectItem value="6000">6,000円</SelectItem>
										<SelectItem value="7000">7,000円</SelectItem>
										<SelectItem value="8000">8,000円</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="priceMax">価格帯上限</Label>
								<Select name="priceMax" defaultValue="0" disabled={isPending}>
									<SelectTrigger>
										<SelectValue placeholder="上限を選択" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">指定なし</SelectItem>
										<SelectItem value="2000">2,000円</SelectItem>
										<SelectItem value="2500">2,500円</SelectItem>
										<SelectItem value="3000">3,000円</SelectItem>
										<SelectItem value="3500">3,500円</SelectItem>
										<SelectItem value="4000">4,000円</SelectItem>
										<SelectItem value="4500">4,500円</SelectItem>
										<SelectItem value="5000">5,000円</SelectItem>
										<SelectItem value="5500">5,500円</SelectItem>
										<SelectItem value="6000">6,000円</SelectItem>
										<SelectItem value="7000">7,000円</SelectItem>
										<SelectItem value="8000">8,000円</SelectItem>
										<SelectItem value="10000">10,000円</SelectItem>
										<SelectItem value="12000">12,000円</SelectItem>
										<SelectItem value="15000">15,000円以上</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<p className="text-sm text-muted-foreground">
							一人当たりの予算の目安をお選びください（飲み放題込みの場合は含めた金額）
						</p>

						<div className="space-y-2">
							<Label htmlFor="shopRequests">お店選びにおける要望</Label>
							<Textarea
								id="shopRequests"
								name="shopRequests"
								placeholder={`例：
・個室があると嬉しいです
・和食が好みです
・予算は一人4000円程度希望
・静かな環境で話せるお店が良い
・駅から徒歩5分以内だと助かります`}
								rows={6}
								disabled={isPending}
							/>
							<p className="text-sm text-muted-foreground">
								お店の雰囲気、料理のジャンル、予算、立地など、ご希望があればお書きください
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="allergiesAndDislikes">
								苦手な食べ物・アレルギーなど
							</Label>
							<Textarea
								id="allergiesAndDislikes"
								name="allergiesAndDislikes"
								placeholder={`例：
・エビ・カニアレルギーがあります
・辛い食べ物が苦手です
・生魚が食べられません
`}
								rows={4}
								disabled={isPending}
							/>
							<p className="text-sm text-muted-foreground">
								食物アレルギーや苦手な食べ物があれば、安全のためお教えください
							</p>
						</div>

						<input hidden name="groupId" value={groupId ?? ''} readOnly />

						<Button type="submit" className="w-full" disabled={isPending}>
							<Send className="h-4 w-4 mr-2" />
							{isPending ? '送信中...' : '要望を送信'}
						</Button>
					</form>

					{state && (
						<div
							className={`mt-4 p-4 rounded-md ${
								state.success
									? 'bg-green-50 text-green-800 border border-green-200'
									: 'bg-red-50 text-red-800 border border-red-200'
							}`}
						>
							<p className="font-medium">{state.message}</p>
							{state.success && (
								<div className="mt-2">
									<Link href="/">
										<Button variant="outline" size="sm">
											飲み会一覧に戻る
										</Button>
									</Link>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
				<h3 className="font-semibold text-blue-900 mb-2">
					💡 お店選びのポイント
				</h3>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>• アレルギー情報は安全のため必ずお教えください</li>
					<li>• 予算の目安があると選定しやすくなります</li>
					<li>• アクセスの良い場所をご希望の場合は最寄り駅をお書きください</li>
					<li>• 個室希望、禁煙席希望などの環境面のご要望もお聞かせください</li>
				</ul>
			</div>
		</div>
	);
}
