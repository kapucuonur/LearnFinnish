// Usage Limit Modal Component
import { getUsageStats } from '../services/usageLimits.js';

export function initUsageLimitModal() {
  // Check if modal exists
  if (document.getElementById('usage-limit-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'usage-limit-modal';
  modal.className = 'modal hidden';
  modal.innerHTML = `
    <div class="modal-content limit-modal">
      <div class="modal-header">
        <h2 id="limit-modal-title">Daily Limit Reached</h2>
        <span class="close-modal">&times;</span>
      </div>
      <div class="modal-body">
        <div class="limit-icon">🔒</div>
        <p id="limit-modal-message">
            Your daily limit for free usage has been reached.
        </p>
        
        <div class="premium-upsell">
            <h3>Unlimited with Premium!</h3>
            <ul class="premium-benefits-list">
                <li>✓ Unlimited story generation</li>
                <li>✓ Unlimited flashcard practice</li>
                <li>✓ Text-to-speech feature</li>
                <li>✓ Ad-free experience</li>
            </ul>
        </div>
        
        <div class="modal-actions">
            <a href="https://buy.stripe.com/00waEX4D95ai0In6qv9oc00" target="_blank" class="btn btn-premium btn-block">
                🚀 Upgrade to Premium - €5.00/mo
            </a>
            <button class="btn btn-text close-modal-btn">Maybe Later</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  const closeBtns = modal.querySelectorAll('.close-modal, .close-modal-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

export function showUsageLimitModal(type = 'story') {
  const modal = document.getElementById('usage-limit-modal');
  if (!modal) {
    initUsageLimitModal();
    return showUsageLimitModal(type);
  }

  const messageEl = document.getElementById('limit-modal-message');

  if (type === 'story') {
    messageEl.textContent = 'You have reached your story generation limit for today. Try again tomorrow or go Premium!';
  } else if (type === 'flashcard') {
    messageEl.textContent = 'You have reached your flashcard usage limit for today. Try again tomorrow or go Premium!';
  }

  modal.classList.remove('hidden');
}
