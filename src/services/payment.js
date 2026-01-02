// Payment handling with Stripe
import { auth } from './auth.js';
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();


// Initialize Stripe (loaded from index.html script)
let stripe;

export function initializeStripe(publishableKey) {
  if (window.Stripe) {
    stripe = window.Stripe(publishableKey);
  } else {
    console.error('Stripe.js not loaded');
  }
}

// Check if user is premium
export async function checkPremiumStatus(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().isPremium || false;
    }
    return false;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
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