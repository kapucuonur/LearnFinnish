import { auth } from '../config/firebase.js';
import { db } from '../config/firebase.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid } = decodedToken;

        const userDoc = await db.collection('users').doc(uid).get();

        if (userDoc.exists && userDoc.data().isPremium) {
            return res.status(200).json({ isPremium: true });
        } else {
            return res.status(200).json({ isPremium: false });
        }
    } catch (error) {
        console.error('Error verifying token or checking premium status:', error);
        return res.status(401).json({ error: 'Unauthorized or failed to check premium status' });
    }
}
