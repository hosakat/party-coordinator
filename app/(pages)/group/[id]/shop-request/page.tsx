import React from 'react';
import ShopRequestPageContent from './ShopRequestPageContent';

export default async function ShopRequestPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <ShopRequestPageContent groupId={id} />;
}
