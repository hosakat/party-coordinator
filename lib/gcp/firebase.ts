import admin from 'firebase-admin';

// サービスアカウントのパスを指定
// import serviceAccountJson from '../../sa-key.json';
import serviceAccountJson from '../../firebase-adminsdk.json' assert { type: 'json' };

const serviceAccount = {
	projectId: serviceAccountJson.project_id,
	clientEmail: serviceAccountJson.client_email,
	privateKey: serviceAccountJson.private_key,
};

// console.log('Firebase service account:', serviceAccount);

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(
			serviceAccountJson as admin.ServiceAccount
		),
	});
}

const db = admin.firestore();

export { db };
