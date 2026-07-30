/**
 * MAIN.JS
 * Software Engineer Portfolio
 *
 * Features:
 * - Navbar routing with active section highlighting
 * - Smooth scrolling
 * - Form handling
 * - Intersection Observer for animations
 * - Mobile menu management
 * - JSON data integration via PortfolioRenderer
 */

(function () {
  'use strict';

  // =========================================================
  // NAVIGATOR
  // =========================================================
  class Navigator {
    constructor() {
      this.sections = [];
      this.links = [];
      this.activeClass = 'active';
      this.init();
    }

    init() {
      // Get all sections
      this.sections = Array.from(document.querySelectorAll('main section[id]'));

      // Get all navigation links
      this.links = Array.from(document.querySelectorAll('.nav-link[data-section]'));

      if (this.sections.length && this.links.length) {
        this.setupIntersectionObserver();
        this.setupLinkListeners();
        this.highlightActiveSection();
      }
    }

    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setActiveSection(entry.target.id);
          }
        });
      }, options);

      this.sections.forEach((section) => observer.observe(section));
    }

    setupLinkListeners() {
      this.links.forEach((link) => {
        link.addEventListener('click', (e) => {
          // Close mobile menu on link click
          const menu = document.getElementById('primary-menu');
          const toggler = document.querySelector('.navbar-toggler');

          if (menu && menu.classList.contains('show')) {
            toggler?.click();
          }
        });
      });
    }

    setActiveSection(sectionId) {
      // Remove active class from all links
      this.links.forEach((link) => {
        link.classList.remove(this.activeClass);
        link.removeAttribute('aria-current');
      });

      // Add active class to matching link
      const activeLink = this.links.find(
        (link) => link.getAttribute('data-section') === sectionId
      );

      if (activeLink) {
        activeLink.classList.add(this.activeClass);
        activeLink.setAttribute('aria-current', 'page');
      }
    }

    highlightActiveSection() {
      // Check URL hash on load
      const hash = window.location.hash.slice(1);
      if (hash) {
        this.setActiveSection(hash);
      }
    }
  }

  // =========================================================
  // SCROLL HANDLER
  // =========================================================
  class ScrollHandler {
    constructor() {
      this.scrollOffset = 80; // Header height
      this.init();
    }

    init() {
      this.setupSmoothScroll();
      this.setupBackToTop();
    }

    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');

          if (targetId === '#') return;

          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            e.preventDefault();

            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - this.scrollOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Update URL hash without scrolling
            history.pushState(null, null, targetId);
          }
        });
      });
    }

    setupBackToTop() {
      const backToTop = document.querySelector('.back-to-top');

      if (backToTop) {
        window.addEventListener('scroll', () => {
          if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
        });

        backToTop.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    }
  }

  // =========================================================
  // FORM HANDLER
  // =========================================================
  class FormHandler {
    constructor() {
      this.forms = [];
      this.init();
    }

    init() {
      this.forms = Array.from(document.querySelectorAll('form[data-validate]'));

      this.forms.forEach((form) => {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));

        // Real-time validation on blur
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach((input) => {
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
              this.validateField(input);
            }
          });
        });
      });
    }

    handleSubmit(e, form) {
      e.preventDefault();

      // Validate form
      if (this.validateForm(form)) {
        this.submitForm(form);
      }
    }

    async submitForm(form) {
      const submitBtn = form.querySelector('.btn-submit');

      // Show loading state
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success state
      submitBtn.classList.remove('is-loading');
      submitBtn.classList.add('is-success');

      // Show success message
      this.showSuccess(form);

      // Reset button after delay
      setTimeout(() => {
        submitBtn.classList.remove('is-success');
        submitBtn.disabled = false;
      }, 3000);
    }

    validateForm(form) {
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach((input) => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      return isValid;
    }

    validateField(input) {
      const value = input.value.trim();
      let isValid = true;
      let errorMessage = '';

      if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
      } else if (input.type === 'email' && !this.isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      } else if (input.type === 'email' && !this.isValidEmailDomain(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email domain';
      } else if (input.minLength && value.length < input.minLength) {
        isValid = false;
        errorMessage = `Please enter at least ${input.minLength} characters`;
      }

      if (!isValid) {
        this.showError(input, errorMessage);
      } else {
        this.clearError(input);
      }

      return isValid;
    }

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    isValidEmailDomain(email) {
      const domain = email.split('@')[1];
      if (!domain) return false;
      const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
      return !domain.includes('..') && domain.length > 2;
    }

    showError(input, message) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');

      const errorEl = input.parentNode.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
      }

      input.setAttribute('aria-invalid', 'true');
    }

    clearError(input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');

      const errorEl = input.parentNode.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = '';
      }

      input.removeAttribute('aria-invalid');
    }

    showSuccess(form) {
      // Create success message
      const alert = document.createElement('div');
      alert.className = 'alert alert-success alert-dismissible fade show';
      alert.setAttribute('role', 'alert');
      alert.innerHTML = `
        <strong><i class="bi bi-check-circle me-2"></i>Success!</strong> Your message has been sent. I'll get back to you soon.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      // Insert alert before form
      form.parentNode.insertBefore(alert, form);

      // Reset form
      form.reset();

      // Clear validation states
      const inputs = form.querySelectorAll('.form-control');
      inputs.forEach((input) => {
        input.classList.remove('is-valid', 'is-invalid');
      });

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        const bsAlert = bootstrap?.Alert?.getOrCreateInstance(alert);
        bsAlert?.close();
      }, 5000);
    }
  }

  // =========================================================
  // ANIMATION HANDLER
  // =========================================================
  class AnimationHandler {
    constructor() {
      this.elements = [];
      this.init();
    }

    init() {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Elements to animate
      this.elements = Array.from(document.querySelectorAll('[data-animate]'));

      if (this.elements.length) {
        this.setupObserver();
      }
    }

    setupObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, options);

      this.elements.forEach((el) => observer.observe(el));
    }
  }

  // =========================================================
  // TYPEWRITER EFFECT
  // =========================================================
  class Typewriter {
    constructor(element, options = {}) {
      this.element = element;
      this.words = options.words || ['Software Engineer', 'Full Stack Developer', 'Problem Solver'];
      this.typeSpeed = options.typeSpeed || 100;
      this.deleteSpeed = options.deleteSpeed || 50;
      this.pauseDelay = options.pauseDelay || 2000;
      this.wordIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.init();
    }

    init() {
      if (!this.element) return;
      this.type();
    }

    type() {
      const currentWord = this.words[this.wordIndex];

      if (this.isDeleting) {
        this.element.textContent = currentWord.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.element.textContent = currentWord.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

      if (!this.isDeleting && this.charIndex === currentWord.length) {
        typeSpeed = this.pauseDelay;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        typeSpeed = 500;
      }

      setTimeout(() => this.type(), typeSpeed);
    }
  }

  // =========================================================
  // YEAR UPDATER
  // =========================================================
  function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // =========================================================
  // BACK TO TOP HANDLER
  // =========================================================
  class BackToTopHandler {
    constructor() {
      this.button = document.getElementById('back-to-top');
      this.threshold = 300;
      this.init();
    }

    init() {
      if (!this.button) return;

      // Show/hide based on scroll position
      this.handleScroll = this.throttle(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        if (scrollY > this.threshold) {
          this.button.classList.add('is-visible');
          this.button.setAttribute('aria-hidden', 'false');
        } else {
          this.button.classList.remove('is-visible');
          this.button.setAttribute('aria-hidden', 'true');
        }
      }, 100);

      // Click to scroll to top
      this.button.addEventListener('click', () => {
        this.scrollToTop();
      });

      // Keyboard support
      this.button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.scrollToTop();
        }
      });

      // Listen to scroll
      window.addEventListener('scroll', this.handleScroll, { passive: true });

      // Initial state
      this.handleScroll();
    }

    scrollToTop() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      // Focus the button for accessibility after action
      this.button.focus();
    }

    throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
  }

  // =========================================================
  // INITIALIZE ON DOM READY
  // =========================================================
  async function init() {
    // Load portfolio data from JSON files via PortfolioRenderer
    if (typeof window.PortfolioRenderer !== 'undefined') {
      await window.PortfolioRenderer.init();
    }

    // Initialize components
    new Navigator();
    new ScrollHandler();
    new FormHandler();
    new AnimationHandler();
    new BackToTopHandler();
    updateYear();

    // Initialize typewriter using title(s) provided by the renderer
    // (profile.meta.author_title, optionally profile.meta.roles[]).
    // Falls back to a single neutral default only if no data was rendered.
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
      const profileData = window.PortfolioRenderer?.data?.profile;
      const roles = profileData?.meta?.roles;
      const authorTitle = profileData?.meta?.author_title;
      const wordsFromData = (Array.isArray(roles) && roles.length
        ? roles
        : null)
        || (authorTitle
          ? [authorTitle]
          : ['Software Engineer']);

      new Typewriter(typewriterElement, {
        words: wordsFromData,
        typeSpeed: 80,
        deleteSpeed: 40,
        pauseDelay: 2500
      });
    }

    // Mark body as loaded
    document.body.classList.add('js-loaded');

    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('portfolio:ready'));
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
