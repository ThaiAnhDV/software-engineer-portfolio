/**
 * Portfolio Content Loader
 * Populates HTML sections with data from JSON files
 */
(function() {
  'use strict';

  const ContentLoader = {
    initialized: false,

    /**
     * Initialize content loading
     */
    async init() {
      if (this.initialized) return;
      
      try {
        await this.loadAll();
        this.initialized = true;
      } catch (error) {
        console.error('ContentLoader: Failed to initialize', error);
      }
    },

    /**
     * Load all content sections
     */
    async loadAll() {
      const data = await window.DataLoader.loadAll();
      
      this.populateMeta(data.portfolio);
      this.populateHero(data.portfolio);
      this.populateAbout(data.portfolio);
      this.populateNavigation(data.portfolio);
      this.populateFooter(data.portfolio);
      this.populateSkills(data.skills);
      this.populateProjects(data.projects);
      this.populateExperience(data.experience);
      this.populateCertificates(data.certificates);
      this.populateContact(data.contact);
    },

    /**
     * Populate meta tags from portfolio.json
     */
    populateMeta(portfolio) {
      if (!portfolio?.meta) return;

      const { meta, branding } = portfolio;
      const siteName = branding?.site_name || meta.author;
      const title = branding?.tagline ? `${meta.author} — ${branding.tagline}` : meta.author;

      // Update document title
      document.title = title;

      // Update meta tags
      const updateMeta = (selector, content, attr = 'content') => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute(attr, content);
      };

      updateMeta('meta[name="author"]', meta.author);
      updateMeta('meta[name="description"]', branding?.description || '');
      updateMeta('meta[name="theme-color"]', branding?.theme_color || '#0d6efd');
      updateMeta('meta[property="og:title"]', title);
      updateMeta('meta[property="og:description"]', branding?.description || '');
      updateMeta('meta[property="og:url"]', meta.author_website || '');
      updateMeta('meta[property="og:image"]', branding?.og_image || '');
      updateMeta('meta[name="twitter:title"]', title);
      updateMeta('meta[name="twitter:description"]', branding?.description || '');
      updateMeta('meta[name="twitter:image"]', branding?.og_image || '');
      updateMeta('link[rel="canonical"]', meta.author_website || '', 'href');

      // Update favicon
      if (branding?.favicon) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = branding.favicon;
      }
    },

    /**
     * Populate hero section
     */
    populateHero(portfolio) {
      if (!portfolio?.hero) return;

      const { hero, meta } = portfolio;

      // Name
      const nameEl = document.querySelector('.hero-name');
      if (nameEl) nameEl.textContent = meta?.author || '';

      // Description
      const descEl = document.querySelector('.hero-description');
      if (descEl) descEl.textContent = hero?.headline || '';

      // Avatar
      const avatarEl = document.querySelector('.hero-image');
      if (avatarEl && hero?.avatar) {
        avatarEl.src = hero.avatar;
        avatarEl.alt = `Profile portrait of ${meta?.author || 'User'}`;
      }

      // CTA buttons - update hrefs
      const ctaPrimary = document.querySelector('.hero-cta .btn-primary');
      const ctaSecondary = document.querySelector('.hero-cta .btn-outline-primary');
      if (hero?.cta_primary?.href && ctaPrimary) ctaPrimary.href = hero.cta_primary.href;
      if (hero?.cta_secondary?.href && ctaSecondary) ctaSecondary.href = hero.cta_secondary.href;

      // Social links
      this.populateHeroSocials();
    },

    /**
     * Populate hero social links
     */
    async populateHeroSocials() {
      const socials = await window.DataLoader.getSocials();
      const socialLinks = document.querySelectorAll('.hero-social-link');
      
      socialLinks.forEach((link, index) => {
        if (socials[index]) {
          link.href = socials[index].url;
          link.setAttribute('aria-label', `${socials[index].name} Profile`);
        }
      });
    },

    /**
     * Populate about section
     */
    populateAbout(portfolio) {
      if (!portfolio?.about) return;

      const { about, meta } = portfolio;

      // Introduction paragraphs
      const introBlocks = document.querySelectorAll('.about-block:first-child .about-text');
      if (about?.introduction?.length >= 2 && introBlocks.length >= 2) {
        introBlocks[0].textContent = about.introduction[0];
        introBlocks[1].textContent = about.introduction[1];
      }

      // Career objective
      const careerEl = document.querySelector('.about-block:nth-child(2) .about-text');
      if (careerEl && about?.career_objective) {
        careerEl.textContent = about.career_objective;
      }

      // Quick info
      if (about?.quick_info) {
        const ageEl = document.querySelector('.about-quick-info-value');
        const locationEl = document.querySelectorAll('.about-quick-info-value')[1];
        const experienceEl = document.querySelectorAll('.about-quick-info-value')[2];
        const degreeEl = document.querySelectorAll('.about-quick-info-value')[3];

        if (about.quick_info.age && ageEl) ageEl.textContent = about.quick_info.age;
        if (about.quick_info.location && locationEl) locationEl.textContent = about.quick_info.location;
        if (about.quick_info.experience_years && experienceEl) experienceEl.textContent = about.quick_info.experience_years;
        if (about.quick_info.degree && degreeEl) degreeEl.textContent = about.quick_info.degree;
      }

      // CV download link
      const cvLink = document.querySelector('.about-cta .btn-primary');
      if (cvLink && about?.cv_url) cvLink.href = about.cv_url;

      // Stats
      this.populateAboutStats(about?.stats);
    },

    /**
     * Populate about stats
     */
    populateAboutStats(stats) {
      if (!stats?.length) return;

      const statNumbers = document.querySelectorAll('.stat-number');
      const statLabels = document.querySelectorAll('.stat-label');

      stats.forEach((stat, index) => {
        if (statNumbers[index]) {
          statNumbers[index].setAttribute('data-counter', stat.value);
          statNumbers[index].textContent = 0;
        }
        if (statLabels[index]) {
          statLabels[index].textContent = stat.label;
        }
      });
    },

    /**
     * Populate navigation from portfolio.json
     */
    populateNavigation(portfolio) {
      if (!portfolio?.navigation?.primary) return;

      const nav = document.querySelector('#primary-menu .navbar-nav');
      if (!nav) return;

      const items = portfolio.navigation.primary.map(item => `
        <li class="nav-item">
          <a class="nav-link" href="${item.href}" data-section="${item.href.replace('#', '')}">${item.label}</a>
        </li>
      `).join('');

      nav.innerHTML = items;
    },

    /**
     * Populate footer
     */
    populateFooter(portfolio) {
      if (!portfolio?.meta) return;

      const { meta } = portfolio;

      // Logo text
      const logoText = document.querySelector('.footer-logo .brand-name');
      if (logoText) logoText.textContent = meta.author;

      // Footer description
      const footerDesc = document.querySelector('.footer-description');
      if (footerDesc) {
        footerDesc.textContent = `Software Engineer passionate about building scalable solutions and elegant user experiences.`;
      }

      // Footer nav
      if (portfolio?.navigation?.footer?.navigation) {
        const footerNav = document.querySelector('.footer-nav');
        if (footerNav) {
          footerNav.innerHTML = portfolio.navigation.footer.navigation.map(item => `
            <a href="${item.href}">${item.label}</a>
          `).join('');
        }
      }
    },

    /**
     * Populate skills section
     */
    populateSkills(skills) {
      if (!skills?.skill_categories) return;

      // Skills are currently hardcoded in HTML
      // This method can be used for dynamic skill rendering
      // For now, we validate the data exists
      console.log('Skills data loaded:', skills.skill_categories.length, 'categories');
    },

    /**
     * Populate projects section
     */
    populateProjects(projects) {
      if (!projects?.length) return;

      // Projects are currently hardcoded in HTML
      // This method can be used for dynamic project rendering
      console.log('Projects data loaded:', projects.length, 'projects');
    },

    /**
     * Populate experience section
     */
    populateExperience(experience) {
      if (!experience?.experience) return;

      // Experience is currently hardcoded in HTML
      // This method can be used for dynamic experience rendering
      console.log('Experience data loaded:', experience.experience.length, 'positions');
    },

    /**
     * Populate certificates section
     */
    populateCertificates(certificates) {
      if (!certificates?.length) return;

      // Certificates are currently hardcoded in HTML
      // This method can be used for dynamic certificate rendering
      console.log('Certificates data loaded:', certificates.length, 'certificates');
    },

    /**
     * Populate contact section
     */
    async populateContact(contact) {
      if (!contact) return;

      // Form placeholders
      const formFields = document.querySelectorAll('.contact-form .form-control');
      if (contact?.form?.fields) {
        formFields.forEach(field => {
          const fieldName = field.name;
          const fieldConfig = contact.form.fields.find(f => f.name === fieldName);
          if (fieldConfig) {
            if (fieldConfig.placeholder) field.placeholder = fieldConfig.placeholder;
            field.required = fieldConfig.required;
          }
        });
      }

      // Contact info
      if (contact?.contact_info) {
        const emailEl = document.querySelector('.contact-info-item a[href^="mailto:"]');
        if (emailEl && contact.contact_info.email) {
          emailEl.href = `mailto:${contact.contact_info.email}`;
          emailEl.textContent = contact.contact_info.email;
        }

        const locationEl = document.querySelector('.contact-info-item:has(.bi-geo-alt)');
        if (locationEl && contact.contact_info.location) {
          const span = locationEl.querySelector('span:last-child');
          if (span) span.textContent = contact.contact_info.location;
        }
      }

      // Social links
      if (contact?.socials) {
        const socialLinks = document.querySelectorAll('.contact-social a');
        socialLinks.forEach((link, index) => {
          if (contact.socials[index]) {
            link.href = contact.socials[index].url;
          }
        });
      }
    }
  };

  // Auto-initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', async () => {
    await ContentLoader.init();
  });

  // Export to global scope
  window.ContentLoader = ContentLoader;

})();
