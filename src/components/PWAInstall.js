// PWA Install Component

let deferredPrompt;

export function initPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.id = 'pwa-install-btn';
        installBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 14px 28px;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 1em;
      z-index: 1000;
      box-shadow: var(--shadow-xl);
      cursor: pointer;
      transition: all var(--transition-base);
    `;

        installBtn.onclick = () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User installed the app');
                }
                installBtn.style.display = 'none';
            });
        };

        installBtn.onmouseenter = () => {
            installBtn.style.transform = 'translateX(-50%) translateY(-2px)';
        };

        installBtn.onmouseleave = () => {
            installBtn.style.transform = 'translateX(-50%) translateY(0)';
        };

        document.body.appendChild(installBtn);
    });
}
