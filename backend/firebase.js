const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You can provide credentials via:
// 1. A service account JSON file (set GOOGLE_APPLICATION_CREDENTIALS env var to the path)
// 2. Individual env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
// 3. In production on Google Cloud / Firebase Hosting: automatic credential resolution

let app;

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/^"|"$|^'|'$/g, '').replace(/\\n/g, '\n')
        : undefined;

    if (projectId && clientEmail && privateKey) {
        // Use service account credentials from env vars
        app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Use service account JSON file
        app = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    } else {
        console.error(
            '⚠️  Firebase: Credentials missing. Debug info:\n' +
            `- FIREBASE_PROJECT_ID exists: ${!!process.env.FIREBASE_PROJECT_ID}\n` +
            `- FIREBASE_CLIENT_EMAIL exists: ${!!process.env.FIREBASE_CLIENT_EMAIL}\n` +
            `- FIREBASE_PRIVATE_KEY exists: ${!!process.env.FIREBASE_PRIVATE_KEY}\n` +
            'Please ensure these exact keys are saved in your Render Environment Variables.'
        );
        // Still initialize with project ID so errors are descriptive
        app = admin.initializeApp({
            projectId: projectId || 'tourify-app',
        });
    }
} else {
    app = admin.apps[0];
}

const db = admin.firestore();

module.exports = { admin, db };
