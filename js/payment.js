const stripe = Stripe('pk_test_YourStripePublicKey');

premiumBtn.onclick = () => {
  fetch('/api/create-checkout-session', {
    method: 'POST',
  })
  .then(res => res.json())
  .then(session => stripe.redirectToCheckout({ sessionId: session.id }));
};