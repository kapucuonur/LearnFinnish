import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../config/firebase.js';

const router = Router();

// ⚠️ This route receives raw Buffer body (set in server.js via express.raw())
router.post('/', async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // req.body is a raw Buffer here (set by express.raw() in server.js)
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId || session.client_reference_id;
        if (userId) {
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
        const sub = event.data.object;
        const snapshot = await db.collection('users').where('subscriptionId', '==', sub.id).get();
        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.forEach(doc => batch.update(doc.ref, { isPremium: false, subscriptionCancelledAt: new Date() }));
          await batch.commit();
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const snapshot = await db.collection('users').where('subscriptionId', '==', sub.id).get();
        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.forEach(doc => batch.update(doc.ref, {
            isPremium: sub.status === 'active',
            subscriptionStatus: sub.status,
          }));
          await batch.commit();
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
});

export default router;
