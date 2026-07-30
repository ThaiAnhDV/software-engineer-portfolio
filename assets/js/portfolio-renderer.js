/**
 * Portfolio Renderer
 * --------------------------------------------------------------
 * Single-source renderer for the redesigned JSON data layer.
 * Loads all JSON files, resolves `data-json` selectors, renders
 * every section (meta, nav, hero, about, education, skills,
 * projects, experience, certificates, contact, footer) and
 * wires the project detail modal.
 *
 * Defensive: never throws if a section or field is missing.
 * Exposed globally as `window.PortfolioRenderer` and auto-started
 * on DOMContentLoaded.
 */
(function () {
  'use strict';

  const ASSET_BASE = 'assets/images/';
  const BOOTSTRAP_ICON_PREFIX = 'bi-';
  const FALLBACK_BRANDING = { initials: 'YN', site_name: 'Portfolio' };

  const SOURCES = [
    ['profile',      'data/profile.json'],
    ['about',        'data/about.json'],
    ['skills',       'data/skills.json'],
    ['projects',     'data/projects.json'],
    ['experience',   'data/experience.json'],
    ['certificates', 'data/certificates.json'],
    ['contact',      'data/contact.json']
  ];

  const SECTION_RENDERERS = [
    'renderMeta', 'renderNavigation', 'renderHero', 'renderAbout',
    'renderEducation', 'renderSkills', 'renderProjects', 'renderExperience',
    'renderCertificates', 'renderContact', 'renderFooter'
  ];

  class PortfolioRenderer {

    constructor() {
      this.data = {};
      this.initialized = false;
    }

    async init() {
      if (this.initialized) return;
      try {
        await this.loadData();
        await this.render();
        this.initialized = true;
        document.body.classList.add('portfolio-rendered');
        window.dispatchEvent(new CustomEvent('portfolio:rendered'));
      } catch (error) {
        console.error('[PortfolioRenderer] Init failed:', error);
      }
    }

    // ==========================================================
    // DATA
    // ==========================================================

    async loadData() {
      const results = await Promise.all(SOURCES.map(([, url]) => this.fetchJSON(url)));
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
      if (author && authorTitle) document.title = `${author} — ${authorTitle}`;
    }

    // ==========================================================
    // NAVIGATION
    // ==========================================================

    renderNavigation() {
      const brand = document.querySelector('.navbar-brand .brand-logo');
      if (brand && brand.tagName !== 'IMG') {
        brand.textContent = this.safe(
          this.data.profile?.branding?.initials,
          FALLBACK_BRANDING.initials
        );
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

      const greeting = document.querySelector('.hero-greeting');
      if (greeting && hero.greeting) {
        greeting.innerHTML = `<span class="hero-greeting-line"></span>${this.escape(hero.greeting)}`;
      }

      this.setText('.hero-name', meta.author);
      this.setText('.hero-description', hero.headline);

      const heroImg = document.querySelector('.hero-image');
      if (heroImg && hero.avatar) {
        heroImg.src = hero.avatar;
        heroImg.alt = `Portrait of ${this.safe(meta.author)}`;
      }

      const aboutImg = document.querySelector('.about-image');
      if (aboutImg) {
        const src = hero.about_avatar || hero.avatar;
        if (src) {
          aboutImg.src = src;
          aboutImg.alt = `Portrait of ${this.safe(meta.author)}`;
        }
      }

      const badge = document.querySelector('.hero-badge');
      if (badge) {
        const icon = badge.querySelector('i');
        if (icon && hero.badge_icon) icon.className = `bi ${hero.badge_icon}`;
        const text = badge.querySelector('span');
        if (text) text.textContent = this.safe(hero.availability);
      }

      this.renderCTA(hero.cta_primary, '.hero-cta .btn-primary');
      this.renderCTA(hero.cta_secondary, '.hero-cta .btn-outline-primary');
      this.renderSocialSlots('.hero-social-link', p.social, ['github', 'linkedin', 'email', 'resume']);
      this.setText('#typewriter', meta.author_title);
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

      this.bindPath('.about-section [data-json]', about);

      const introBlocks = document.querySelectorAll('.about-block:first-of-type .about-text');
      const intros = about.introduction ?? [];
      introBlocks.forEach((el, i) => { if (intros[i]) el.textContent = intros[i]; });

      this.setText('.about-block:nth-of-type(2) .about-text', about.career_objective);
      this.renderQuickInfo(this.data.about.quick_info);

      const cvLink = document.querySelector('.about-cta .btn-outline-primary');
      if (cvLink && this.data.about.cv_url) cvLink.href = this.data.about.cv_url;
    }

    renderQuickInfo(qi) {
      const mapping = [
        ['location',       'Location'],
        ['education',      'Education'],
        ['specialization', 'Specialization'],
        ['career_goal',    'Career Goal']
      ];
      const cards = document.querySelectorAll('.about-quick-info');
      cards.forEach((card, i) => {
        const [key, label] = mapping[i] ?? [];
        if (!key) return;
        const valueEl = card.querySelector('.about-quick-info-value');
        const labelEl = card.querySelector('.about-quick-info-label');
        if (!valueEl || !labelEl) return;
        const value = this.safe(qi?.[key]);
        if (value) {
          valueEl.textContent = value;
          labelEl.textContent = label;
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

      const period = `${this.safe(edu.start_date)} – ${this.safe(edu.end_date, 'Present')}`;
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
                  <span class="timeline-divider">•</span>
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
    }

    // ==========================================================
    // SKILLS
    // ==========================================================

    renderSkills() {
      const skills = this.data.skills;
      const grid = document.querySelector('.skills-grid');
      if (!grid) return;

      const categories = skills?.skill_categories ?? [];
      if (!categories.length) { this.hideSection('#skills'); return; }

      const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      grid.innerHTML = sorted.map((cat) => this.renderSkillCategory(cat)).join('');

      this.renderLanguages(skills?.languages);
      this.toggleExtraCard('.tools-grid', skills?.skill_categories?.find((c) => c.id === 'tools')?.skills?.length);
      this.toggleExtraCard('.languages-grid', skills?.languages?.length);
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
      const tags = this.renderTags(project.technologies, { limit: featured ? null : 4 });
      const github = this.renderProjectLink(project.links?.github, 'btn-light', 'bi-github', 'View Code', featured);
      const demo   = this.renderProjectLink(project.links?.demo,   'btn-primary', 'bi-box-arrow-up-right', 'Live Demo', featured);

      const image = `
        <div class="project-card-image">
          <img src="${this.escape(this.safe(project.thumbnail))}"
               alt="${this.escape(this.safe(project.thumbnail_alt, project.title))}"
               class="img-fluid" width="${featured ? 600 : 400}" height="${featured ? 400 : 250}" loading="lazy" />
          <div class="project-card-overlay">${github}${demo}</div>
        </div>
      `;

      const featuredBadge = featured
        ? `<span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>Featured</span>`
        : '';
      const meta = `
        <div class="project-card-meta">
          ${project.category ? `<span class="badge bg-primary">${this.escape(project.category)}</span>` : ''}
          ${featuredBadge}
        </div>
      `;
      const description = this.safe(project.short_description);
      const links = `
        <div class="project-card-links">
          <button type="button" class="project-link"
                  data-bs-toggle="modal" data-bs-target="#projectModal"
                  data-project-id="${this.escape(this.safe(project.id))}">
            <i class="bi bi-journal-text"></i><span>View Details</span>
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
          <i class="bi ${iconClass} ${margin}"></i>${label}
        </a>
      `;
    }

    // ==========================================================
    // PROJECT MODAL
    // ==========================================================

    renderProjectModal() {
      if (document.getElementById('projectModal')) return;
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="projectModalLabel">Project Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" id="projectModalBody"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <a href="#" class="btn btn-primary d-none" id="projectModalGithub" target="_blank" rel="noopener noreferrer">
                  <i class="bi bi-github me-2"></i>View Code
                </a>
                <a href="#" class="btn btn-success d-none" id="projectModalDemo" target="_blank" rel="noopener noreferrer">
                  <i class="bi bi-box-arrow-up-right me-2"></i>Live Demo
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
      return [
        this.modalImages(d.images, project),
        this.modalGallery(d.gallery),
        this.modalText('Problem',         'bi-question-circle', d.problem),
        this.modalText('Solution',        'bi-lightbulb',       d.solution),
        this.modalList('Key Features',    'bi-list-check',      d.features),
        this.modalList('Architecture',    'bi-diagram-3',       d.architecture),
        this.modalList('Responsibilities','bi-person-check',    d.responsibilities),
        this.modalText('Challenges',      'bi-shield-check',    d.challenges),
        this.modalCaseStudy(d.case_study),
        this.modalImage('Architecture Diagram', d.diagram),
        this.modalTech(project.technologies),
        this.modalLead(project.description || project.short_description)
      ].filter(Boolean).join('');
    }

    modalImages(images, project) {
      if (!images?.length) return null;
      return `<div class="project-modal-images mb-4">${images.map((src) =>
        `<img src="${this.escape(src)}" alt="${this.escape(this.safe(project.title))}"
              class="img-fluid rounded mb-2" loading="lazy" />`).join('')}</div>`;
    }

    modalGallery(gallery) {
      if (!gallery?.length) return null;
      return `
        <div class="mb-4">
          <h6><i class="bi bi-images me-2"></i>Gallery</h6>
          <div class="project-modal-gallery row g-2">${gallery.map((src) =>
            `<img src="${this.escape(src)}" alt="" class="img-fluid rounded" loading="lazy" />`).join('')}</div>
        </div>`;
    }

    modalText(title, icon, text) {
      if (!text) return null;
      return `
        <div class="mb-4">
          <h6><i class="bi ${icon} me-2"></i>${title}</h6>
          <p>${this.escape(text)}</p>
        </div>`;
    }

    modalList(title, icon, items) {
      if (!items?.length) return null;
      return `
        <div class="mb-4">
          <h6><i class="bi ${icon} me-2"></i>${title}</h6>
          <ul>${items.map((item) => `<li>${this.escape(item)}</li>`).join('')}</ul>
        </div>`;
    }

    modalImage(title, src) {
      if (!src) return null;
      return `
        <div class="mb-4">
          <h6><i class="bi bi-diagram-3 me-2"></i>${title}</h6>
          <img src="${this.escape(src)}" alt="${title}" class="img-fluid rounded" loading="lazy" />
        </div>`;
    }

    modalCaseStudy(text) {
      if (!text) return null;
      return `
        <div class="mb-4">
          <h6><i class="bi bi-journal-text me-2"></i>Case Study</h6>
          <p>${this.escape(text)}</p>
        </div>`;
    }

    modalTech(techs) {
      if (!techs?.length) return null;
      return `
        <div class="project-modal-tech mb-3">
          <h6><i class="bi bi-tools me-2"></i>Technologies Used</h6>
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
      const timeline = document.querySelector('.experience-section .timeline');
      if (!jobs.length) { this.hideSection('#experience'); return; }
      if (!timeline) return;
      const sorted = [...jobs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      timeline.innerHTML = sorted.map((job) => this.renderExperienceItem(job)).join('');
    }

    renderExperienceItem(job) {
      const isCurrent = Boolean(job.current);
      const icon = this.experienceIcon(job);
      const dateLabel = isCurrent
        ? `${this.safe(job.start_date)} – Present`
        : `${this.safe(job.start_date)} – ${this.safe(job.end_date)}`;
      const badgeClass = isCurrent ? 'bg-primary' : 'bg-secondary';
      const badgeText = isCurrent ? 'Current' : this.safe(job.type, 'Past');
      const locationMarkup = job.location ? `<span class="timeline-divider">•</span><span>${this.escape(job.location)}</span>` : '';
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
      const grid = document.querySelector('.certificates-section .row.g-4');
      if (!certs.length) { this.hideSection('#certificates'); return; }
      if (!grid) return;
      grid.innerHTML = certs.map((cert) => this.renderCertificateCard(cert)).join('');
    }

    renderCertificateCard(cert) {
      const verifyLink = cert.credential_url ? `
        <a href="${this.escape(cert.credential_url)}" class="certificate-link" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-box-arrow-up-right"></i><span>Verify</span>
        </a>` : '';
      const issuerLink = cert.issuer_url ? `
        <a href="${this.escape(cert.issuer_url)}" class="certificate-link" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-globe"></i><span>Issuer</span>
        </a>` : '';
      const preview = cert.image
        ? `<img src="${this.escape(cert.image)}" alt="${this.escape(this.safe(cert.name, 'Certificate'))}"
              class="img-fluid" width="400" height="280" loading="lazy" />`
        : `<i class="bi bi-patch-check-fill"></i>`;
      const issuerBadge = cert.issuer ? `<span class="badge bg-primary mb-2">${this.escape(cert.issuer)}</span>` : '';
      const issueDate = cert.issue_date ? `<p class="certificate-card-issuer">Issued: ${this.escape(cert.issue_date)}</p>` : '';
      const credId = cert.credential_id ? `<p class="certificate-card-id">ID: ${this.escape(cert.credential_id)}</p>` : '';

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
      this.renderContactInfo(contact.contact_info);
      this.renderContactSocials(contact.socials);
      this.renderContactForm(contact.form);
    }

    renderContactInfo(info) {
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
      formConfig.fields.forEach((field) => {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (!input) return;
        if (field.placeholder) input.placeholder = field.placeholder;
        input.required = Boolean(field.required);
        if (field.min_length) input.minLength = field.min_length;
        if (field.max_length) input.maxLength = field.max_length;
      });
    }

    // ==========================================================
    // FOOTER
    // ==========================================================

    renderFooter() {
      const profile = this.data.profile;
      if (!profile) return;

      const author = profile.meta?.author ?? profile.name;

      const nameEl = document.querySelector('.footer-logo .brand-name');
      if (nameEl) nameEl.textContent = this.safe(author);

      const logoLink = document.querySelector('.footer-logo');
      if (logoLink) logoLink.setAttribute('aria-label', `${this.safe(author)} — Back to top`);

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
      const label = this.safe(item.label, 'social link');
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

    resolvePath(path) {
      return path?.split('.').reduce((acc, key) => acc?.[key], this.data);
    }

    safe(value, defaultValue = '') {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'string' && value.trim() === '') return defaultValue;
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