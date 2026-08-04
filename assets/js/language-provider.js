/**
 * Language Provider
 * --------------------------------------------------------------
 * UI-agnostic runtime state for the active application language.
 * Holds the current language code and provides a minimal pub/sub
 * mechanism so non-UI consumers (LanguageService, theme manager,
 * analytics, etc.) can react to language changes.
 *
 * Design rules:
 *   - No DOM access, no fetch, no storage, no framework.
 *   - Pure state + subscriptions. Easy to unit test.
 *   - Notifies only on real state changes (no duplicate fires).
 *   - Subscriber errors are isolated so one bad listener cannot
 *     break the rest of the pipeline.
 *
 * Public API:
 *   getCurrentLanguage(): string
 *   setLanguage(lang): boolean  // returns true when state changed
 *   subscribe(callback): Function  // returns unsubscribe()
 *   unsubscribe(callback): boolean
 *   notify(): void
 *   reset(): void                // for tests / hot reload
 */
(function () {
  'use strict';

  const DEFAULT_LANGUAGE = 'en';

  class LanguageProvider {
    constructor(initial = DEFAULT_LANGUAGE) {
      this._language = this._sanitize(initial);
      this._subscribers = new Set();
    }

    /** @returns {string} Active language code. */
    getCurrentLanguage() {
      return this._language;
    }

    /**
     * Update the active language. No-op when the value is the same.
     * @param {string} language Two-letter language code.
     * @returns {boolean} true when the state actually changed.
     */
    setLanguage(language) {
      const next = this._sanitize(language);
      if (next === this._language) return false;
      this._language = next;
      this.notify();
      return true;
    }

    /**
     * Register a subscriber that fires on every language change.
     * @param {(lang: string) => void} callback
     * @returns {() => boolean} Unsubscribe function.
     */
    subscribe(callback) {
      if (typeof callback !== 'function') return () => false;
      this._subscribers.add(callback);
      return () => this.unsubscribe(callback);
    }

    /**
     * Remove a previously-registered subscriber.
     * @param {(lang: string) => void} callback
     * @returns {boolean} true when the callback was found.
     */
    unsubscribe(callback) {
      return this._subscribers.delete(callback);
    }

    /** Notify every subscriber. Listener errors are isolated. */
    notify() {
      for (const cb of [...this._subscribers]) {
        try { cb(this._language); }
        catch (error) { console.error('[LanguageProvider] subscriber failed:', error); }
      }
    }

    /** Reset state to the default language. Useful for tests. */
    reset() {
      this._subscribers.clear();
      this._language = DEFAULT_LANGUAGE;
    }

    _sanitize(value) {
      const v = String(value ?? '').trim().toLowerCase();
      const short = v.split('-')[0];
      return short || DEFAULT_LANGUAGE;
    }
  }

  window.LanguageProvider = LanguageProvider;
})();