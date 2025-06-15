import React from 'react';
import SchedulePageContent from './SchedulePageContent';

export default async function SchedulePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <SchedulePageContent partyId={id} />;
}
