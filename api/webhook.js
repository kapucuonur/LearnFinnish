import Stripe from 'stripe';
import { db } from './config/firebase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const config = {
    api: {
        bodyParser: false, // Stripe requires raw body for signature verification
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Get raw body
        const rawBody = await getRawBody(req);

        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.metadata.userId || session.client_reference_id;

                if (userId) {
                    // Mark user as premium in Firestore
                    await db.collection('users').doc(userId).set({
                        isPremium: true,
                        subscriptionId: session.subscription,
                        customerId: session.customer,
                        email: session.customer_email,
                        premiumSince: new Date(),
                    }, { merge: true });

                    console.log(`User ${userId} upgraded to premium`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;

                // Find user by subscription ID and remove premium status
                const usersRef = db.collection('users');
                const snapshot = await usersRef.where('subscriptionId', '==', subscription.id).get();

                if (!snapshot.empty) {
                    const batch = db.batch();
                    snapshot.forEach(doc => {
                        batch.update(doc.ref, {
                            isPremium: false,
                            subscriptionCancelledAt: new Date(),
                        });
                    });
                    await batch.commit();
                    console.log(`Subscription ${subscription.id} cancelled`);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;

                // Update subscription status
                const usersRef = db.collection('users');
                const snapshot = await usersRef.where('subscriptionId', '==', subscription.id).get();

                if (!snapshot.empty) {
                    const batch = db.batch();
                    snapshot.forEach(doc => {
                        batch.update(doc.ref, {
                            isPremium: subscription.status === 'active',
                            subscriptionStatus: subscription.status,
                        });
                    });
                    await batch.commit();
                    console.log(`Subscription ${subscription.id} updated to ${subscription.status}`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: error.message });
    }
}

// Helper function to get raw body
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}
