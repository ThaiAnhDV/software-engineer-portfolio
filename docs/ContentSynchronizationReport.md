# Content Synchronization Report

**Date:** July 30, 2026
**Portfolio:** Đặng Văn Thái Anh Portfolio
**Status:** PENDING APPROVAL

---

## Executive Summary

| Category | Issues | Severity |
|----------|--------|----------|
| Placeholder Values | 25+ | HIGH |
| Fabricated Information | 8 | HIGH |
| Content Duplications | 6 | MEDIUM |
| Missing JSON Sync | 7 | MEDIUM |
| Inconsistent Contact Info | 4 | MEDIUM |
| Project Mismatch | 1 | HIGH |

**Total Issues:** 45+
**Files Affected:** 12

---

## 1. Placeholder Values

### 1.1 Author Information

| Location | Current Value | Should Be |
|----------|---------------|-----------|
| index.html:13 | `Your Name` | `Đặng Văn Thái Anh` |
| index.html:21 | `Your Name — Software Engineer` | `Đặng Văn Thái Anh — Software Engineer` |
| index.html:32 | `Your Name — Software Engineer` | `Đặng Văn Thái Anh — Software Engineer` |
| index.html:69 | `Your Name — Software Engineer` | `Đặng Văn Thái Anh — Software Engineer` |
| index.html:203 | `alt="Profile portrait of Your Name"` | `alt="Profile portrait of Đặng Văn Thái Anh"` |
| index.html:253 | `alt="Professional portrait of Your Name"` | `alt="Professional portrait of Đặng Văn Thái Anh"` |
| index.html:2117 | `<span class="brand-name">Your Name</span>` | `<span class="brand-name">Đặng Văn Thái Anh</span>` |
| index.html:2217 | `&copy; ... Your Name` | `&copy; ... Đặng Văn Thái Anh` |
| data/portfolio.json:4 | `author: "Đặng Văn Thái Anh"` | ✓ CORRECT |
| data/socials.json:3 | `author: "Đặng Văn Thái Anh"` | ✓ CORRECT |
| ai-interview-platform.html:8 | `content="Your Name"` | `content="Đặng Văn Thái Anh"` |
| ai-interview-platform.html:56 | `"name": "Your Name"` | `"name": "Đặng Văn Thái Anh"` |
| ai-interview-platform.html:70,72 | `Your Name` | `Đặng Văn Thái Anh` |
| hotel-management-system.html:8,56,70,72,748,750,808 | Multiple `Your Name` | `Đặng Văn Thái Anh` |
| salesphere-management.html:8,56,70,72,748,750,808 | Multiple `Your Name` | `Đặng Văn Thái Anh` |
| project-detail-template.html:8,56,70,72,500,502,560 | Multiple `Your Name` | `Đặng Văn Thái Anh` |
| component-templates.html:21,98,613,687 | Multiple `Your Name` | `Đặng Văn Thái Anh` |
| site.webmanifest:2 | `"name": "Your Name"` | `"name": "Đặng Văn Thái Anh"` |

**Action:** Update all files to use `Đặng Văn Thái Anh` consistently.

### 1.2 URLs and Links

| Location | Current Value | Should Be |
|----------|---------------|-----------|
| index.html:20,31,37 | `https://username.github.io/portfolio/` | UPDATE WITH REAL URL |
| index.html:180 | `https://github.com/` | UPDATE WITH REAL GITHUB |
| index.html:183 | `https://linkedin.com/in/` | UPDATE WITH REAL LINKEDIN |
| index.html:186 | `mailto:email@example.com` | UPDATE WITH REAL EMAIL |
| data/portfolio.json:6 | `email@example.com` | UPDATE WITH REAL EMAIL |
| data/portfolio.json:8 | `https://username.github.io/portfolio` | UPDATE WITH REAL URL |
| data/portfolio.json:9-11 | GitHub/LinkedIn/Twitter placeholders | UPDATE WITH REAL LINKS |
| data/projects.json:27,65,103,141,179,217 | `https://github.com/` | UPDATE WITH REAL GITHUB |
| data/contact.json:73,105 | Social placeholders | UPDATE WITH REAL LINKS |
| data/socials.json:8-11 | Social placeholders | UPDATE WITH REAL LINKS |

**Action:** Replace all placeholder URLs with real information.

### 1.3 Credential IDs

| Location | Current Value | Should Be |
|----------|---------------|-----------|
| data/certificates.json:14 | `AWS-SAA-2024-12345` | VERIFY OR REMOVE |
| data/certificates.json:32 | `GG-DATA-2023-67890` | VERIFY OR REMOVE |
| data/certificates.json:50 | `META-FE-2023-11111` | VERIFY OR REMOVE |
| data/certificates.json:68 | `AZ-900-2023-22222` | VERIFY OR REMOVE |
| data/certificates.json:86 | `PMP-2023-33333` | VERIFY OR REMOVE |
| data/certificates.json:104 | `CKA-2024-44444` | VERIFY OR REMOVE |

**Action:** Replace with real credential IDs or remove if not verified.

---

## 2. Fabricated Information

### 2.1 Experience Metrics

| Location | Content | Issue |
|----------|---------|-------|
| index.html:1449 | `serving 100K+ daily active users` | UNVERIFIED |
| index.html:1450 | `reducing deployment time by 60%` | UNVERIFIED |
| index.html:1452 | `improving performance by 40%` | UNVERIFIED |
| data/experience.json:16-19 | Same fabricated metrics | UNVERIFIED |

**Issue:** These specific percentages and metrics are fabricated placeholder data.

**Action:** Replace with verified metrics or remove specific numbers.

### 2.2 Statistics

| Location | Content | Issue |
|----------|---------|-------|
| data/portfolio.json:55 | `{ value: 25, label: "Projects Completed" }` | UNVERIFIED |
| data/portfolio.json:56 | `{ value: 5, label: "Years Experience" }` | INCONSISTENT (see below) |
| data/portfolio.json:57 | `{ value: 15, label: "Happy Clients" }` | UNVERIFIED |
| index.html:366 | `data-counter="5"` | Should be 6 based on timeline |

**Inconsistency:** Experience shows:
- Timeline: 2018-2026 = 8 years
- Stats: 5 years (inconsistent)
- Skills: JavaScript says "6+ years"

**Action:** Verify and correct all statistics.

---

## 3. Content Duplications

### 3.1 Certificate Images

| Certificate | JSON Reference | Status |
|-------------|----------------|--------|
| AWS SAA | `aws-saa.webp` | Unique ✓ |
| Google Data | `google-data.webp` | Unique ✓ |
| Meta Frontend | `google-data.webp` | DUPLICATE ✗ |
| Azure AZ-900 | `google-data.webp` | DUPLICATE ✗ |
| PMP | `google-data.webp` | DUPLICATE ✗ |
| CKA | `aws-saa.webp` | DUPLICATE ✗ |

**Issue:** 4 of 6 certificates share the same placeholder image.

**Action:** Update `data/certificates.json` with unique image paths for each certificate (after assets are created).

### 3.2 Project 7 Mismatch

| Location | Project | Issue |
|----------|---------|-------|
| index.html:1350 | "Learning management system" | EXISTS |
| data/projects.json | Only 6 projects | MISSING |

**Issue:** HTML references a 7th project (LMS) that doesn't exist in JSON.

**Action:** Add LMS to `data/projects.json` OR remove from index.html.

### 3.3 Hero Content

| Location | Content |
|----------|---------|
| index.html:154 | `Đặng Văn Thái Anh` (correct) |
| index.html:203,253 | `Your Name` (placeholder in alt text) |

**Action:** Update alt text to match actual name.

---

## 4. Missing JSON Synchronization

### 4.1 Projects (JSON vs HTML)

| Project | HTML | JSON | Status |
|---------|------|------|--------|
| E-Commerce Platform | ✓ | ✓ | Synced |
| Task Management System | ✓ | ✓ | Synced |
| AI Content Generator | ✓ | ✓ | Synced |
| Real-time Chat App | ✓ | ✓ | Synced |
| Fitness Tracking App | ✓ | ✓ | Synced |
| AWS Monitoring Tool | ✓ | ✓ | Synced |
| LMS | ✓ | ✗ | MISSING IN JSON |

### 4.2 Technologies Synced

| HTML Tags | JSON Technologies | Status |
|-----------|-------------------|--------|
| React, Node.js, MongoDB, AWS, Stripe | ✓ | Synced |
| Vue.js, Firebase, Tailwind | ✓ | Synced |
| Python, FastAPI, React | ✓ | Synced |
| Socket.io, Node.js, WebRTC | ✓ | Synced |
| React Native, GraphQL, Node.js | ✓ | Synced |
| TypeScript, Lambda, DynamoDB | ✓ | Synced |

**Status:** Technologies are synced between HTML and JSON for all 6 matching projects.

---

## 5. Inconsistent Contact Information

### 5.1 Contact Details

| Location | Email | Status |
|----------|-------|--------|
| index.html:186 | `email@example.com` | PLACEHOLDER |
| data/portfolio.json:6 | `email@example.com` | PLACEHOLDER |
| data/contact.json:18 | `email@example.com` | PLACEHOLDER |
| data/socials.json:39 | `mailto:email@example.com` | PLACEHOLDER |

**Action:** Update all to same real email address.

### 5.2 Location Consistency

| Location | Value |
|----------|-------|
| data/portfolio.json:7 | `Ho Chi Minh City, Vietnam` |
| index.html:1432,1477,1521 | `Ho Chi Minh City` |

**Status:** Location is mostly consistent (Vietnam can be added to HTML).

---

## 6. Files Requiring Updates

### 6.1 Must Update

| File | Changes Required |
|------|------------------|
| `index.html` | Replace 10+ "Your Name" placeholders, update URLs |
| `data/portfolio.json` | Update email, URLs (already correct name) |
| `data/projects.json` | Add project 7 OR confirm removal, update URLs |
| `data/certificates.json` | Fix duplicate images, update credentials |
| `data/contact.json` | Update email, social links |
| `data/socials.json` | Update social links, URL |
| `ai-interview-platform.html` | Replace author name |
| `hotel-management-system.html` | Replace author name |
| `salesphere-management.html` | Replace author name |
| `project-detail-template.html` | Replace author name |
| `component-templates.html` | Replace author name |
| `site.webmanifest` | Replace name |

### 6.2 No Changes Required

| File | Status |
|------|--------|
| `data/experience.json` | Correct |
| `data/skills.json` | Correct |
| `docs/PortfolioContent.md` | Template only, not user-facing |

---

## 7. Synchronization Matrix

### Author Name

| File | Current | Required |
|------|---------|----------|
| index.html:154 | `Đặng Văn Thái Anh` | `Đặng Văn Thái Anh` ✓ |
| index.html:13,21,32,69,203,253,2117,2217 | `Your Name` | `Đặng Văn Thái Anh` ✗ |
| data/portfolio.json | `Đặng Văn Thái Anh` | `Đặng Văn Thái Anh` ✓ |
| Project detail pages | `Your Name` | `Đặng Văn Thái Anh` ✗ |

### Projects

| ID | Title | HTML | JSON | Status |
|----|-------|------|------|--------|
| 1 | E-Commerce Platform | ✓ | ✓ | Synced |
| 2 | Task Management System | ✓ | ✓ | Synced |
| 3 | AI Content Generator | ✓ | ✓ | Synced |
| 4 | Real-time Chat App | ✓ | ✓ | Synced |
| 5 | Fitness Tracking App | ✓ | ✓ | Synced |
| 6 | AWS Monitoring Tool | ✓ | ✓ | Synced |
| 7 | LMS | ✓ | ✗ | MISSING |

### Technologies

| Project | HTML Technologies | JSON Technologies | Match |
|---------|-------------------|-------------------|-------|
| 1 | React, Node.js, MongoDB, AWS, Stripe | ✓ | Yes |
| 2 | Vue.js, Firebase, Tailwind | ✓ | Yes |
| 3 | Python, FastAPI, React | ✓ | Yes |
| 4 | Socket.io, Node.js, WebRTC | ✓ | Yes |
| 5 | React Native, GraphQL, Node.js | ✓ | Yes |
| 6 | TypeScript, Lambda, DynamoDB | ✓ | Yes |

### Experience

| Company | HTML | JSON | Match |
|---------|------|------|-------|
| Ocean Tech | ✓ | ✓ | Yes |
| Tech Solutions Corp | ✓ | ✓ | Yes |
| Quality First Labs | ✓ | ✓ | Yes |
| University of Technology | ✓ | ✓ | Yes |

### Certificates

| Certificate | HTML | JSON | Images |
|-------------|------|------|--------|
| AWS SAA | ✓ | ✓ | Unique |
| Google Data Analytics | ✓ | ✓ | Unique |
| Meta Frontend | ✓ | ✓ | DUPLICATE |
| Azure AZ-900 | ✓ | ✓ | DUPLICATE |
| PMP | ✓ | ✓ | DUPLICATE |
| CKA | ✓ | ✓ | DUPLICATE |

---

## 8. Required Actions (Approval Required)

### Critical (Must Fix)

- [ ] **Replace "Your Name"** in all HTML files with `Đặng Văn Thái Anh`
- [ ] **Add Project 7 to JSON** or remove from HTML
- [ ] **Fix certificate images** in `data/certificates.json`
- [ ] **Verify/update credentials** in `data/certificates.json`

### High Priority

- [ ] **Update contact email** across all files
- [ ] **Update GitHub URL** across all files
- [ ] **Update LinkedIn URL** across all files
- [ ] **Verify statistics** (projects, years, clients)

### Medium Priority

- [ ] **Update fabricated metrics** in experience descriptions
- [ ] **Add credential verification URLs** to certificates
- [ ] **Update Twitter/social URLs**

---

## 9. Files NOT to Modify

Per requirements, the following will NOT be modified:
- Layout/structure of any HTML files
- CSS styling files
- Documentation files (except if content-specific)

---

## Appendix: Affected Line References

### index.html
```
Line 13:  <meta name="author" content="Your Name" />
Line 21:  <meta property="og:title" content="Your Name — Software Engineer" />
Line 32:  <meta name="twitter:title" content="Your Name — Software Engineer" />
Line 69:  <title>Your Name — Software Engineer</title>
Line 180: href="https://github.com/"
Line 183: href="https://linkedin.com/in/"
Line 186: href="mailto:email@example.com"
Line 203: alt="Profile portrait of Your Name"
Line 253: alt="Professional portrait of Your Name"
Line 1350: src="assets/images/projects/project-7.webp" (LMS)
Line 1449-1452: Fabricated metrics
Line 2117: <span class="brand-name">Your Name</span>
Line 2217: &copy; ... Your Name
```

### data/certificates.json
```
Line 36:  "image": "assets/images/certificates/google-data.webp"
Line 54:  "image": "assets/images/certificates/google-data.webp"
Line 72:  "image": "assets/images/certificates/google-data.webp"
Line 90:  "image": "assets/images/certificates/google-data.webp"
Line 108: "image": "assets/images/certificates/aws-saa.webp"
```

### data/projects.json
```
Missing: 7th project (LMS)
```

---

*Report generated by Cursor AI - Senior Software Architect*
*Awaiting approval for synchronization changes*
