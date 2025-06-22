import { db } from '@/lib/gcp/firebase';

export async function useCheckExistParty(partyId: string) {
	const groupDocRef = db.collection('group').doc(partyId);
	const doc = await groupDocRef.get();
	if (!doc.exists) {
		console.log('No such document!');
		return null;
	} else {
		console.log('Document data:', doc.data());
		return doc.data();
	}
}
