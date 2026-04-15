import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email and userId are required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      customer_email: email,
      client_reference_id: userId,
      metadata: { userId, email },
      success_url: `${process.env.PUBLIC_URL || 'https://learn-finnish.com'}/?payment=success`,
      cancel_url: `${process.env.PUBLIC_URL || 'https://learn-finnish.com'}/?payment=cancelled`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
