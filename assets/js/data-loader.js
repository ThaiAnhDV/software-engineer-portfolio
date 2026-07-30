/**
 * Portfolio Data Loader
 * Loads and manages all JSON data for the portfolio
 */
(function() {
  'use strict';

  const DataLoader = {
    cache: {},
    basePath: 'data/',

    /**
     * Load a JSON file and cache it
     * @param {string} filename - Name of the JSON file (without path)
     * @returns {Promise<Object>} Parsed JSON data
     */
    async load(filename) {
      if (this.cache[filename]) {
        return this.cache[filename];
      }

      try {
        const response = await fetch(this.basePath + filename);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        this.cache[filename] = data;
        return data;
      } catch (error) {
        console.error(`DataLoader: Failed to load ${filename}`, error);
        return null;
      }
    },

    /**
     * Get portfolio configuration
     */
    async getPortfolio() {
      return this.load('portfolio.json');
    },

    /**
     * Get all projects
     */
    async getProjects() {
      const data = await this.load('projects.json');
      return data?.projects || [];
    },

    /**
     * Get a single project by ID
     */
    async getProject(id) {
      const projects = await this.getProjects();
      return projects.find(p => p.id === id) || null;
    },

    /**
     * Get skills data
     */
    async getSkills() {
      return this.load('skills.json');
    },

    /**
     * Get experience data
     */
    async getExperience() {
      return this.load('experience.json');
    },

    /**
     * Get certificates
     */
    async getCertificates() {
      const data = await this.load('certificates.json');
      return data?.certificates || [];
    },

    /**
     * Get contact data
     */
    async getContact() {
      return this.load('contact.json');
    },

    /**
     * Get socials data (from contact.json)
     */
    async getSocials() {
      const contact = await this.getContact();
      return contact?.socials || [];
    },

    /**
     * Get navigation data
     */
    async getNavigation() {
      const portfolio = await this.getPortfolio();
      return portfolio?.navigation || { primary: [], footer: {} };
    },

    /**
     * Load all data at once
     */
    async loadAll() {
      const [portfolio, projects, skills, experience, certificates, contact] = await Promise.all([
        this.getPortfolio(),
        this.getProjects(),
        this.getSkills(),
        this.getExperience(),
        this.getCertificates(),
        this.getContact()
      ]);

      return {
        portfolio,
        projects,
        skills,
        experience,
        certificates,
        contact
      };
    },

    /**
     * Clear cache (useful for development)
     */
    clearCache() {
      this.cache = {};
    }
  };

  // Export to global scope
  window.DataLoader = DataLoader;

})();
