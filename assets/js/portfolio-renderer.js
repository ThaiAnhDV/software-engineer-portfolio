/**
 * Portfolio Renderer
 * --------------------------------------------------------------
 * Single-source renderer for the redesigned JSON data layer.
 * Loads all JSON files from the active locale folder, resolves
 * `data-json` selectors, renders every section (meta, nav, hero,
 * about, education, skills, projects, experience, certificates,
 * contact, footer) and wires the project detail modal.
 *
 * Translation-ready architecture (Sprint 10.2):
 * - Locale is resolved from <html lang> attribute (default: 'en').
 * - All UI chrome (buttons, badges, modal headings, labels, etc.)
 *   is loaded from data/<locale>/<file>.json. No hardcoded strings.
 *
 * Defensive: never throws if a section or field is missing.
 * Exposed globally as `window.PortfolioRenderer` and auto-started
 * on DOMContentLoaded.
 */
(function () {
  'use strict';

  const ASSET_BASE = 'assets/images/';
  const BOOTSTRAP_ICON_PREFIX = 'bi-';
  const DEFAULT_LOCALE = 'en';
  const LOCALE_BASE = 'data/';

  const SOURCES = [
    ['profile',      'profile.json'],
    ['about',        'about.json'],
    ['skills',       'skills.json'],
    ['projects',     'projects.json'],
    ['experience',   'experience.json'],
    ['certificates', 'certificates.json'],
    ['contact',      'contact.json']
  ];

  const SECTION_RENDERERS = [
    'renderMeta', 'renderNavigation', 'renderHero', 'renderAbout',
    'renderEducation', 'renderSkills', 'renderProjects', 'renderExperience',
    'renderCertificates', 'renderContact', 'renderFooter'
  ];

  function resolveLocale() {
    const attr = (document.documentElement.getAttribute('lang') || '').trim().toLowerCase();
    if (attr) {
      const short = attr.split('-')[0];
      if (short === 'en' || short === 'vi') return short;
    }
    return DEFAULT_LOCALE;
  }

  class PortfolioRenderer {

    constructor() {
      this.data = {};
      this.initialized = false;
      this.locale = resolveLocale();
    }

    async init() {
      if (this.initialized) return;
      try {
        await this.loadData();
        await this.render();
        this.initialized = true;
        document.body.classList.add('portfolio-rendered');
        window.dispatchEvent(new CustomEvent('portfolio:rendered', { detail: { locale: this.locale } }));
      } catch (error) {
        console.error('[PortfolioRenderer] Init failed:', error);
      }
    }

    /**
     * Reload the renderer for a new locale without re-creating the
     * renderer instance. Skipped when the locale is unchanged so
     * repeated calls do not trigger duplicate fetches.
     *
     * @param {string} locale
     * @returns {Promise<boolean>} true when the locale was applied.
     */
    async reload(locale) {
      const next = this._sanitizeLocale(locale);
      if (!next) return false;
      if (next === this.locale && this.initialized) return true;

      this.locale = next;
      document.documentElement.setAttribute('lang', next);

      // Drop the project modal so it gets rebuilt with the new locale
      // by renderProjectModal() below.
      const existingModal = document.getElementById('projectModal');
      if (existingModal) existingModal.remove();

      try {
        await this.loadData();
        await this.render();
        if (!this.initialized) {
          this.initialized = true;
          document.body.classList.add('portfolio-rendered');
        }
        window.dispatchEvent(new CustomEvent('portfolio:rendered', { detail: { locale: this.locale } }));
        return true;
      } catch (error) {
        console.error('[PortfolioRenderer] Reload failed:', error);
        return false;
      }
    }

    _sanitizeLocale(value) {
      const v = String(value ?? '').trim().toLowerCase();
      const short = v.split('-')[0];
      return short === 'en' || short === 'vi' ? short : '';
    }

    // ==========================================================
    // DATA
    // ==========================================================

    async loadData() {
      const base = LOCALE_BASE + this.locale + '/';
      const results = await Promise.all(SOURCES.map(([, file]) => this.fetchJSON(base + file)));
      this.data = SOURCES.reduce((acc, [key], i) => (acc[key] = results[i], acc), {});
    }

    async fetchJSON(url) {
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        console.warn(`[PortfolioRenderer] ${url} failed:`, error);
        return null;
      }
    }

    // ==========================================================
    // UI STRING LOOKUP
    // ==========================================================

    /**
     * Resolve a dotted path against this.data.
     * Returns the resolved value or undefined.
     */
    resolvePath(path) {
      return path?.split('.').reduce((acc, key) => acc?.[key], this.data);
    }

    /**
     * Resolve a dotted path against a JSON namespace.
     * Returns the resolved value or the fallback.
     */
    resolveNs(namespace, path, fallback) {
      const ns = this.data[namespace];
      if (!ns) return fallback;
      const value = path?.split('.').reduce((acc, key) => acc?.[key], ns);
      return value !== undefined && value !== null ? value : fallback;
    }

    // ==========================================================
    // DISPATCHER
    // ==========================================================

    async render() {
      for (const method of SECTION_RENDERERS) {
        try { await this[method](); }
        catch (error) { console.error(`[PortfolioRenderer] ${method} failed:`, error); }
      }
      this.renderProjectModal();
    }

    // ==========================================================
    // META / SEO
    // ==========================================================

    renderMeta() {
      document.querySelectorAll('[data-json]').forEach((el) => {
        const value = this.resolvePath(el.getAttribute('data-json'));
        if (value === undefined || value === null) return;
        if (el.tagName === 'META')            el.setAttribute('content', value);
        else if (el.tagName === 'LINK')       el.setAttribute('href', value);
        else if (el.tagName !== 'TITLE')      el.textContent = value;
      });

      const author = this.safe(this.data.profile?.meta?.author);
      const authorTitle = this.safe(this.data.profile?.meta?.author_title);
      const seoTitle = this.safe(this.data.profile?.seo?.title);
      if (seoTitle) {
        document.title = seoTitle;
      } else if (author && authorTitle) {
        document.title = `${author} — ${authorTitle}`;
      }
    }

    // ==========================================================
    // NAVIGATION
    // ==========================================================

    renderNavigation() {
      const profile = this.data.profile;
      const nav = profile?.navigation;
      const access = profile?.navigation?.accessibility;

      const skipLink = document.querySelector('.skip-link');
      if (skipLink && access?.skip_to_main) skipLink.textContent = access.skip_to_main;

      const navEl = document.querySelector('nav.navbar');
      if (navEl && access?.primary_nav) navEl.setAttribute('aria-label', access.primary_nav);

      const toggler = document.querySelector('.navbar-toggler');
      if (toggler && access?.toggle_nav) toggler.setAttribute('aria-label', access.toggle_nav);

      const brand = document.querySelector('.navbar-brand');
      if (brand && access?.home_link) brand.setAttribute('aria-label', access.home_link);

      const brandLogo = document.querySelector('.navbar-brand .brand-logo');
      if (brandLogo && brandLogo.tagName === 'IMG' && access?.brand_logo_alt) {
        brandLogo.alt = access.brand_logo_alt;
      }

      const themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) {
        if (access?.toggle_theme) {
          themeBtn.setAttribute('aria-label', access.toggle_theme);
          themeBtn.setAttribute('title', access.toggle_theme);
        }
        if (access?.theme_light) themeBtn.setAttribute('data-label-light', access.theme_light);
        if (access?.theme_dark) themeBtn.setAttribute('data-label-dark', access.theme_dark);
      }

      const list = document.querySelector('.navbar-nav');
      if (list && Array.isArray(nav?.primary) && nav.primary.length) {
        list.innerHTML = nav.primary.map((item) => `
          <li class="nav-item">
            <a class="nav-link" href="${this.escape(item.href)}" data-section="${this.escape(item['data-section'] || item.href.replace('#', ''))}">${this.escape(item.label)}</a>
          </li>
        `).join('');
      }

      document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        const target = link.getAttribute('href')?.replace('#', '');
        const section = target && document.getElementById(target);
        if (section?.classList.contains('d-none')) {
          link.parentElement?.classList.add('d-none');
        }
      });
    }

    // ==========================================================
    // HERO
    // ==========================================================

    renderHero() {
      const p = this.data.profile;
      if (!p) return;
      const meta = p.meta ?? {};
      const hero = p.hero ?? {};
      const seo = p.seo ?? {};

      // Hero section aria-label — derived from the localized SEO title
      // so screen-readers announce the same heading the document title
      // carries. Falls back to branding.site_name.
      const sectionEl = document.getElementById('home');
      if (sectionEl) {
        const sectionLabel = seo.title || p.branding?.site_name || '';
        sectionEl.setAttribute('aria-label', sectionLabel);
      }

      const greeting = document.querySelector('.hero-greeting');
      if (greeting && hero.greeting) {
        greeting.innerHTML = `<span class="hero-greeting-line"></span>${this.escape(hero.greeting)}`;
      }

      this.setText('.hero-name', meta.author);
      this.setText('.hero-description', hero.headline);

      // Image alt: use only the author name (locale-aware). The previous
      // implementation used a hardcoded "Portrait of …" English template.
      const authorName = this.safe(meta.author);
      const heroImg = document.querySelector('.hero-image');
      if (heroImg && hero.avatar) {
        heroImg.src = hero.avatar;
        heroImg.alt = authorName;
      }

      const aboutImg = document.querySelector('.about-image');
      if (aboutImg) {
        const src = hero.about_avatar || hero.avatar;
        if (src) {
          aboutImg.src = src;
          aboutImg.alt = authorName;
        }
      }

      // Hero "availability" badge — text + icon driven by JSON. The
      // element is [hidden] in markup; once the renderer populates it
      // (and `hero.availability` is present) we reveal it. This avoids
      // a "blank pill" on first paint or when the field is missing.
      const badge = document.querySelector('.hero-badge');
      if (badge) {
        const availabilityText = this.safe(hero.availability);
        if (availabilityText) {
          const icon = badge.querySelector('i');
          if (icon && hero.badge_icon) icon.className = `bi ${hero.badge_icon}`;
          const text = badge.querySelector('.hero-badge__text');
          if (text) text.textContent = availabilityText;
          badge.removeAttribute('hidden');
        } else {
          badge.setAttribute('hidden', '');
        }
      }

      this.renderCTA(hero.cta_primary, '.hero-cta .btn-primary');
      this.renderCTA(hero.cta_secondary, '.hero-cta .btn-outline-primary');

      // Each CTA also receives an explicit aria-label (currently the
      // element ships with aria-label="" in markup). The renderer
      // reuses the visible label so screen-readers always have a
      // localized string even if CSS hides the text.
      const setBtnAria = (config, selector) => {
        if (!config || !config.label) return;
        const btn = document.querySelector(selector);
        if (btn) btn.setAttribute('aria-label', config.label);
      };
      setBtnAria(hero.cta_primary, '.hero-cta .btn-primary');
      setBtnAria(hero.cta_secondary, '.hero-cta .btn-outline-primary');

      this.renderSocialSlots('.hero-social-link', p.social, ['github', 'linkedin', 'email', 'resume']);
      this.setText('#typewriter', meta.author_title);

      const scrollText = document.querySelector('.scroll-indicator-text');
      if (scrollText && hero.scroll?.text) scrollText.textContent = hero.scroll.text;
      const scrollLink = document.querySelector('.scroll-indicator');
      if (scrollLink && hero.scroll?.aria_label) scrollLink.setAttribute('aria-label', hero.scroll.aria_label);
    }

    renderCTA(config, selector) {
      if (!config) return;
      const el = document.querySelector(selector);
      if (!el) return;
      if (config.href) el.href = config.href;
      el.innerHTML = this.buttonInner(config);
    }

    // ==========================================================
    // ABOUT
    // ==========================================================

    renderAbout() {
      const about = this.data.about?.about;
      if (!about) return;

      // Section aria-label — derived from the localized section title so
      // screen-readers announce the same heading as the visible H2.
      const aboutSection = document.querySelector('.about-section');
      if (aboutSection && about.section_title) {
        aboutSection.setAttribute('aria-label', about.section_title);
      }

      this.bindPath('.about-section [data-json]', about);

      // Block labels: rendered by injecting the localized string after
      // the existing <i> icon (which is purely decorative — already
      // aria-hidden via Bootstrap Icons conventions).
      const setBlockLabel = (selector, key) => {
        const el = document.querySelector(selector);
        if (!el) return;
        const text = this.safe(about.labels?.[key]);
        if (!text) return;
        const iconHtml = el.querySelector('i')?.outerHTML ?? '';
        el.innerHTML = `${iconHtml} ${this.escape(text)}`;
      };
      setBlockLabel('.about-block:nth-of-type(1) .about-block-title', 'introduction');
      setBlockLabel('.about-block:nth-of-type(2) .about-block-title', 'career_objective');
      setBlockLabel('.about-block:nth-of-type(3) .about-block-title', 'quick_info');

      const introBlocks = document.querySelectorAll('.about-block:first-of-type .about-text');
      const intros = about.introduction ?? [];
      introBlocks.forEach((el, i) => { if (intros[i]) el.textContent = intros[i]; });

      this.setText('.about-block:nth-of-type(2) .about-text', about.career_objective);
      this.renderQuickInfo(this.data.about.quick_info);

      // CV download link — defensive: only fills if the markup exists.
      const cvLink = document.querySelector('.about-cta .btn-outline-primary');
      if (cvLink && this.data.about.cv_url) cvLink.href = this.data.about.cv_url;
    }

    renderQuickInfo(qi) {
      const labels = this.data.about?.quick_info?.labels || {};
      const mapping = [
        ['location',       'location'],
        ['education',      'education'],
        ['specialization', 'specialization'],
        ['career_goal',    'career_goal']
      ];
      const cards = document.querySelectorAll('.about-quick-info');
      cards.forEach((card, i) => {
        const [key, labelKey] = mapping[i] ?? [];
        if (!key) return;
        const valueEl = card.querySelector('.about-quick-info-value');
        const labelEl = card.querySelector('.about-quick-info-label');
        if (!valueEl || !labelEl) return;
        const value = this.safe(qi?.[key]);
        if (value) {
          valueEl.textContent = value;
          labelEl.textContent = this.safe(labels[labelKey], key);
        } else {
          card.parentElement?.classList.add('d-none');
        }
      });
    }

    // ==========================================================
    // EDUCATION
    // ==========================================================

    renderEducation() {
      const edu = this.data.experience?.education;
      const timeline = document.querySelector('.timeline-education');
      if (!timeline) return;

      if (!edu) { this.hideSection('.about-education'); return; }

      const labels = this.data.experience?.ui?.labels || {};
      const period = `${this.safe(edu.start_date)} ${this.safe(this.data.experience?.ui?.date_separator)} ${this.safe(edu.end_date, labels.present)}`;
      const statusBadge = edu.status ? `<span class="badge bg-primary">${this.escape(edu.status)}</span>` : '';

      timeline.innerHTML = `
        <li class="timeline-item" data-animate>
          <div class="timeline-marker"><i class="bi bi-mortarboard-fill"></i></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div>
                <h4 class="timeline-title">${this.escape(this.safe(edu.degree))}</h4>
                <p class="timeline-subtitle">
                  <span>${this.escape(this.safe(edu.institution))}</span>
                  <span class="timeline-divider">${this.escape(this.data.experience?.ui?.divider)}</span>
                  <span>${this.escape(period)}</span>
                </p>
              </div>
              ${statusBadge}
            </div>
            ${edu.description ? `<div class="timeline-body mt-3"><p>${this.escape(edu.description)}</p></div>` : ''}
            ${this.renderTags(edu.tags)}
          </div>
        </li>
      `;

      this.bindPath('.about-education [data-json]', edu);

      const aboutEduSection = document.querySelector('.about-education');
      if (aboutEduSection) {
        const ariaEl = aboutEduSection.querySelector('[aria-label]');
        if (ariaEl && edu.section?.aria_label) ariaEl.setAttribute('aria-label', edu.section.aria_label);
      }
    }

    // ==========================================================
    // SKILLS
    // ==========================================================

    renderSkills() {
      const skills = this.data.skills;
      const section = skills?.section || {};
      const grid = document.querySelector('.skills-grid');
      if (!grid) return;

      // Section aria-label — derived from the localized section title so
      // screen-readers announce the same heading as the visible H2.
      const skillsSection = document.querySelector('.skills-section');
      if (skillsSection && section.title) {
        skillsSection.setAttribute('aria-label', section.title);
      }

      const titleEl = document.querySelector('.skills-section .section-title');
      const subtitleEl = document.querySelector('.skills-section .section-subtitle');
      if (titleEl && section.title) titleEl.textContent = section.title;
      if (subtitleEl && section.subtitle) subtitleEl.textContent = section.subtitle;

      const categories = skills?.skill_categories ?? [];
      if (!categories.length) { this.hideSection('#skills'); return; }

      const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      grid.innerHTML = sorted.map((cat) => this.renderSkillCategory(cat)).join('');

      this.renderLanguages(skills?.languages);
      this.toggleExtraCard('.tools-grid', skills?.skill_categories?.find((c) => c.id === 'tools')?.skills?.length);
      this.toggleExtraCard('.languages-grid', skills?.languages?.length);

      const languagesTitle = document.querySelector('.languages-grid')?.closest('.additional-skills-card')?.querySelector('.additional-skills-title');
      if (languagesTitle && skills?.ui?.card_title) {
        const icon = languagesTitle.querySelector('i');
        const iconHtml = icon ? icon.outerHTML + ' ' : '';
        languagesTitle.innerHTML = `${iconHtml}${this.escape(skills.ui.card_title)}`;
      }
    }

    renderSkillCategory(cat) {
      const description = cat.description ? `<p class="skill-card-description">${this.escape(cat.description)}</p>` : '';
      const icon = cat.icon ? `<i class="bi ${cat.icon}"></i>` : '';
      return `
        <div class="col-md-6 col-lg-4" data-animate>
          <div class="skill-card">
            <div class="skill-card-header">
              ${icon}
              <h3 class="skill-card-title">${this.escape(this.safe(cat.name))}</h3>
            </div>
            ${description}
            <div class="skill-list">
              ${(cat.skills ?? []).map((s) => this.renderSkillItem(s)).join('')}
            </div>
          </div>
        </div>
      `;
    }

    renderSkillItem(skill) {
      const icon = this.renderSkillIcon(skill.icon);
      const level = typeof skill.level === 'number'
        ? `<span class="skill-level">${skill.level}%</span>`
        : '';
      const years = skill.years
        ? `<span class="skill-years">${skill.years}y</span>`
        : '';
      return `
        <div class="skill-item" data-bs-toggle="tooltip" data-bs-placement="top"
             title="${this.escape(this.safe(skill.name))}">
          ${icon}
          <div class="skill-info">
            <span class="skill-name">${this.escape(this.safe(skill.name))}</span>
            <div class="skill-meta">
              ${level}${years}
            </div>
          </div>
        </div>
      `;
    }

    renderSkillIcon(icon) {
      if (!icon) return '';
      const isBootstrap = icon.startsWith(BOOTSTRAP_ICON_PREFIX);
      const isSvg = icon.toLowerCase().endsWith('.svg');
      if (isBootstrap) return `<i class="bi ${icon}" aria-hidden="true"></i>`;
      const src = icon.startsWith('http') || icon.startsWith('/') ? icon : `${ASSET_BASE}${icon}`;
      return `<img src="${src}" alt="" class="skill-logo" loading="lazy" />`;
    }

    renderLanguages(languages) {
      const grid = document.querySelector('.languages-grid');
      if (!grid || !languages?.length) return;
      grid.innerHTML = languages.map((lang) => `
        <div class="language-item" data-animate>
          <span class="language-name">${this.escape(this.safe(lang.name))}</span>
          <span class="language-level">${this.escape(this.safe(lang.level))}</span>
        </div>
      `).join('');
    }

    toggleExtraCard(selector, hasData) {
      const card = document.querySelector(selector)?.closest('.additional-skills-card');
      if (!card) return;
      card.classList.toggle('d-none', !hasData);
    }

    // ==========================================================
    // PROJECTS
    // ==========================================================

    renderProjects() {
      const projects = this.data.projects?.projects ?? [];
      const section = this.data.projects?.section || {};

      // Section aria-label — derived from the localized section title so
      // screen-readers announce the same heading as the visible H2.
      const projectsSection = document.querySelector('.projects-section');
      if (projectsSection && section.title) {
        projectsSection.setAttribute('aria-label', section.title);
      }

      const titleEl = document.querySelector('.projects-section .section-title');
      const subtitleEl = document.querySelector('.projects-section .section-subtitle');
      if (titleEl && section.title) titleEl.textContent = section.title;
      if (subtitleEl && section.subtitle) subtitleEl.textContent = section.subtitle;

      if (!projects.length) { this.hideSection('#projects'); return; }

      const featured = projects.find((p) => p.featured) ?? null;
      const rest = projects.filter((p) => !p.featured);

      this.renderFeaturedProject(featured);
      this.renderProjectGrid(rest);
    }

    renderFeaturedProject(project) {
      const wrap = document.querySelector('.projects-featured');
      const row = wrap?.querySelector('.row');
      if (!row) return;
      if (!project) { wrap?.classList.add('d-none'); return; }
      wrap?.classList.remove('d-none');
      row.innerHTML = `<div class="col-12">${this.renderProjectCard(project, { featured: true })}</div>`;
    }

    renderProjectGrid(projects) {
      const row = document.querySelector('.projects-grid .row');
      if (!row) return;
      row.innerHTML = projects.map((project) => `
        <div class="col-md-6 col-lg-4">${this.renderProjectCard(project, { featured: false })}</div>
      `).join('');
    }

    renderProjectCard(project, { featured = false } = {}) {
      const ui = this.data.projects?.ui || {};
      const labels = ui.buttons || {};
      const tags = this.renderTags(project.technologies, { limit: featured ? null : 4 });
      const github = this.renderProjectLink(project.links?.github, 'btn-light', 'bi-github', labels.view_code, featured);
      const demo   = this.renderProjectLink(project.links?.demo,   'btn-primary', 'bi-box-arrow-up-right', labels.live_demo, featured);

      const featuredBadgeLabel = ui.badges?.featured || labels.featured;
      const featuredBadge = featured
        ? `<span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>${this.escape(featuredBadgeLabel)}</span>`
        : '';
      const image = `
        <div class="project-card-image">
          <img src="${this.escape(this.safe(project.thumbnail))}"
               alt="${this.escape(this.safe(project.thumbnail_alt, project.title))}"
               class="img-fluid" width="${featured ? 600 : 400}" height="${featured ? 400 : 250}" loading="lazy" />
          <div class="project-card-overlay">${github}${demo}</div>
        </div>
      `;

      const meta = `
        <div class="project-card-meta">
          ${project.category ? `<span class="badge bg-primary">${this.escape(project.category)}</span>` : ''}
          ${featuredBadge}
        </div>
      `;
      const description = this.safe(project.short_description);
      const viewDetails = labels.view_details;
      const links = `
        <div class="project-card-links">
          <button type="button" class="project-link"
                  data-bs-toggle="modal" data-bs-target="#projectModal"
                  data-project-id="${this.escape(this.safe(project.id))}">
            <i class="bi bi-journal-text"></i><span>${this.escape(viewDetails)}</span>
          </button>
        </div>
      `;
      const cardClass = featured ? 'project-card project-card-featured' : 'project-card project-card-standard';
      const safeId = this.escape(this.safe(project.id));
      const title = this.escape(this.safe(project.title));

      if (featured) {
        return `
          <article class="${cardClass}" data-animate data-project-id="${safeId}">
            <div class="row g-0">
              <div class="col-lg-6">${image}</div>
              <div class="col-lg-6">
                <div class="project-card-content">
                  ${meta}
                  <h3 class="project-card-title">${title}</h3>
                  <p class="project-card-overview">${this.escape(description)}</p>
                  ${tags}${links}
                </div>
              </div>
            </div>
          </article>
        `;
      }
      return `
        <article class="${cardClass}" data-animate data-project-id="${safeId}">
          ${image}
          <div class="project-card-content">
            ${meta}
            <h3 class="project-card-title">${title}</h3>
            <p class="project-card-overview">${this.escape(description)}</p>
            ${tags}${links}
          </div>
        </article>
      `;
    }

    renderProjectLink(url, btnClass, iconClass, label, featured = false) {
      if (!url || url === '#') return '';
      const external = url.startsWith('http');
      const margin = featured ? 'me-2' : '';
      return `
        <a href="${this.escape(url)}" class="btn ${btnClass} btn-sm"
           ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          <i class="bi ${iconClass} ${margin}"></i>${this.escape(this.safe(label))}
        </a>
      `;
    }

    // ==========================================================
    // PROJECT MODAL
    // ==========================================================

    renderProjectModal() {
      const ui = this.data.projects?.ui?.modal || {};
      const title = this.safe(ui.title);
      const closeBtn = this.safe(ui.close);
      const viewCode = this.safe(ui.view_code);
      const liveDemo = this.safe(ui.live_demo);

      if (document.getElementById('projectModal')) return;
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="projectModalLabel">${this.escape(title)}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${this.escape(closeBtn)}">${this.escape(closeBtn)}</button>
              </div>
              <div class="modal-body" id="projectModalBody"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">${this.escape(closeBtn)}</button>
                <a href="#" class="btn btn-primary d-none" id="projectModalGithub" target="_blank" rel="noopener noreferrer">
                  <i class="bi bi-github me-2"></i>${this.escape(viewCode)}
                </a>
                <a href="#" class="btn btn-success d-none" id="projectModalDemo" target="_blank" rel="noopener noreferrer">
                  <i class="bi bi-box-arrow-up-right me-2"></i>${this.escape(liveDemo)}
                </a>
              </div>
            </div>
          </div>
        </div>
      `);
      document.getElementById('projectModal')?.addEventListener('show.bs.modal', (event) => {
        const id = event.relatedTarget?.dataset?.projectId;
        if (id) this.renderProjectDetails(id);
      });
    }

    renderProjectDetails(projectId) {
      const project = (this.data.projects?.projects ?? []).find((p) => p.id === projectId);
      if (!project) return;

      const ui = this.data.projects?.ui?.modal || {};
      const titleEl = document.getElementById('projectModalLabel');
      const bodyEl  = document.getElementById('projectModalBody');
      if (titleEl) titleEl.textContent = this.safe(project.title);
      if (bodyEl)  bodyEl.innerHTML   = this.buildModalBody(project);

      this.toggleModalAction(document.getElementById('projectModalGithub'), project.links?.github);
      this.toggleModalAction(document.getElementById('projectModalDemo'),   project.links?.demo);
    }

    toggleModalAction(el, url) {
      if (!el) return;
      if (url && url !== '#') { el.classList.remove('d-none'); el.href = url; }
      else { el.classList.add('d-none'); el.removeAttribute('href'); }
    }

    buildModalBody(project) {
      const d = project.details ?? {};
      const ui = this.data.projects?.ui?.modal || {};
      return [
        this.modalImages(d.images, project),
        this.modalGallery(d.gallery, ui.gallery),
        this.modalText(ui.problem,         'bi-question-circle', d.problem),
        this.modalText(ui.solution,        'bi-lightbulb',       d.solution),
        this.modalList(ui.features,        'bi-list-check',      d.features),
        this.modalList(ui.architecture,    'bi-diagram-3',       d.architecture),
        this.modalList(ui.responsibilities,'bi-person-check',    d.responsibilities),
        this.modalText(ui.challenges,      'bi-shield-check',    d.challenges),
        this.modalCaseStudy(d.case_study, ui.case_study),
        this.modalImage(ui.diagram, d.diagram),
        this.modalTech(project.technologies, ui.technologies),
        this.modalLead(project.description || project.short_description)
      ].filter(Boolean).join('');
    }

    modalImages(images, project) {
      if (!images?.length) return null;
      return `<div class="project-modal-images mb-4">${images.map((src) =>
        `<img src="${this.escape(src)}" alt="${this.escape(this.safe(project.title))}"
              class="img-fluid rounded mb-2" loading="lazy" />`).join('')}</div>`;
    }

    modalGallery(gallery, title) {
      if (!gallery?.length) return null;
      const t = this.safe(title);
      return `
        <div class="mb-4">
          <h6><i class="bi bi-images me-2"></i>${this.escape(t)}</h6>
          <div class="project-modal-gallery row g-2">${gallery.map((src) =>
            `<img src="${this.escape(src)}" alt="" class="img-fluid rounded" loading="lazy" />`).join('')}</div>
        </div>`;
    }

    modalText(title, icon, text) {
      if (!text) return null;
      const t = this.safe(title);
      return `
        <div class="mb-4">
          <h6><i class="bi ${icon} me-2"></i>${this.escape(t)}</h6>
          <p>${this.escape(text)}</p>
        </div>`;
    }

    modalList(title, icon, items) {
      if (!items?.length) return null;
      const t = this.safe(title);
      return `
        <div class="mb-4">
          <h6><i class="bi ${icon} me-2"></i>${this.escape(t)}</h6>
          <ul>${items.map((item) => `<li>${this.escape(item)}</li>`).join('')}</ul>
        </div>`;
    }

    modalImage(title, src) {
      if (!src) return null;
      const t = this.safe(title);
      return `
        <div class="mb-4">
          <h6><i class="bi bi-diagram-3 me-2"></i>${this.escape(t)}</h6>
          <img src="${this.escape(src)}" alt="${this.escape(t)}" class="img-fluid rounded" loading="lazy" />
        </div>`;
    }

    modalCaseStudy(text, title) {
      if (!text) return null;
      const t = this.safe(title);
      return `
        <div class="mb-4">
          <h6><i class="bi bi-journal-text me-2"></i>${this.escape(t)}</h6>
          <p>${this.escape(text)}</p>
        </div>`;
    }

    modalTech(techs, title) {
      if (!techs?.length) return null;
      const t = this.safe(title);
      return `
        <div class="project-modal-tech mb-3">
          <h6><i class="bi bi-tools me-2"></i>${this.escape(t)}</h6>
          ${this.renderTags(techs)}
        </div>`;
    }

    modalLead(text) {
      if (!text) return null;
      return `<p class="project-modal-description lead">${this.escape(text)}</p>`;
    }

    // ==========================================================
    // EXPERIENCE
    // ==========================================================

    renderExperience() {
      const jobs = this.data.experience?.experience ?? [];
      const section = this.data.experience?.section || {};
      const timeline = document.querySelector('.experience-section .timeline');
      if (!jobs.length) { this.hideSection('#experience'); return; }
      if (!timeline) return;
      if (section.aria_label) timeline.setAttribute('aria-label', section.aria_label);

      const titleEl = document.querySelector('.experience-section .section-title');
      const subtitleEl = document.querySelector('.experience-section .section-subtitle');
      if (titleEl && section.title) titleEl.textContent = section.title;
      if (subtitleEl && section.subtitle) subtitleEl.textContent = section.subtitle;

      const sorted = [...jobs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      timeline.innerHTML = sorted.map((job) => this.renderExperienceItem(job)).join('');
    }

    renderExperienceItem(job) {
      const ui = this.data.experience?.ui || {};
      const labels = ui.labels || {};
      const isCurrent = Boolean(job.current);
      const icon = this.experienceIcon(job);
      const dateLabel = isCurrent
        ? `${this.safe(job.start_date)} ${this.safe(ui.date_separator)} ${this.safe(labels.present)}`
        : `${this.safe(job.start_date)} ${this.safe(ui.duration_separator)} ${this.safe(job.end_date)}`;
      const badgeClass = isCurrent ? 'bg-primary' : 'bg-secondary';
      const badgeText = isCurrent ? this.safe(labels.current) : this.safe(job.type, labels.past);
      const locationMarkup = job.location ? `<span class="timeline-divider">${this.escape(ui.divider)}</span><span>${this.escape(job.location)}</span>` : '';
      const durationMarkup = job.duration_text ? `
        <span class="timeline-meta-item"><i class="bi bi-clock"></i>${this.escape(job.duration_text)}</span>` : '';
      const highlightsMarkup = job.highlights?.length ? `
        <div class="timeline-body mt-3">
          <ul class="timeline-list">${job.highlights.map((h) => `<li>${this.escape(h)}</li>`).join('')}</ul>
        </div>` : '';

      return `
        <li class="timeline-item" data-animate>
          <div class="timeline-marker"><i class="bi ${icon}"></i></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div>
                <h4 class="timeline-title">${this.escape(this.safe(job.job_title))}</h4>
                <p class="timeline-subtitle">
                  <span>${this.escape(this.safe(job.company))}</span>
                  ${locationMarkup}
                </p>
              </div>
              <span class="badge ${badgeClass}">${this.escape(badgeText)}</span>
            </div>
            <div class="timeline-meta">
              <span class="timeline-meta-item"><i class="bi bi-calendar3"></i>${this.escape(dateLabel)}</span>
              ${durationMarkup}
            </div>
            ${highlightsMarkup}
            ${this.renderTags(job.technologies)}
          </div>
        </li>
      `;
    }

    experienceIcon(job) {
      const icons = {
        internship:  'bi-mortarboard',
        'full-time': 'bi-briefcase-fill',
        'part-time': 'bi-briefcase',
        freelance:   'bi-laptop',
        contract:    'bi-file-earmark-text',
        education:   'bi-mortarboard-fill'
      };
      return icons[job.type] ?? 'bi-briefcase';
    }

    // ==========================================================
    // CERTIFICATES
    // ==========================================================

    renderCertificates() {
      const certs = this.data.certificates?.certificates ?? [];
      const ui = this.data.certificates?.ui || {};
      const section = this.data.certificates?.section || {};
      const grid = document.querySelector('.certificates-section .row.g-4');

      const titleEl = document.querySelector('.certificates-section .section-title');
      const subtitleEl = document.querySelector('.certificates-section .section-subtitle');
      if (titleEl && section.title) titleEl.textContent = section.title;
      if (subtitleEl && section.subtitle) subtitleEl.textContent = section.subtitle;

      if (!certs.length) { this.hideSection('#certificates'); return; }
      if (!grid) return;
      grid.innerHTML = certs.map((cert) => this.renderCertificateCard(cert, ui)).join('');
    }

    renderCertificateCard(cert, ui) {
      const labels = ui?.labels || {};
      const fallbackAlt = this.safe(ui?.alt_fallback);
      const verifyLabel = this.safe(labels.verify);
      const issuerLabel = this.safe(labels.issuer);
      const issuedLabel = this.safe(labels.issued);
      const idLabel = this.safe(labels.id);

      const verifyLink = cert.credential_url ? `
        <a href="${this.escape(cert.credential_url)}" class="certificate-link" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-box-arrow-up-right"></i><span>${this.escape(verifyLabel)}</span>
        </a>` : '';
      const issuerLink = cert.issuer_url ? `
        <a href="${this.escape(cert.issuer_url)}" class="certificate-link" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-globe"></i><span>${this.escape(issuerLabel)}</span>
        </a>` : '';
      const preview = cert.image
        ? `<img src="${this.escape(cert.image)}" alt="${this.escape(this.safe(cert.name, fallbackAlt))}"
              class="img-fluid" width="400" height="280" loading="lazy" />`
        : `<i class="bi bi-patch-check-fill"></i>`;
      const issuerBadge = cert.issuer ? `<span class="badge bg-primary mb-2">${this.escape(cert.issuer)}</span>` : '';
      const issueDate = cert.issue_date ? `<p class="certificate-card-issuer">${this.escape(issuedLabel)}: ${this.escape(cert.issue_date)}</p>` : '';
      const credId = cert.credential_id ? `<p class="certificate-card-id">${this.escape(idLabel)}: ${this.escape(cert.credential_id)}</p>` : '';

      return `
        <div class="col-sm-6 col-lg-4">
          <article class="certificate-card" data-animate>
            <div class="certificate-card-preview">${preview}</div>
            <div class="certificate-card-body">
              ${issuerBadge}
              <h4 class="certificate-card-title">${this.escape(this.safe(cert.short_name, cert.name))}</h4>
              ${issueDate}${credId}
            </div>
            <div class="certificate-card-footer">${verifyLink}${issuerLink}</div>
          </article>
        </div>
      `;
    }

    // ==========================================================
    // CONTACT
    // ==========================================================

    renderContact() {
      const contact = this.data.contact;
      if (!contact) return;

      const section = contact.section || {};

      // Section aria-label — derived from the localized section title so
      // screen-readers announce the same heading as the visible H2.
      const contactSection = document.querySelector('.contact-section');
      if (contactSection && section.title) {
        contactSection.setAttribute('aria-label', section.title);
      }

      const titleEl = document.querySelector('.contact-section .section-title');
      const subtitleEl = document.querySelector('.contact-section .section-subtitle');
      if (titleEl && section.title) titleEl.textContent = section.title;
      if (subtitleEl && section.subtitle) subtitleEl.textContent = section.subtitle;

      this.renderContactInfo(contact.contact_info, contact.ui?.footer);
      this.renderContactSocials(contact.socials);
      this.renderContactForm(contact.form);
      this.renderContactFooter(contact.ui?.footer);
    }

    renderContactInfo(info, footerUi) {
      if (!info) return;
      const emailLink = document.querySelector('.contact-info-item a[href^="mailto:"]');
      if (emailLink) {
        if (info.email) {
          emailLink.href = `mailto:${info.email}`;
          const span = emailLink.querySelector('span');
          if (span) span.textContent = info.email;
        } else {
          emailLink.closest('.contact-info-item')?.classList.add('d-none');
        }
      }
      const locationItem = document.querySelectorAll('.contact-info-item')[1];
      if (locationItem) {
        const span = locationItem.querySelector('span');
        if (info.location) { if (span) span.textContent = info.location; }
        else { locationItem.classList.add('d-none'); }
      }
    }

    renderContactForm(formConfig) {
      const form = document.querySelector('.contact-form form');
      if (!form || !formConfig?.fields?.length) return;
      const labels = this.data.contact?.ui?.form_labels || {};
      formConfig.fields.forEach((field) => {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (!input) return;
        const labelEl = form.querySelector(`label[for="${field.name}"]`);
        if (labelEl && labels[field.name]) labelEl.textContent = labels[field.name];
        if (field.placeholder) input.placeholder = field.placeholder;
        input.required = Boolean(field.required);
        if (field.min_length) input.minLength = field.min_length;
        if (field.max_length) input.maxLength = field.max_length;
      });

      const sendBtn = form.querySelector('.btn-submit .btn-text');
      const sendLabel = this.data.contact?.ui?.button?.send;
      if (sendBtn && sendLabel) sendBtn.textContent = sendLabel;
    }

    renderContactFooter(footerUi) {
      const contactFooter = document.querySelector('.site-footer .footer-contact-link[href^="mailto:"]');
      if (contactFooter && footerUi?.email_label) {
        const span = contactFooter.querySelector('span');
        if (span) span.textContent = footerUi.email_label;
      }
      const locationFooter = document.querySelector('.site-footer .footer-contact-item');
      if (locationFooter && footerUi?.location_label) {
        const span = locationFooter.querySelector('span:last-child');
        if (span) span.textContent = footerUi.location_label;
      }
    }

    // ==========================================================
    // FOOTER
    // ==========================================================

    renderFooter() {
      const profile = this.data.profile;
      if (!profile) return;

      const author = profile.meta?.author ?? profile.name;
      const footerUi = profile.footer || {};
      const navUi = profile.navigation || {};

      const nameEl = document.querySelector('.footer-logo .brand-name');
      if (nameEl) nameEl.textContent = this.safe(author);

      const logoLink = document.querySelector('.footer-logo');
      if (logoLink) {
        const accessHome = this.safe(profile.navigation?.accessibility?.home_link);
        logoLink.setAttribute('aria-label', `${this.safe(author)} — ${accessHome}`);
      }

      const info = this.data.contact?.contact_info;
      const footerEmail = document.querySelector('.footer-contact-link[href^="mailto:"]');
      if (footerEmail && info?.email) {
        footerEmail.href = `mailto:${info.email}`;
        const span = footerEmail.querySelector('span');
        if (span) span.textContent = info.email;
      }
      const footerLocation = document.querySelector('.footer-contact-item');
      if (footerLocation && info?.location) {
        const span = footerLocation.querySelector('span:last-child');
        if (span) span.textContent = info.location;
      }

      this.renderSocialSlots('.footer-social-link', profile.social, ['github', 'linkedin', 'email']);

      const yearEl = document.getElementById('current-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();

      const authorEl = document.querySelector('.footer-author');
      if (authorEl) authorEl.textContent = this.safe(author);

      const copyrightEl = document.querySelector('.footer-copyright');
      if (copyrightEl && footerUi.copyright) {
        const rights = this.safe(footerUi.all_rights_reserved);
        const template = footerUi.copyright
          .replace('{year}', `<span id="current-year">${yearEl ? yearEl.textContent : new Date().getFullYear()}</span>`)
          .replace('{author}', `<span class="footer-author">${this.escape(this.safe(author))}</span>`)
          .replace('{rights}', this.escape(rights));
        copyrightEl.innerHTML = template;
      }

      const navHeading = document.querySelector('.site-footer #footer-nav-heading');
      if (navHeading && footerUi.heading_navigation) navHeading.textContent = footerUi.heading_navigation;

      const contactHeading = document.querySelector('.site-footer #footer-contact-heading');
      if (contactHeading) {
        const title = this.data.contact?.section?.title;
        if (title) contactHeading.textContent = title;
        else if (footerUi.heading_contact) contactHeading.textContent = footerUi.heading_contact;
      }

      const linksList = document.querySelector('.site-footer .footer-links');
      if (linksList && Array.isArray(navUi.footer?.navigation)) {
        linksList.innerHTML = navUi.footer.navigation.map((item) => `
          <li role="listitem"><a href="${this.escape(item.href)}">${this.escape(item.label)}</a></li>
        `).join('');
      }

      const socialContainer = document.querySelector('.site-footer .footer-social');
      if (socialContainer && footerUi.social_aria) {
        socialContainer.setAttribute('aria-label', footerUi.social_aria);
      }

      const backToTop = document.getElementById('back-to-top');
      if (backToTop && profile.back_to_top) {
        if (profile.back_to_top.aria_label) backToTop.setAttribute('aria-label', profile.back_to_top.aria_label);
        if (profile.back_to_top.title) backToTop.setAttribute('title', profile.back_to_top.title);
      }
    }

    // ==========================================================
    // HELPERS
    // ==========================================================

    renderSocialSlots(selector, social, order) {
      const slots = document.querySelectorAll(selector);
      if (!social) { slots.forEach((s) => s.classList.add('d-none')); return; }
      const items = order.map((key) => social[key]).filter(Boolean);
      slots.forEach((slot, index) => {
        const item = items[index];
        if (!item) { slot.classList.add('d-none'); return; }
        slot.classList.remove('d-none');
        slot.href = this.normalizeHref(item.url, item.label);
        slot.setAttribute('aria-label', this.safe(item.label, item.url));
        if (item.url?.startsWith('http')) {
          slot.target = '_blank';
          slot.setAttribute('rel', 'noopener noreferrer');
        }
        this.injectSocialIcon(slot, item);
      });
    }

    injectSocialIcon(slot, item) {
      const host = slot.querySelector('.social-icon') || slot;
      host.innerHTML = this.buildSocialIcon(item);
    }

    buildSocialIcon(item) {
      const iconKey = (item.icon || '').trim();
      const label = this.safe(item.label);
      if (!iconKey) {
        return `<i class="bi bi-link-45deg" aria-hidden="true"></i>`;
      }
      if (iconKey.startsWith(BOOTSTRAP_ICON_PREFIX)) {
        return `<i class="bi ${this.escape(iconKey)}" aria-hidden="true"></i>`;
      }
      const src = iconKey.startsWith('http') || iconKey.startsWith('/')
        ? iconKey
        : (iconKey.endsWith('.svg') ? iconKey : `${ASSET_BASE}logos/${iconKey}.svg`);
      return `<img src="${this.escape(src)}" alt="${this.escape(label)}" class="social-icon-img" loading="lazy" />`;
    }

    renderContactSocials(socials) {
      if (!socials?.length) return;
      const slots = document.querySelectorAll('.contact-social a');
      slots.forEach((slot, index) => {
        const social = socials[index];
        if (!social) { slot.classList.add('d-none'); return; }
        slot.classList.remove('d-none');
        slot.href = this.normalizeHref(social.url, social.name);
        slot.setAttribute('aria-label', this.safe(social.name, social.url));
        if (social.url?.startsWith('http')) {
          slot.target = '_blank';
          slot.setAttribute('rel', 'noopener noreferrer');
        }
        this.injectSocialIcon(slot, social);
      });
    }

    safe(value, ...fallbacks) {
      if (value === null || value === undefined) {
        for (const fb of fallbacks) {
          if (fb !== undefined && fb !== null) return fb;
        }
        return '';
      }
      if (typeof value === 'string' && value.trim() === '') {
        for (const fb of fallbacks) {
          if (fb !== undefined && fb !== null) return fb;
        }
        return '';
      }
      return value;
    }

    setText(selector, value) {
      if (value === undefined || value === null) return;
      const el = document.querySelector(selector);
      if (el) el.textContent = value;
    }

    bindPath(selector, source) {
      document.querySelectorAll(selector).forEach((el) => {
        const key = el.getAttribute('data-json')?.split('.').pop();
        if (!key || !source) return;
        const value = source[key];
        if (value !== undefined && value !== null) el.textContent = value;
      });
    }

    hideSection(selector) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) return;
      el.classList.add('d-none');
      el.setAttribute('hidden', '');
    }

    escape(value) {
      if (value === null || value === undefined) return '';
      return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    normalizeHref(url, fallback) {
      if (!url) return '#';
      if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('#') || url.startsWith('/')) return url;
      if (url.includes('@')) return `mailto:${url}`;
      return url;
    }

    renderTags(items, { limit = null } = {}) {
      if (!Array.isArray(items) || !items.length) return '';
      const list = typeof limit === 'number' ? items.slice(0, limit) : items;
      return `<div class="timeline-tags tag-group">${list.map((t) => `<span class="tag">${this.escape(t)}</span>`).join('')}</div>`;
    }

    buttonInner(cta) {
      const icon = cta.icon ? `<i class="bi ${cta.icon} me-2"></i>` : '';
      return `${icon}${this.escape(this.safe(cta.label))}`;
    }
  }

  window.PortfolioRenderer = new PortfolioRenderer();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PortfolioRenderer.init());
  } else {
    window.PortfolioRenderer.init();
  }

})();
