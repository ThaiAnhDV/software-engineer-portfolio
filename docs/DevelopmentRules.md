# Development Rules

## Overview

These rules define development standards and practices for maintaining this portfolio project.

---

## General Principles

1. **No content invention** - Do not add fake projects, skills, or experience
2. **Accessibility first** - All features must be accessible
3. **Mobile responsive** - All layouts must work on mobile
4. **Performance conscious** - Keep asset sizes small
5. **Consistent style** - Follow the established patterns

---

## File Organization

### Directory Structure

```
portfolio/
├── index.html                    # Main entry point
├── pages/                        # Project detail pages
├── assets/
│   ├── css/                      # Stylesheets
│   ├── js/                       # JavaScript files
│   └── images/                   # All images
├── components/                   # HTML templates
├── data/                         # JSON data
├── docs/                         # Documentation
└── .cursor/rules/                # IDE rules
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| HTML files | kebab-case | `project-detail.html` |
| CSS files | kebab-case | `project-detail.css` |
| JS files | kebab-case | `project-detail.js` |
| Images | kebab-case | `hero-image.webp` |
| Folders | kebab-case | `project-images/` |
| Classes | BEM or kebab | `.project-card` |
| IDs | kebab-case | `#project-overview` |
| Variables | camelCase | `currentTheme` |

---

## HTML Standards

### DOCTYPE and Structure

```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
  <!-- Meta tags first -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="...">

  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">

  <!-- Stylesheets -->
  <link href="..." rel="stylesheet">

  <title>Page Title</title>
</head>
<body>
  <!-- Skip link -->
  <a href="#main-content" class="skip-link">Skip to content</a>

  <!-- Content -->
  <header>...</header>
  <main id="main-content">...</main>
  <footer>...</footer>

  <!-- Scripts -->
  <script src="..."></script>
</body>
</html>
```

### Semantic HTML

| Element | Usage |
|---------|-------|
| `<header>` | Site header, page headers |
| `<nav>` | Navigation menus |
| `<main>` | Primary content (once per page) |
| `<section>` | Thematic content groups |
| `<article>` | Self-contained content |
| `<aside>` | Sidebar content |
| `<footer>` | Site footer, section footers |
| `<figure>` | Images with captions |
| `<time>` | Date/time content |

### Accessibility Requirements

```html
<!-- Images must have alt -->
<img src="..." alt="Descriptive alt text">

<!-- Links must be descriptive -->
<a href="...">View project on GitHub</a>
<!-- Not: <a href="...">here</a> -->

<!-- Buttons vs links -->
<button type="button">Action</button>  <!-- For actions -->
<a href="...">Navigate</a>           <!-- For navigation -->

<!-- Form labels -->
<label for="email">Email</label>
<input type="email" id="email">

<!-- Required fields -->
<input aria-required="true">

<!-- Error messages -->
<div id="error" role="alert" aria-live="polite"></div>
```

### ARIA Guidelines

| Rule | Example |
|------|---------|
| Use native HTML when possible | `<nav>` over `<div role="navigation">` |
| Labels for icon-only buttons | `<button aria-label="Close modal">X</button>` |
| Live regions for dynamic content | `<div aria-live="polite">Updated</div>` |
| Modal accessibility | `aria-labelledby`, `aria-modal="true"` |

---

## CSS Standards

### Organization

```css
/* 1. CSS Custom Properties (variables) */
/* 2. Base/Reset styles */
/* 3. Typography */
/* 4. Layout */
/* 5. Components */
/* 6. Utilities */
/* 7. Responsive */
/* 8. Print */
```

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary: #0d6efd;
  --color-text: #212529;

  /* Spacing */
  --space-4: 1rem;

  /* Typography */
  --font-size-base: 1rem;
}

/* Dark mode */
[data-bs-theme="dark"] {
  --color-primary: #0d6efd;
  --color-text: #c9d1d9;
}
```

### Class Naming

```css
/* BEM-ish naming */
.component { }
.component__element { }
.component--modifier { }

/* Utility naming */
.text-center { }
.d-flex { }
.mt-4 { }

/* State classes */
.is-active { }
.has-error { }
```

### Responsive CSS

```css
/* Mobile first */
.element { }

/* Tablet and up */
@media (min-width: 768px) {
  .element { }
}

/* Desktop and up */
@media (min-width: 992px) {
  .element { }
}
```

### Performance

```css
/* Prefer this */
.class { }

/* Avoid */
div.class { }
.parent > .child { }
```

---

## JavaScript Standards

### Structure

```javascript
/**
 * Module Name
 * Brief description
 *
 * @description Detailed description if needed
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    option: 'value'
  };

  // Private functions
  function privateFunction() {
    // ...
  }

  // Public API
  const PublicModule = {
    init: function () {
      // Initialize
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PublicModule.init());
  } else {
    PublicModule.init();
  }

  // Export for debugging
  window.PublicModule = PublicModule;

})();
```

### Variables

```javascript
// Constants
const MAX_ITEMS = 10;
const API_URL = 'https://api.example.com';

// Let for mutable
let currentIndex = 0;

// Prefer const
const element = document.querySelector('.selector');
```

### DOM Manipulation

```javascript
// Cache DOM queries
const container = document.querySelector('.container');

// Use for/forEach/for-of
for (const item of items) {
  // ...
}

// Event delegation
parent.addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    // Handle
  }
});
```

### Event Handling

```javascript
// Remove event listeners properly
function handleClick() { }
element.addEventListener('click', handleClick);
element.removeEventListener('click', handleClick);

// Cleanup on remove
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// Later: controller.abort();
```

### Error Handling

```javascript
// Try/catch for async
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP error');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    // Handle gracefully
  }
}

// Fallbacks
const value = potentiallyUndefined ?? defaultValue;
```

---

## Git Workflow

### Branch Naming

| Type | Example |
|------|---------|
| Feature | `feature/project-detail-page` |
| Bugfix | `bugfix/contact-form-validation` |
| Hotfix | `hotfix/favicon-broken` |
| Refactor | `refactor/css-organization` |

### Commit Messages

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, missing semicolons
refactor: Code refactoring
perf:     Performance improvements
test:     Adding tests
chore:    Maintenance

# Examples
feat(projects): add project detail page template
fix(contact): fix email validation regex
docs(readme): update deployment instructions
refactor(css): consolidate color variables
```

### Commit Checklist

- [ ] Code follows style guide
- [ ] No console.log statements (except dev)
- [ ] No TODO comments left
- [ ] All assets referenced exist
- [ ] Tested in browser
- [ ] No console errors

---

## Performance Rules

### Images

```html
<!-- Use WebP format -->
<img src="image.webp" alt="Description">

<!-- Lazy load below-fold images -->
<img src="thumb.webp" loading="lazy" alt="...">

<!-- Specify dimensions -->
<img src="image.webp" width="400" height="300" alt="...">

<!-- Responsive images -->
<img srcset="image-400.webp 400w,
             image-800.webp 800w"
     sizes="(max-width: 576px) 400px,
            800px"
     src="image-800.webp"
     alt="...">
```

### Fonts

```html
<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Swap display -->
<link href="...Inter..." rel="stylesheet">
<style>
  body { font-family: 'Inter', sans-serif; }
</style>
```

### Scripts

```html
<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>

<!-- Async for independent scripts -->
<script src="chat.js" async></script>
```

### CSS

```css
/* Critical CSS inline */
<style>/* Above-fold styles */</style>

/* Non-critical async load */
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
```

---

## Accessibility Checklist

### Before Commit

- [ ] All images have alt text
- [ ] Color contrast meets 4.5:1
- [ ] Keyboard navigation works
- [ ] Focus visible on interactive elements
- [ ] Screen reader tested
- [ ] No auto-playing media
- [ ] Reduced motion respected

### Testing Tools

| Tool | Purpose |
|------|---------|
| WAVE | Accessibility audit |
| axe DevTools | Automated testing |
| Lighthouse | Performance + a11y |
| VoiceOver (Mac) | Screen reader |
| NVDA (Windows) | Screen reader |

---

## Browser Testing

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | 90+ | Primary |
| Firefox | 88+ | Primary |
| Safari | 14+ | Primary |
| Edge | 90+ | Secondary |

### Test Checklist

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
- [ ] Keyboard only navigation
- [ ] Zoom 200%

---

## Deployment

### Pre-Deployment Checklist

- [ ] All TODO placeholders filled
- [ ] No placeholder images
- [ ] All links verified
- [ ] SEO meta tags complete
- [ ] Favicon displays
- [ ] OG image working
- [ ] Contact form functional
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark mode works

### Deployment Steps

```bash
# 1. Create production branch
git checkout -b production

# 2. Run final checks
npm test                    # If configured
lighthouse http://localhost:3000  # Audit

# 3. Commit and push
git add .
git commit -m "chore: prepare for production"
git push origin production

# 4. Merge to main
git checkout main
git merge production
git push origin main
```

---

## Code Review Guidelines

### Review Checklist

- [ ] Follows style guide
- [ ] No duplicate code
- [ ] No commented-out code
- [ ] Proper error handling
- [ ] Performance optimized
- [ ] Accessible
- [ ] Responsive
- [ ] Tests pass
- [ ] Documentation updated

### Review Comments

| Prefix | Meaning |
|--------|---------|
| `nit:` | Minor suggestion |
| `suggestion:` | Consider this approach |
| `required:` | Must fix before merge |
| `question:` | Needs clarification |

---

## Maintenance

### Regular Tasks

| Task | Frequency |
|------|-----------|
| Update dependencies | Monthly |
| Check for broken links | Monthly |
| Review analytics | Weekly |
| Update projects | As completed |
| Update skills | Quarterly |
| Review performance | Monthly |

### Monitoring

- [ ] Set up uptime monitoring
- [ ] Monitor JavaScript errors
- [ ] Track page performance
- [ ] Review accessibility reports

---

*Last updated: TODO: Date*
