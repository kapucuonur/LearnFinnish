const stripe = Stripe('pk_test_51RPSymGBPXxMTpubh4D982BiRPiBOXBxOGBLoBiSeWhrkAv2Ou9a2HAmkchbKktJXkpWYtcL307gdgT4PXWxRAc500tdraauMa');

premiumBtn.onclick = () => {
  fetch('/api/create-checkout-session', {
    method: 'POST',
  })
  .then(res => res.json())
  .then(session => stripe.redirectToCheckout({ sessionId: session.id }));
};