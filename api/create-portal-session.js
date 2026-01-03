import Stripe from 'stripe';
import { auth } from '../config/firebase.js';
import { db } from '../config/firebase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
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

        if (!userDoc.exists || !userDoc.data().customerId) {
            return res.status(404).json({ error: 'User does not have a Stripe Customer ID' });
        }

        const { customerId } = userDoc.data();

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: 'https://learn-finnish.fi', // Or dynamic based on origin
        });

        return res.status(200).json({ url: session.url });

    } catch (error) {
        console.error('Error creating portal session:', error);
        return res.status(500).json({ error: 'Failed to create portal session' });
    }
}
