/**
 * PROJECT-DETAIL.JS
 * JavaScript for project detail pages
 */

(function () {
  'use strict';

  // =========================================================
  // GALLERY MODAL
  // =========================================================
  class GalleryModal {
    constructor() {
      this.modal = document.getElementById('galleryModal');
      this.modalImage = document.getElementById('galleryModalImage');
      this.prevBtn = document.getElementById('galleryModalPrev');
      this.nextBtn = document.getElementById('galleryModalNext');
      this.currentIndex = 0;
      this.images = [];

      if (this.modal) {
        this.init();
      }
    }

    init() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      this.images = Array.from(galleryItems).map(item => ({
        src: item.dataset.fullSrc || item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        caption: item.querySelector('.gallery-item-caption')?.textContent || ''
      }));

      galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => this.openModal(index));
      });

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.navigate(1));
      }

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.modal.classList.contains('show')) return;

        if (e.key === 'ArrowLeft') this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
        if (e.key === 'Escape') this.closeModal();
      });

      // Handle modal hide
      this.modal.addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
      });
    }

    openModal(index) {
      this.currentIndex = index;
      this.updateModalContent();
      const bsModal = new bootstrap.Modal(this.modal);
      bsModal.show();
    }

    closeModal() {
      const bsModal = bootstrap.Modal.getInstance(this.modal);
      bsModal?.hide();
    }

    navigate(direction) {
      this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
      this.updateModalContent();
    }

    updateModalContent() {
      const image = this.images[this.currentIndex];
      if (image && this.modalImage) {
        this.modalImage.src = image.src;
        this.modalImage.alt = image.alt;
      }

      // Update modal title with caption
      const titleEl = this.modal.querySelector('.modal-title');
      if (titleEl && image.caption) {
        titleEl.textContent = image.caption;
      }

      // Update button visibility
      if (this.prevBtn) {
        this.prevBtn.style.visibility = this.images.length > 1 ? 'visible' : 'hidden';
      }
      if (this.nextBtn) {
        this.nextBtn.style.visibility = this.images.length > 1 ? 'visible' : 'hidden';
      }
    }
  }

  // =========================================================
  // PROJECT NAVIGATION
  // =========================================================
  class ProjectNav {
    constructor() {
      this.sections = [];
      this.navLinks = [];
      this.init();
    }

    init() {
      this.sections = document.querySelectorAll('.project-section[id]');
      this.navLinks = document.querySelectorAll('.project-nav-link');

      if (!this.sections.length || !this.navLinks.length) return;

      this.setupScrollSpy();
      this.setupSmoothScroll();
    }

    setupScrollSpy() {
      const options = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.updateActiveLink(id);
          }
        });
      }, options);

      this.sections.forEach((section) => observer.observe(section));
    }

    updateActiveLink(activeId) {
      this.navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }

    setupSmoothScroll() {
      this.navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href.startsWith('#')) return;

          const target = document.querySelector(href);
          if (!target) return;

          e.preventDefault();

          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const offset = 100; // Account for fixed nav

          if (prefersReducedMotion) {
            target.scrollIntoView();
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Update URL without scrolling
          history.pushState(null, '', href);
        });
      });
    }
  }

  // =========================================================
  // READING TIME ESTIMATOR
  // =========================================================
  function updateReadingTime() {
    const content = document.querySelector('.project-section .section-content, .case-study-content');
    if (!content) return;

    const text = content.textContent || content.innerText;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute

    const statsList = document.querySelector('.stats-list');
    if (statsList) {
      const readingItem = statsList.querySelector('[data-reading-time]');
      if (readingItem) {
        readingItem.querySelector('dd').textContent = `${readingTime} min read`;
      }
    }
  }

  // =========================================================
  // INITIALIZE
  // =========================================================
  function init() {
    new GalleryModal();
    new ProjectNav();
    updateReadingTime();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
