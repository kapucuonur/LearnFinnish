// Payment handling with Stripe
import { auth } from './auth.js';
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();


// Initialize Stripe (loaded from index.html script)
let stripe;

export function initializeStripe(publishableKey) {
  if (window.Stripe) {
    stripe = window.Stripe(publishableKey);
  }
  // Silent return if not loaded yet (lazy loading)
}

// Check if user is premium
export async function checkPremiumStatus(userId) {
  const status = await getDetailedPremiumStatus(userId);
  return status.isPremium;
}

// Get detailed premium status (including trial information)
export async function getDetailedPremiumStatus(userId) {
  try {
    // Admin bypass
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === 'onurbenn@gmail.com') {
      console.log('Admin access granted');
      return { isPremium: true, isTrial: false };
    }

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const isPremium = data.isPremium || false;
      // Check for common trial indicators from Stripe/backend
      const isTrial = data.subscriptionStatus === 'trialing' ||
        data.isTrial === true ||
        (data.plan && data.plan.toLowerCase().includes('trial'));

      return { isPremium, isTrial };
    }
    return { isPremium: false, isTrial: false };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return { isPremium: false, isTrial: false };
  }
}

// Create checkout session and redirect to Stripe
export async function createCheckoutSession() {
  const user = auth.currentUser;

  if (!user) {
    return {
      success: false,
      error: 'Please sign in to make a payment!'
    };
  }

  // Lazy load check - try one more time if stripe isn't ready
  if (!stripe && window.Stripe) {
    // Re-import constant in a cleaner way if possible, or assume it was passed before.
    // Since we don't have the key here easily without passing it again, 
    // we rely on the fact that window.Stripe is now available and we can just use the global.
    // Ideally we should store the key, but for now let's just check if initializeStripe works.
    // Actually, initializeStripe store the instance. Let's try to init with the global if we can find it, 
    // BUT we don't have the key here.
    // BETTER APPROACH: Just check window.Stripe directly if the local var is null.
    // However, we need the KEY to init.
    // Let's assume the user calls initializeStripe in app.js.
    // If it failed there, it might work now. But we need the key.
    // Let's throw a helpful error.
    return {
      success: false,
      error: 'Payment system is still loading. Please try again in 5 seconds.'
    };
  } else if (!stripe) {
    return {
      success: false,
      error: 'Payment system failed to load. Please refresh the page.'
    };
  }

  try {
    // Call backend API to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        userId: user.uid,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: `Payment error: ${error.message}`
    };
  }
}

// Handle payment success/cancel from URL params
export function handlePaymentCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');

  if (paymentStatus === 'success') {
    showPaymentMessage(
      '🎉 Payment successful! Premium features activated.',
      'success'
    );
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  } else if (paymentStatus === 'cancelled') {
    showPaymentMessage(
      'Payment cancelled.',
      'info'
    );
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);
    return false;
  }

  return null;
}

// Show payment message to user
function showPaymentMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 16px 32px;
    background: ${type === 'success' ? '#4caf50' : '#2196f3'};
    color: white;
    border-radius: 12px;
    font-size: 1.1em;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideDown 0.3s ease-out;
  `;

  document.body.appendChild(messageDiv);

  // Remove after 5 seconds
  setTimeout(() => {
    messageDiv.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);