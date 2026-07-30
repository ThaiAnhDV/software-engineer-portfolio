/**
 * COMPONENTS.JS
 * Component Initialization and Utilities
 * Software Engineer Portfolio
 */

(function () {
  'use strict';

  // =========================================================
  // COMPONENT INITIALIZER
  // =========================================================
  class ComponentInitializer {
    constructor() {
      this.components = {};
      this.init();
    }

    init() {
      this.initTooltips();
      this.initPopovers();
      this.initProgressBars();
      this.initSkillBars();
      this.initCounters();
      this.initLazyLoad();
    }

    /**
     * Initialize Bootstrap tooltips
     */
    initTooltips() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl, {
          trigger: 'hover focus',
          placement: 'top'
        });
      });
    }

    /**
     * Initialize Bootstrap popovers
     */
    initPopovers() {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

      popoverTriggerList.forEach((popoverTriggerEl) => {
        new bootstrap.Popover(popoverTriggerEl);
      });
    }

    /**
     * Initialize animated progress bars
     */
    initProgressBars() {
      const progressBars = document.querySelectorAll('.progress-bar');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const progressBar = entry.target;
              const targetWidth = progressBar.getAttribute('data-progress') || '0';

              progressBar.style.width = '0%';
              setTimeout(() => {
                progressBar.style.width = targetWidth + '%';
              }, 100);

              observer.unobserve(progressBar);
            }
          });
        },
        { threshold: 0.5 }
      );

      progressBars.forEach((bar) => observer.observe(bar));
    }

    /**
     * Initialize skill bars with animation
     */
    initSkillBars() {
      const skillBars = document.querySelectorAll('.skill-bar');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const skillBar = entry.target;
              const level = skillBar.getAttribute('data-level') || '0';

              skillBar.style.width = '0%';
              setTimeout(() => {
                skillBar.style.width = level + '%';
              }, 100);

              observer.unobserve(skillBar);
            }
          });
        },
        { threshold: 0.5 }
      );

      skillBars.forEach((bar) => observer.observe(bar));
    }

    /**
     * Initialize animated counters
     */
    initCounters() {
      const counters = document.querySelectorAll('[data-counter]');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((counter) => observer.observe(counter));
    }

    /**
     * Animate counter to target value
     */
    animateCounter(element) {
      const target = parseInt(element.getAttribute('data-counter'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          element.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      };

      updateCounter();
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoad() {
      const images = document.querySelectorAll('img[data-src]');

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  // =========================================================
  // CARD UTILITIES
  // =========================================================
  const CardUtils = {
    /**
     * Create a project card dynamically
     */
    createProjectCard(options) {
      const {
        title,
        description,
        image,
        tags = [],
        demoUrl = '#',
        codeUrl = '#',
        featured = false
      } = options;

      const card = document.createElement('article');
      card.className = `card card-project${featured ? ' card-featured' : ''}`;

      card.innerHTML = `
        <img src="${image}" alt="${title}" class="card-img-top" loading="lazy" />
        <div class="card-body">
          ${featured ? '<span class="badge bg-warning text-dark mb-2"><i class="bi bi-star-fill me-1"></i>Featured</span>' : ''}
          ${tags.length ? `<span class="badge tag tag-primary mb-2">${tags[0]}</span>` : ''}
          <h3 class="card-title">${title}</h3>
          <p class="card-text">${description}</p>
          ${tags.length ? `
            <div class="tag-group mb-4">
              ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
          <div class="project-links">
            <a href="${demoUrl}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-box-arrow-up-right me-1"></i>Demo
            </a>
            <a href="${codeUrl}" class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-github me-1"></i>Code
            </a>
          </div>
        </div>
      `;

      return card;
    },

    /**
     * Create a skill card dynamically
     */
    createSkillCard(options) {
      const { name, level = 'Intermediate', icon } = options;

      const card = document.createElement('div');
      card.className = 'card card-skill';

      card.innerHTML = `
        <div class="skill-icon">
          ${icon.startsWith('<') ? icon : `<i class="bi bi-${icon}"></i>`}
        </div>
        <h4 class="skill-name">${name}</h4>
        <span class="skill-level">${level}</span>
      `;

      return card;
    },

    /**
     * Create a certificate card dynamically
     */
    createCertificateCard(options) {
      const {
        title,
        issuer,
        description,
        date,
        badge = 'Verified',
        url = '#'
      } = options;

      const card = document.createElement('article');
      card.className = 'card card-certificate';

      card.innerHTML = `
        <div class="card-img-top">
          <i class="bi bi-patch-check-fill"></i>
        </div>
        <div class="card-body">
          <span class="certificate-badge">
            <i class="bi bi-check-circle-fill"></i>
            ${badge}
          </span>
          <h3 class="card-title">${title}</h3>
          <p class="card-subtitle">${issuer}</p>
          <p class="card-text">${description}</p>
        </div>
        <div class="card-footer">
          <span class="text-muted small">
            <i class="bi bi-calendar3 me-1"></i>Issued: ${date}
          </span>
          <a href="${url}" class="btn btn-sm btn-ghost ms-auto" target="_blank" rel="noopener noreferrer">
            View <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      `;

      return card;
    }
  };

  // =========================================================
  // TIMELINE UTILITIES
  // =========================================================
  const TimelineUtils = {
    /**
     * Create a timeline item
     */
    createTimelineItem(options) {
      const {
        title,
        subtitle,
        date,
        location,
        description,
        tags = [],
        isCurrent = false,
        type = 'experience'
      } = options;

      const iconClass = type === 'education'
        ? 'bi-mortarboard-fill'
        : isCurrent
          ? 'bi-briefcase-fill'
          : 'bi-briefcase';

      const li = document.createElement('li');
      li.className = 'timeline-item';

      li.innerHTML = `
        <div class="timeline-marker">
          <i class="bi ${iconClass}"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="timeline-title">${title}</h3>
            ${isCurrent ? '<span class="badge bg-success">Current</span>' : ''}
          </div>
          <p class="timeline-subtitle">${subtitle}</p>
          <div class="timeline-meta">
            ${date ? `
              <span class="timeline-meta-item">
                <i class="bi bi-calendar3"></i>
                ${date}
              </span>
            ` : ''}
            ${location ? `
              <span class="timeline-meta-item">
                <i class="bi bi-geo-alt"></i>
                ${location}
              </span>
            ` : ''}
          </div>
          ${description ? `
            <div class="timeline-body mt-3">
              ${typeof description === 'string'
                ? `<p>${description}</p>`
                : `<ul>${description.map(d => `<li>${d}</li>`).join('')}</ul>`
              }
            </div>
          ` : ''}
          ${tags.length ? `
            <div class="timeline-tags">
              ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;

      return li;
    }
  };

  // =========================================================
  // TAG UTILITIES
  // =========================================================
  const TagUtils = {
    /**
     * Create a tag element
     */
    createTag(options) {
      const { text, variant = '', icon, href, size = '' } = options;

      const classes = ['tag'];
      if (variant) classes.push(`tag-${variant}`);
      if (size) classes.push(`tag-${size}`);

      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.className = classes.join(' ');
        a.innerHTML = icon ? `<i class="bi bi-${icon} me-1"></i>${text}` : text;
        return a;
      }

      const span = document.createElement('span');
      span.className = classes.join(' ');
      span.innerHTML = icon ? `<i class="bi bi-${icon} me-1"></i>${text}` : text;
      return span;
    },

    /**
     * Create a tag group
     */
    createTagGroup(tags, options = {}) {
      const { inline = false } = options;
      const container = document.createElement('div');
      container.className = inline ? 'tag-group-inline' : 'tag-group';

      tags.forEach((tagOptions) => {
        const tag = typeof tagOptions === 'string'
          ? this.createTag({ text: tagOptions })
          : this.createTag(tagOptions);
        container.appendChild(tag);
      });

      return container;
    }
  };

  // =========================================================
  // FOOTER UTILITIES
  // =========================================================
  const FooterUtils = {
    /**
     * Update copyright year
     */
    updateCopyrightYear() {
      const yearElements = document.querySelectorAll('#current-year, .footer-year');
      const currentYear = new Date().getFullYear();
      yearElements.forEach((el) => {
        el.textContent = currentYear;
      });
    },

    /**
     * Generate social links from data
     */
    generateSocialLinks(socials, container) {
      const socialContainer = container || document.querySelector('.footer-social');
      if (!socialContainer) return;

      socialContainer.innerHTML = socials.map((social) => `
        <a href="${social.url}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="${social.name}"
           title="${social.name}">
          <i class="bi bi-${social.icon}"></i>
        </a>
      `).join('');
    }
  };

  // =========================================================
  // INITIALIZE
  // =========================================================
  function init() {
    // Initialize components
    new ComponentInitializer();

    // Update copyright year
    FooterUtils.updateCopyrightYear();

    // Mark body as ready
    document.body.classList.add('components-ready');

    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('components:ready'));
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // =========================================================
  // EXPORT API
  // =========================================================
  window.PortfolioComponents = {
    Card: CardUtils,
    Timeline: TimelineUtils,
    Tag: TagUtils,
    Footer: FooterUtils,
    Init: ComponentInitializer
  };

})();
