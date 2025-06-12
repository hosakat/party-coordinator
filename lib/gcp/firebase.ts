import admin from 'firebase-admin';

// サービスアカウントのパスを指定
import serviceAccountJson from '../../sa-key.json';

const serviceAccount = {
	projectId: serviceAccountJson.project_id,
	clientEmail: serviceAccountJson.client_email,
	privateKey: serviceAccountJson.private_key,
};

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const db = admin.firestore();

export { db };
