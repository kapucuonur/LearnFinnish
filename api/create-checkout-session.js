import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email and userId are required' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID, // Set this in Vercel environment variables
        quantity: 1,
      }],
      mode: 'subscription',
      customer_email: email,
      client_reference_id: userId, // Firebase user ID
      metadata: {
        userId: userId,
        email: email,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL || process.env.VITE_PUBLIC_URL || 'https://learnfinnish.vercel.app'}/?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || process.env.VITE_PUBLIC_URL || 'https://learnfinnish.vercel.app'}/?payment=cancelled`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}