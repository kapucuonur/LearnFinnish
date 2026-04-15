import { Router } from 'express';
import Stripe from 'stripe';
import { auth, db } from '../config/firebase.js';

const router = Router();

router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists || !userDoc.data().customerId) {
      return res.status(404).json({ error: 'User does not have a Stripe Customer ID' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userDoc.data().customerId,
      return_url: process.env.PUBLIC_URL || 'https://learn-finnish.com',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;
