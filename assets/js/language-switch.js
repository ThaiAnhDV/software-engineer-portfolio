/**
 * Language Switch Component
 * --------------------------------------------------------------
 * UI controller for the navbar language switch. Discovers every
 * [data-language-switch] container (desktop + mobile drawer), wires
 * each option's click and keyboard activation, and keeps every
 * instance in sync with the active language via LanguageProvider.
 *
 * Responsibilities:
 *   - Mount every [data-language-switch] in the document.
 *   - Reflect the active language in aria-pressed + .is-active.
 *   - Forward user clicks to LanguageService.changeLanguage().
 *   - Re-sync the UI whenever the Provider fires (e.g. when the
 *     language is changed by a future external control).
 *
 * Constraints honored:
 *   - Pure DOM, no framework, no Bootstrap JS dependency.
 *   - Calls LanguageService.changeLanguage() only; no duplicated
 *     persistence / detection / loading logic.
 *   - LanguageService / LanguageProvider files are NOT modified.
 *
 * Public API (window.LanguageSwitch):
 *   init()                    — explicit re-init (no-op if already mounted).
 *   getContainers(): NodeList
 *   getActiveLanguage(): string
 */
(function () {
  'use strict';

  const SWITCH_SELECTOR = '[data-language-switch]';
  const OPTION_SELECTOR = '[data-language-option]';
  const ACTIVE_CLASS = 'is-active';

  class LanguageSwitch {

    constructor() {
      this._containers = [];
      this._provider = null;
      this._unsubscribe = null;
      this._mounted = false;
    }

    /** Initialize the component. Safe to call multiple times. */
    init() {
      if (this._mounted) return;
      this._provider = (window.LanguageService && window.LanguageService._provider)
        || null;

      if (!this._provider) {
        // LanguageService hasn't exposed its provider; build a thin
        // local mirror that re-reads currentLanguage on demand.
        this._provider = {
          getCurrentLanguage: () =>
            window.LanguageService ? window.LanguageService.getCurrentLanguage() : 'en',
          subscribe: (cb) => (window.LanguageService && window.LanguageService._provider)
            ? window.LanguageService._provider.subscribe(cb)
            : () => false
        };
      }

      // Make sure the LanguageService has picked up the persisted
      // language. Safe to call repeatedly; the Service is idempotent.
      if (window.LanguageService && typeof window.LanguageService.initialize === 'function') {
        window.LanguageService.initialize();
      }

      this._containers = document.querySelectorAll(SWITCH_SELECTOR);
      this._containers.forEach((root) => this._mountContainer(root));

      if (this._provider && typeof this._provider.subscribe === 'function') {
        this._unsubscribe = this._provider.subscribe((lang) => this._syncAll(lang));
      }

      this._syncAll(this._provider.getCurrentLanguage());
      this._mounted = true;
    }

    /** @returns {NodeList} All mounted language-switch containers. */
    getContainers() { return this._containers; }

    /** @returns {string} Current active language code. */
    getActiveLanguage() {
      return this._provider ? this._provider.getCurrentLanguage() : 'en';
    }

    // ==========================================================
    // INTERNAL
    // ==========================================================

    _mountContainer(root) {
      const options = root.querySelectorAll(OPTION_SELECTOR);
      options.forEach((btn) => {
        const lang = btn.getAttribute('data-language-option');
        if (!lang) return;

        btn.setAttribute('type', 'button');
        btn.addEventListener('click', () => this._onSelect(lang, btn));
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._onSelect(lang, btn);
          }
        });
      });
    }

    _onSelect(lang, sourceBtn) {
      if (!window.LanguageService || typeof window.LanguageService.changeLanguage !== 'function') {
        console.warn('[LanguageSwitch] LanguageService is unavailable.');
        return;
      }
      // Optimistic UI update: switch the active state immediately so the
      // user sees feedback even before the renderer reload finishes.
      this._syncAll(lang, sourceBtn);
      window.LanguageService.changeLanguage(lang);
    }

    /**
     * Reflect `lang` across every switch container.
     * @param {string} lang
     * @param {HTMLElement} [origin] Source button (skipped when re-syncing).
     */
    _syncAll(lang, origin) {
      this._containers.forEach((root) => {
        root.querySelectorAll(OPTION_SELECTOR).forEach((btn) => {
          const isActive = btn.getAttribute('data-language-option') === lang;
          btn.classList.toggle(ACTIVE_CLASS, isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          if (isActive) btn.setAttribute('aria-current', 'true');
          else btn.removeAttribute('aria-current');
        });
        root.setAttribute('data-active-language', lang);
      });
    }
  }

  window.LanguageSwitch = new LanguageSwitch();

  function boot() { window.LanguageSwitch.init(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();