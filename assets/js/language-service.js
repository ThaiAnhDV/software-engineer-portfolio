/**
 * Language Service
 * --------------------------------------------------------------
 * Orchestrates the language layer for the Portfolio app.
 *
 * Responsibilities:
 *   - Detect the active language (localStorage → <html lang> → default).
 *   - Persist user choice via localStorage under "portfolio-language".
 *   - Load the JSON resource bundle for the active language.
 *   - Drive the renderer reload whenever the language changes.
 *
 * The Service is intentionally UI-agnostic: it does not touch
 * Bootstrap, jQuery, or the DOM directly. It only talks to:
 *   - window.LanguageProvider   (state + subscriptions)
 *   - window.PortfolioRenderer  (via reload(locale))
 *   - window.localStorage       (persistence)
 *   - window.fetch              (resource loading)
 *
 * Public API:
 *   initialize(): Promise<void>
 *   getCurrentLanguage(): string
 *   changeLanguage(language): Promise<boolean>
 *   loadLanguage(language): Promise<boolean>
 *   saveLanguage(language): boolean
 *   getSupportedLanguages(): string[]
 *
 * Internal helpers:
 *   _detectInitialLanguage(): string
 *   _isSupported(lang): boolean
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-language';
  const LOCALE_BASE = 'data/';
  const DEFAULT_LANGUAGE = 'en';
  const SUPPORTED_LANGUAGES = ['en', 'vi'];

  class LanguageService {

    constructor() {
      if (!window.LanguageProvider) {
        throw new Error('[LanguageService] LanguageProvider is not loaded.');
      }
      this._provider = new window.LanguageProvider(DEFAULT_LANGUAGE);
      this._renderer = null;          // resolved lazily to avoid order issues
      this._initialized = false;
      this._inflight = null;          // dedupes concurrent changeLanguage calls
    }

    /**
     * Bootstrap: detect → load resources → render.
     * Safe to call multiple times; only the first call performs work.
     * @returns {Promise<void>}
     */
    async initialize() {
      if (this._initialized) return;
      const detected = this._detectInitialLanguage();
      await this.loadLanguage(detected);
      this._initialized = true;
    }

    /** @returns {string} Active language code (e.g. "en"). */
    getCurrentLanguage() {
      return this._provider.getCurrentLanguage();
    }

    /**
     * Switch the application language and persist the choice.
     * Concurrent calls with the same target are deduplicated.
     * @param {string} language
     * @returns {Promise<boolean>} true when the language actually changed.
     */
    async changeLanguage(language) {
      const target = String(language ?? '').toLowerCase().split('-')[0];
      if (!this._isSupported(target)) {
        console.warn(`[LanguageService] Unsupported language: "${language}". Falling back to "${DEFAULT_LANGUAGE}".`);
        return false;
      }

      // No-op when the application is already on the target language —
      // prevents duplicate fetches / re-renders.
      if (this._provider.getCurrentLanguage() === target) return false;

      // Deduplicate concurrent calls targeting the same language.
      if (this._inflight && this._inflight.target === target) {
        return this._inflight.promise;
      }

      const promise = (async () => {
        const changed = await this.loadLanguage(target);
        if (changed) this.saveLanguage(target);
        return changed;
      })();

      this._inflight = { target, promise };
      try {
        return await promise;
      } finally {
        if (this._inflight && this._inflight.promise === promise) {
          this._inflight = null;
        }
      }
    }

    /**
     * Load the JSON resources for the given language, update the
     * provider, and trigger a renderer reload.
     * @param {string} language
     * @returns {Promise<boolean>} true when the active language changed.
     */
    async loadLanguage(language) {
      const target = String(language ?? '').toLowerCase().split('-')[0];
      if (!this._isSupported(target)) return false;

      const renderer = this._getRenderer();
      if (!renderer) {
        console.warn('[LanguageService] Renderer not available; aborting load.');
        return false;
      }

      // Let the renderer swap locale + re-fetch + re-render.
      const ok = await renderer.reload(target);
      if (ok) this._provider.setLanguage(target);
      return ok;
    }

    /**
     * Persist the language to localStorage.
     * @param {string} language
     * @returns {boolean} true when persistence succeeded.
     */
    saveLanguage(language) {
      const target = String(language ?? '').toLowerCase().split('-')[0];
      if (!this._isSupported(target)) return false;
      try {
        window.localStorage.setItem(STORAGE_KEY, target);
        return true;
      } catch (error) {
        console.warn('[LanguageService] localStorage write failed:', error);
        return false;
    }
    }

    /** @returns {string[]} Canonical list of supported languages. */
    getSupportedLanguages() {
      return [...SUPPORTED_LANGUAGES];
    }

    // ==========================================================
    // INTERNAL
    // ==========================================================

    /**
     * Detect the initial language using the priority:
     *   1. localStorage["portfolio-language"]
     *   2. <html lang> attribute
     *   3. DEFAULT_LANGUAGE ("en")
     * @returns {string}
     */
    _detectInitialLanguage() {
      // 1. localStorage
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && this._isSupported(stored)) return stored.toLowerCase();
      } catch (_) { /* ignore */ }

      // 2. <html lang>
      const attr = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      const short = attr.split('-')[0];
      if (this._isSupported(short)) return short;

      // 3. default
      return DEFAULT_LANGUAGE;
    }

    _isSupported(lang) {
      return SUPPORTED_LANGUAGES.includes(String(lang || '').toLowerCase());
    }

    _getRenderer() {
      if (this._renderer) return this._renderer;
      if (typeof window !== 'undefined' && window.PortfolioRenderer) {
        this._renderer = window.PortfolioRenderer;
      }
      return this._renderer;
    }
  }

  window.LanguageService = new LanguageService();
})();