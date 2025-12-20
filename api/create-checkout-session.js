import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_YourPriceID', // Stripe dashboard'da oluştur
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://learnfinnish-qtut72hr8-kapucuonurs-projects.vercel.app//success',
    cancel_url: 'https://learnfinnish-qtut72hr8-kapucuonurs-projects.vercel.app//',
  });

  res.status(200).json({ id: session.id });
}