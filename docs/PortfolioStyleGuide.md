# Portfolio Style Guide

## Design System Overview

### Brand Identity

| Property | Value |
|----------|-------|
| **Brand Name** | `TODO: Your name or brand` |
| **Tagline** | `TODO: One-line brand statement` |
| **Primary Color** | `#0d6efd` (Bootstrap Primary) |
| **Secondary Color** | `#6c757d` (Bootstrap Secondary) |
| **Accent Color** | `TODO: Accent color` |
| **Font Family** | Inter (primary), JetBrains Mono (code) |

---

## Color System

### Primary Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #0d6efd;           /* Main brand color */
  --color-primary-hover: #0b5ed7;      /* Hover state */
  --color-primary-light: #3d8bfd;     /* Light variant */
  --color-primary-dark: #0a58ca;       /* Dark variant */

  /* Secondary Colors */
  --color-secondary: #6c757d;
  --color-secondary-hover: #5c636a;

  /* Semantic Colors */
  --color-success: #198754;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #0dcaf0;

  /* Light Mode (Default) */
  --color-bg: #ffffff;
  --color-bg-alt: #f8f9fa;
  --color-bg-soft: #f1f3f5;
  --color-surface: #ffffff;

  /* Text Colors */
  --color-text: #212529;
  --color-text-secondary: #6c757d;
  --color-text-muted: #adb5bd;
  --color-heading: #1a1a2e;

  /* Border Colors */
  --color-border: #dee2e6;
  --color-border-light: #e9ecef;
  --color-border-dark: #ced4da;
}
```

### Dark Mode Palette

```css
[data-bs-theme="dark"] {
  --color-bg: #0d1117;
  --color-bg-alt: #161b22;
  --color-bg-soft: #21262d;
  --color-surface: #161b22;

  --color-text: #c9d1d9;
  --color-text-secondary: #8b949e;
  --color-text-muted: #6e7681;
  --color-heading: #f0f6fc;

  --color-border: #30363d;
  --color-border-light: #21262d;
  --color-border-dark: #484f58;
}
```

### Color Usage

| Color | Usage |
|-------|-------|
| Primary | Buttons, links, active states, brand elements |
| Secondary | Less prominent actions, secondary buttons |
| Success | Positive feedback, success messages |
| Danger | Errors, destructive actions, warnings |
| Warning | Caution states, alerts |
| Info | Informational messages, tips |
| Background | Page backgrounds |
| Surface | Cards, modals, elevated elements |
| Text | Body copy |
| Heading | Headings, titles |
| Muted | Captions, helper text |

### Color Contrast

| Combination | Contrast Ratio | WCAG Level |
|-------------|----------------|------------|
| Text on Background | 13.5:1 | AAA |
| Heading on Background | 15.5:1 | AAA |
| Primary on Background | 4.8:1 | AA |
| Muted on Background | 4.2:1 | AA |

---

## Typography

### Font Stack

```css
/* Primary Font */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;

/* Monospace Font */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
```

### Type Scale

| Token | Size | Rem | Pixels | Usage |
|-------|------|-----|--------|-------|
| `--font-size-xs` | 0.75rem | 12px | Caption, badges |
| `--font-size-sm` | 0.875rem | 14px | Small text, helper |
| `--font-size-base` | 1rem | 16px | Body text |
| `--font-size-md` | 1.125rem | 18px | Lead paragraphs |
| `--font-size-lg` | 1.25rem | 20px | Subheadings |
| `--font-size-xl` | 1.5rem | 24px | Section titles |
| `--font-size-2xl` | 2rem | 32px | Page headings |
| `--font-size-3xl` | 2.5rem | 40px | Hero subtitles |
| `--font-size-4xl` | 3rem | 48px | Hero headings |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-weight-light` | 300 | Decorative, large headings |
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Subheadings, labels |
| `--font-weight-bold` | 700 | Headings, strong emphasis |
| `--font-weight-extrabold` | 800 | Hero, display text |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | 1.25 | Headings |
| `--line-height-snug` | 1.375 | Subheadings |
| `--line-height-normal` | 1.5 | Body text |
| `--line-height-relaxed` | 1.625 | Long-form content |
| `--line-height-loose` | 2 | Accessibility, dyslexia |

---

## Spacing System

### Base Unit: 4px

```css
--space-1: 0.25rem;   /* 4px  */
--space-2: 0.5rem;    /* 8px  */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 8rem;     /* 128px */
```

### Spacing Usage

| Token | Usage |
|-------|-------|
| `--space-1` | Tight gaps, inline elements |
| `--space-2` | Icon-text gaps, small padding |
| `--space-3` | List items, form fields |
| `--space-4` | Card padding, section gaps |
| `--space-5` | Card margins, large gaps |
| `--space-6` | Section padding, major gaps |
| `--space-8` | Large section margins |
| `--space-10` | Hero padding |
| `--space-12` | Major section breaks |

---

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px  - Small elements */
--radius-md: 0.5rem;    /* 8px  - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Modals */
--radius-full: 9999px;  /* Pills, avatars */
```

### Usage

| Token | Elements |
|-------|----------|
| `--radius-sm` | Badges, small tags |
| `--radius-md` | Buttons, form controls, chips |
| `--radius-lg` | Cards, images, containers |
| `--radius-xl` | Modals, large panels |
| `--radius-full` | Avatars, pills, toggles |

---

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
--shadow-none: none;
```

### Dark Mode Shadows

```css
[data-bs-theme="dark"] {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
}
```

### Usage

| Token | Elements |
|-------|----------|
| `--shadow-sm` | Subtle elevation, hover states |
| `--shadow-md` | Cards, dropdowns |
| `--shadow-lg` | Modals, popovers, sticky elements |
| `--shadow-xl` | Hero images, featured cards |

---

## Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

### Usage

| Token | Animations |
|-------|------------|
| `--transition-fast` | Hover states, toggles, micro-interactions |
| `--transition-base` | Page transitions, modal open/close |
| `--transition-slow` | Large layout changes, page scrolls |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Breakpoints

```css
/* Bootstrap breakpoints */
--breakpoint-xs: 0;
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 992px;
--breakpoint-xl: 1200px;
--breakpoint-xxl: 1400px;
```

### Responsive Targets

| Breakpoint | Device | Typical Usage |
|-------------|--------|---------------|
| Mobile | < 576px | Single column, full-width elements |
| Tablet | 576px - 767px | 2-column grids |
| Desktop | 768px - 991px | 3-column grids |
| Large Desktop | 992px - 1199px | Full layouts |
| XL | 1200px+ | Expanded layouts |

---

## Components

### Buttons

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-5);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* Outline Button */
.btn-outline-primary {
  background-color: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline-primary:hover {
  background-color: var(--color-primary);
  color: #fff;
}
```

### Cards

```css
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Tech Tags

```css
.tech-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  background-color: var(--color-bg-soft);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.tech-tag:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

### Timeline

```css
.timeline {
  position: relative;
  padding-left: var(--space-6);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background-color: var(--color-border-light);
}

.timeline-item {
  position: relative;
  padding-bottom: var(--space-5);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--space-6) - 5px);
  top: 8px;
  width: 12px;
  height: 12px;
  background-color: var(--color-primary);
  border-radius: 50%;
  border: 2px solid var(--color-surface);
}
```

---

## Layout Patterns

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}
```

### Section Spacing

```css
section {
  padding: var(--space-10) 0;
}

@media (min-width: 768px) {
  section {
    padding: var(--space-12) 0;
  }
}
```

### Grid System

```css
/* Bootstrap grid - no custom overrides needed */
/* Use .row, .col-*, .g-* classes */
```

---

## Icon Usage

### Bootstrap Icons

- Use class `bi bi-{icon-name}` from Bootstrap Icons
- Size controlled via CSS `font-size`
- Color inherits from parent `color`

### Custom SVG Icons

```css
.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
```

---

## Animation Guidelines

### Entrance Animations

```css
/* Fade up on scroll (AOS) */
[data-aos="fade-up"] {
  opacity: 0;
  transform: translateY(20px);
}

[data-aos="fade-up"].aos-animate {
  opacity: 1;
  transform: translateY(0);
}
```

### Hover Animations

```css
.hover-lift {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

---

## Responsive Typography

```css
/* Mobile First */
h1, .h1 { font-size: 2rem; }
h2, .h2 { font-size: 1.75rem; }
h3, .h3 { font-size: 1.5rem; }

@media (min-width: 768px) {
  h1, .h1 { font-size: 2.5rem; }
  h2, .h2 { font-size: 2rem; }
  h3, .h3 { font-size: 1.75rem; }
}

@media (min-width: 992px) {
  h1, .h1 { font-size: 3rem; }
  h2, .h2 { font-size: 2.5rem; }
  h3, .h3 { font-size: 2rem; }
}
```

---

## Accessibility

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove default outline */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Skip Link

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-5);
  background-color: var(--color-primary);
  color: #fff;
  z-index: 9999;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: var(--space-4);
}
```

---

## Print Styles

```css
@media print {
  .no-print {
    display: none !important;
  }

  .site-header,
  .site-footer {
    display: none;
  }

  a[href]::after {
    content: " (" attr(href) ")";
  }
}
```

---

## Checklist

- [ ] Primary color defined
- [ ] Dark mode colors defined
- [ ] Typography scale set
- [ ] Spacing system consistent
- [ ] Border radius defined
- [ ] Shadows defined
- [ ] Transitions defined
- [ ] Breakpoints set
- [ ] Focus states visible
- [ ] Reduced motion supported

---

*Last updated: TODO: Date*
