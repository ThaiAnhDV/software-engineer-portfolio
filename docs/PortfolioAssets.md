# Portfolio Assets Guide

## Asset Overview

This document defines all assets used in the portfolio, their locations, specifications, and management guidelines.

---

## Directory Structure

```
assets/
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── images/                 # All visual assets
│   ├── avatar/             # Profile images
│   ├── background/          # Background images
│   ├── certificates/        # Certification images
│   ├── diagrams/            # Architecture diagrams
│   ├── logos/               # Technology logos
│   ├── mockups/             # Device mockups
│   ├── og-image.svg         # Social sharing image
│   ├── favicon.svg          # Site favicon
│   └── projects/            # Project assets
│       ├── ai-interview-platform/
│       ├── hotel-management-system/
│       └── salesphere-management/
├── icons/                  # UI icon SVGs
└── pdf/                    # Document files
    └── cv/                 # Resume/CV
        └── resume.pdf       # Main resume file
```

---

## Image Assets

### Profile Images (`images/avatar/`)

| File | Dimensions | Format | Purpose |
|------|------------|--------|---------|
| `avatar.webp` | 400x400px | WebP | Default display |
| `avatar-large.webp` | 800x800px | WebP | Hero section |
| `avatar-thumbnail.webp` | 150x150px | WebP | Cards, lists |

**Specifications:**
- Aspect ratio: 1:1
- Background: Transparent or neutral
- File size: < 100KB each
- Color mode: sRGB

### Background Images (`images/background/`)

| File | Dimensions | Format | Purpose |
|------|------------|--------|---------|
| `gradient.svg` | Vector | SVG | Gradient backgrounds |
| `hero-bg.webp` | 1920x1080px | WebP | Hero section background |
| `noise.webp` | 100x100px tileable | WebP | Texture overlay |
| `pattern.svg` | Vector | SVG | Pattern backgrounds |

**Specifications:**
- File size: < 500KB each
- Resolution: 72dpi for web
- Optimized for performance

### Technology Logos (`images/logos/`)

| File | Format | Notes |
|------|--------|-------|
| `bootstrap.svg` | SVG | Bootstrap framework |
| `docker.svg` | SVG | Docker containerization |
| `firebase.svg` | SVG | Firebase platform |
| `github.svg` | SVG | GitHub |
| `javascript-16.svg` | SVG | JavaScript |
| `tailwind.svg` | SVG | Tailwind CSS |
| `sql.svg` | SVG | SQL databases |
| `dart-16.svg` | SVG | Dart language |
| `flutter-svgrepo-com.svg` | SVG | Flutter framework |
| `dotnet-svgrepo-com.svg` | SVG | .NET framework |
| `dbs-sqlserver.svg` | SVG | SQL Server |
| `linkedin.svg` | SVG | LinkedIn |
| `gmail.svg` | SVG | Email |

**Specifications:**
- Format: SVG (preferred) or WebP
- Consistent viewBox: 64x64 or 128x128
- Single color (theme-aware via CSS)
- File size: < 10KB each

### Certificate Images (`images/certificates/`)

| File | Dimensions | Format | Certificate |
|------|------------|--------|-------------|
| `aws-saa.webp` | 800x600px | WebP | AWS Solutions Architect |
| `google-data.webp` | 800x600px | WebP | Google Data Analytics |
| `meta-frontend.webp` | 800x600px | WebP | Meta Frontend Developer |
| `azure-fundamentals.webp` | 800x600px | WebP | Azure Fundamentals |
| `pmi-pmp.webp` | 800x600px | WebP | PMI PMP |
| `docker-kuber.webp` | 800x600px | WebP | Docker/Kubernetes |

**Specifications:**
- Aspect ratio: 4:3
- File size: < 200KB each
- Minimum width: 600px
- Full certificate text readable

### Project Images (`images/projects/`)

#### Structure Per Project

```
images/projects/
└── [project-slug]/
    ├── hero.webp              # Main project image (1200x800)
    ├── og-image.jpg           # Social sharing (1200x630)
    ├── architecture.webp      # Architecture diagram
    ├── gallery/
    │   ├── dashboard.webp     # Screenshot 1
    │   ├── feature-1.webp     # Screenshot 2
    │   ├── feature-2.webp     # Screenshot 3
    │   └── feature-3.webp     # Screenshot 4
    └── thumbnails/            # Lazy-loaded versions
        ├── dashboard-thumb.webp
        └── feature-1-thumb.webp
```

#### Project-Specific Images

**AI Interview Platform (`images/projects/ai-interview-platform/`):**

| File | Dimensions | Purpose |
|------|------------|---------|
| `hero.webp` | 1200x800px | Main hero image |
| `dashboard.webp` | 1200x800px | Dashboard screenshot |
| `interview-session.webp` | 1200x800px | Live interview |
| `feedback-report.webp` | 1200x800px | Feedback UI |
| `question-bank.webp` | 1200x800px | Question bank |
| `skill-analysis.webp` | 1200x800px | Analytics |
| `scheduling.webp` | 1200x800px | Calendar UI |

**Hotel Management System (`images/projects/hotel-management-system/`):**

| File | Dimensions | Purpose |
|------|------------|---------|
| `hero.webp` | 1200x800px | Main hero image |
| `dashboard.webp` | 1200x800px | Admin dashboard |
| `reservation.webp` | 1200x800px | Booking system |
| `room-status.webp` | 1200x800px | Room management |
| `guest-portal.webp` | 1200x800px | Guest booking |
| `billing.webp` | 1200x800px | Billing interface |
| `reports.webp` | 1200x800px | Reports dashboard |

**SaleSphere Management (`images/projects/salesphere-management/`):**

| File | Dimensions | Purpose |
|------|------------|---------|
| `hero.webp` | 1200x800px | Main hero image |
| `dashboard.webp` | 1200x800px | Sales dashboard |
| `pipeline.webp` | 1200x800px | Sales pipeline |
| `inventory.webp` | 1200x800px | Inventory UI |
| `orders.webp` | 1200x800px | Order management |
| `customers.webp` | 1200x800px | CRM view |
| `reports.webp` | 1200x800px | Analytics |

**Specifications:**
- Format: WebP (primary), PNG (fallback)
- Aspect ratio: 3:2 (landscape preferred)
- File size: < 300KB each
- Minimum width: 800px
- Retina-ready: 2x for high-DPI displays

---

## Favicon & Branding

### Favicon (`images/favicon.svg`)

| Property | Specification |
|----------|---------------|
| **Format** | SVG (scalable) |
| **Size** | 32x32px viewBox |
| **Background** | Transparent |
| **Color** | Single color (use CSS for theme) |
| **File** | `assets/images/favicon.svg` |

### Apple Touch Icon

| Property | Specification |
|----------|---------------|
| **Format** | PNG |
| **Size** | 180x180px |
| **File** | `assets/images/apple-touch-icon.png` |

### Social Sharing Image (`images/og-image.svg`)

| Property | Specification |
|----------|---------------|
| **Format** | SVG or PNG |
| **Dimensions** | 1200x630px (2:1 ratio) |
| **File** | `assets/images/og-image.svg` |

**Content:**
- Portfolio title/name
- Professional tagline
- Visual identity/branding
- Consistent with site design

---

## UI Icons (`icons/`)

| File | Size | Purpose |
|------|------|---------|
| `arrow-right.svg` | 24x24 | Navigation arrows |
| `award.svg` | 24x24 | Certificates |
| `briefcase.svg` | 24x24 | Experience/work |
| `download.svg` | 24x24 | Downloads |
| `envelope.svg` | 24x24 | Email |
| `github.svg` | 24x24 | GitHub link |
| `linkedin.svg` | 24x24 | LinkedIn link |
| `phone.svg` | 24x24 | Phone/contact |
| `terminal.svg` | 24x24 | Code/technical |

**Specifications:**
- Format: SVG
- ViewBox: 24x24 (standard)
- Stroke width: 2px
- Color: CurrentColor (theme-aware)
- File size: < 5KB each

---

## Document Files (`pdf/`)

### Resume/CV (`pdf/cv/resume.pdf`)

| Property | Specification |
|----------|---------------|
| **Format** | PDF |
| **File** | `assets/pdf/cv/resume.pdf` |
| **File Size** | < 2MB |
| **Pages** | 1-2 pages |
| **Color** | Black & white (print-friendly) |

**Content:**
- Contact information
- Summary/objective
- Work experience
- Education
- Skills
- Certifications

---

## Asset Naming Conventions

### Rules

1. **Lowercase**: All file names lowercase
2. **Kebab-case**: Words separated by hyphens
3. **Descriptive**: Clear, meaningful names
4. **Consistent**: Same pattern across categories

### Examples

```
# Good
hero-background.webp
github-icon.svg
project-dashboard.png

# Bad
Hero WebP 2.webp
GitHub.svg
IMG_1234.png
```

### Naming Templates

| Asset Type | Template | Example |
|------------|----------|---------|
| Profile | `avatar.webp` | `avatar.webp` |
| Project hero | `hero.webp` | `ai-interview-hero.webp` |
| Screenshot | `{feature}.webp` | `dashboard.webp` |
| Logo | `{tech-name}.svg` | `react.svg` |
| Certificate | `{issuer}-{cert}.webp` | `aws-saa.webp` |
| Icon | `{name}.svg` | `arrow-right.svg` |

---

## Image Optimization

### WebP Conversion

| Source Format | Target | Quality |
|---------------|--------|---------|
| PNG | WebP | 80% |
| JPEG | WebP | 80% |
| SVG | SVG (keep) | - |

### Compression Targets

| Type | Target Size |
|------|-------------|
| Hero images | < 300KB |
| Screenshots | < 200KB |
| Thumbnails | < 50KB |
| Logos | < 10KB |
| Icons | < 5KB |
| Backgrounds | < 500KB |

### Responsive Images

```html
<!-- Hero images -->
<img src="hero.webp"
     srcset="hero-400.webp 400w,
             hero-800.webp 800w,
             hero-1200.webp 1200w"
     sizes="(max-width: 576px) 400px,
            (max-width: 992px) 800px,
            1200px"
     alt="Description">

<!-- Lazy loading for below fold -->
<img src="thumbnail.webp"
     loading="lazy"
     alt="Description">
```

---

## Asset Checklist

### Required Assets (Missing)

- [ ] `assets/images/favicon.svg` - Create from logo
- [ ] `assets/images/og-image.svg` - Design social sharing image
- [ ] `assets/images/apple-touch-icon.png` - 180x180px PNG
- [ ] `assets/pdf/cv/resume.pdf` - Upload resume file

### Project Images (Missing)

- [ ] `images/projects/ai-interview-platform/*` - Create folder and add images
- [ ] `images/projects/hotel-management-system/*` - Create folder and add images
- [ ] `images/projects/salesphere-management/*` - Create folder and add images

### Certificate Images (Missing)

- [ ] `images/certificates/aws-saa.webp` - Upload AWS certificate
- [ ] `images/certificates/google-data.webp` - Upload Google certificate
- [ ] `images/certificates/meta-frontend.webp` - Upload Meta certificate
- [ ] `images/certificates/azure-fundamentals.webp` - Upload Azure certificate
- [ ] `images/certificates/pmi-pmp.webp` - Upload PMP certificate
- [ ] `images/certificates/docker-kuber.webp` - Upload Docker/K8s certificate

---

## Asset Update Process

1. **Add new asset** to appropriate folder
2. **Optimize** (compress, resize if needed)
3. **Name correctly** following conventions
4. **Update HTML** to reference new asset
5. **Test** in browser
6. **Commit** with descriptive message

---

## Third-Party Assets

| Asset | Source | License | Notes |
|-------|--------|---------|-------|
| Bootstrap | jsDelivr CDN | MIT | Included via CDN |
| Bootstrap Icons | jsDelivr CDN | MIT | Included via CDN |
| AOS | jsDelivr CDN | MIT | Included via CDN |
| Google Fonts | Google CDN | OFL | Inter font |

---

*Last updated: TODO: Date*
