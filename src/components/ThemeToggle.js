// Theme Toggle Component
export function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        // Add transitioning class to prevent flash
        document.body.classList.add('theme-transitioning');

        // Set theme
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update icon
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }

        // Update button aria-label
        if (themeToggle) {
            const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', label);
        }

        // Remove transitioning class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }
}

// Initialize theme on page load (before DOM ready to prevent flash)
(function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();
