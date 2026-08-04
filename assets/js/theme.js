/**
 * THEME MANAGER
 * Software Engineer Portfolio
 *
 * Handles dark/light mode toggling with:
 * - System preference detection
 * - LocalStorage persistence
 * - Smooth transitions
 * - Bootstrap theme integration
 */

(function () {
  'use strict';

  // =========================================================
  // CONFIGURATION
  // =========================================================
  const CONFIG = {
    storageKey: 'portfolio-theme',
    themes: ['light', 'dark'],
    defaultTheme: 'light',
    transitionDuration: 250,
  };

  // =========================================================
  // THEME MANAGER CLASS
  // =========================================================
  class ThemeManager {
    constructor() {
      this.currentTheme = null;
      this.toggleButton = document.getElementById('theme-toggle');
      this.init();
    }

    /**
     * Initialize the theme manager
     */
    init() {
      // Get initial theme
      this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

      // Apply theme
      this.applyTheme(this.currentTheme);

      // Set up event listeners
      this.bindEvents();

      // Listen for system theme changes
      this.watchSystemTheme();
    }

    /**
     * Get stored theme from localStorage
     * @returns {string|null}
     */
    getStoredTheme() {
      try {
        return localStorage.getItem(CONFIG.storageKey);
      } catch (e) {
        console.warn('LocalStorage not available:', e);
        return null;
      }
    }

    /**
     * Get system theme preference
     * @returns {string}
     */
    getSystemTheme() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return CONFIG.defaultTheme;
    }

    /**
     * Store theme in localStorage
     * @param {string} theme
     */
    storeTheme(theme) {
      try {
        localStorage.setItem(CONFIG.storageKey, theme);
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }

    /**
     * Apply theme to the document
     * @param {string} theme
     */
    applyTheme(theme) {
      // Update Bootstrap theme attribute on <html>
      document.documentElement.setAttribute('data-bs-theme', theme);

      // Update custom CSS variables if needed
      this.updateCSSVariables(theme);

      // Update toggle button icon
      this.updateToggleIcon(theme);

      // Update meta theme-color
      this.updateMetaThemeColor(theme);

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

      this.currentTheme = theme;
    }

    /**
     * Update CSS custom properties based on theme
     * @param {string} theme
     */
    updateCSSVariables(theme) {
      const root = document.documentElement;

      if (theme === 'dark') {
        root.style.setProperty('--color-bg', '#0d1117');
        root.style.setProperty('--color-surface', '#161b22');
        root.style.setProperty('--color-text', '#c9d1d9');
      } else {
        root.style.setProperty('--color-bg', '#ffffff');
        root.style.setProperty('--color-surface', '#ffffff');
        root.style.setProperty('--color-text', '#212529');
      }
    }

    /**
     * Update toggle button icon
     * @param {string} theme
     */
    updateToggleIcon(theme) {
      if (!this.toggleButton) return;

      const icon = this.toggleButton.querySelector('i');
      if (icon) {
        const lightLabel = this.toggleButton.getAttribute('data-label-light');
        const darkLabel = this.toggleButton.getAttribute('data-label-dark');
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          if (lightLabel) {
            this.toggleButton.setAttribute('aria-label', lightLabel);
            this.toggleButton.setAttribute('title', lightLabel);
          }
        } else {
          icon.className = 'bi bi-moon-fill';
          if (darkLabel) {
            this.toggleButton.setAttribute('aria-label', darkLabel);
            this.toggleButton.setAttribute('title', darkLabel);
          }
        }
      }
    }

    /**
     * Update meta theme-color for mobile browsers
     * @param {string} theme
     */
    updateMetaThemeColor(theme) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }

      metaThemeColor.content = theme === 'dark' ? '#0d1117' : '#0d6efd';
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.storeTheme(newTheme);
      this.applyTheme(newTheme);
    }

    /**
     * Set a specific theme
     * @param {string} theme
     */
    setTheme(theme) {
      if (!CONFIG.themes.includes(theme)) {
        console.warn(`Invalid theme: ${theme}. Valid themes: ${CONFIG.themes.join(', ')}`);
        return;
      }

      this.storeTheme(theme);
      this.applyTheme(theme);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
      // Toggle button click
      if (this.toggleButton) {
        this.toggleButton.addEventListener('click', () => this.toggle());
      }

      // Keyboard shortcut (Ctrl/Cmd + Shift + D)
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggle();
        }
      });
    }

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
      if (!window.matchMedia) return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    /**
     * Get current theme
     * @returns {string}
     */
    getCurrentTheme() {
      return this.currentTheme;
    }

    /**
     * Check if current theme is dark
     * @returns {boolean}
     */
    isDark() {
      return this.currentTheme === 'dark';
    }

    /**
     * Check if current theme is light
     * @returns {boolean}
     */
    isLight() {
      return this.currentTheme === 'light';
    }
  }

  // =========================================================
  // INITIALIZE
  // =========================================================
  // Create global theme manager instance
  window.PortfolioTheme = new ThemeManager();

  // Re-apply toggle icon once the renderer has populated the i18n labels.
  window.addEventListener('portfolio:rendered', () => {
    if (window.PortfolioTheme && typeof window.PortfolioTheme.currentTheme === 'string') {
      window.PortfolioTheme.updateToggleIcon(window.PortfolioTheme.currentTheme);
    }
  });

  // Export for module usage
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
  }

})();
