# Portfolio Content Guide

## Content Strategy

### Brand Voice

| Attribute | Description |
|-----------|-------------|
| **Tone** | Professional yet approachable |
| **Personality** | Confident, detail-oriented, growth-minded |
| **Language** | Clear, concise, jargon-free |
| **Perspective** | First person for personal content, third for technical |

---

## Page-by-Page Content

### Hero Section

| Element | Content | Character Limit |
|---------|---------|-----------------|
| **Headline** | `TODO: One-line professional statement` | 80 chars |
| **Subheadline** | `TODO: Brief value proposition` | 120 chars |
| **CTA Button** | "View My Work" / "Contact Me" | 20 chars |
| **Social Links** | GitHub, LinkedIn, Email, Resume | 4 max |

**Template:**
```markdown
# Hero Headline
TODO: I build [WHAT] with [HOW] for [WHO].

# Subheadline
TODO: Brief description of expertise and approach.
```

---

### About Section

| Element | Content | Character Limit |
|---------|---------|-----------------|
| **Title** | "About Me" | 15 chars |
| **Photo** | Professional headshot | 2MB max |
| **Bio Paragraph 1** | `TODO: Background and origin` | 300 chars |
| **Bio Paragraph 2** | `TODO: Current focus and approach` | 300 chars |
| **Bio Paragraph 3** | `TODO: Interests or personal note` | 200 chars |
| **Location** | `TODO: City, Country` | 50 chars |
| **Availability** | "Open to opportunities" / "Not available" | 30 chars |

**Template:**
```markdown
# About Me

[TECHNICAL BACKGROUND]
TODO: Paragraph about professional journey.

[CURRENT FOCUS]
TODO: Paragraph about current role and expertise.

[PERSONAL NOTE]
TODO: Brief personal interest or hobby (optional).
```

---

### Skills Section

| Element | Content | Format |
|---------|---------|--------|
| **Section Title** | "Skills" or "Technical Skills" | - |
| **Skill Groups** | Categories (Frontend, Backend, Tools, etc.) | 4-6 groups |
| **Skill Items** | Individual technologies | 5-10 per group |
| **Skill Level** | Optional: beginner/intermediate/advanced/expert | - |

**Skill Group Template:**
```markdown
## [Group Name]

| Skill | Proficiency |
|-------|-------------|
| TODO  | TODO        |
| TODO  | TODO        |
```

**Default Categories:**
1. Frontend Development
2. Backend Development
3. Databases
4. DevOps & Tools
5. Cloud Platforms
6. Other Skills

---

### Projects Section

| Element | Content | Character Limit |
|---------|---------|-----------------|
| **Section Title** | "Projects" or "Featured Work" | 20 chars |
| **Project Title** | `TODO: Project name` | 60 chars |
| **Category** | `TODO: Project category` | 30 chars |
| **Short Description** | `TODO: One-line summary` | 100 chars |
| **Tech Stack** | Technologies used | 200 chars |
| **Year** | Completion year | 4 chars |
| **Links** | GitHub, Demo, Case Study | 3 max |

**Project Card Content:**

```markdown
## Project Title

TODO: Brief description of what the project does and its purpose.

### Details
- **Category:** TODO
- **Year:** TODO
- **Role:** TODO
- **Team:** TODO (if applicable)

### Technologies
TODO: List of technologies, frameworks, tools

### Links
- [GitHub](URL)
- [Live Demo](URL)
- [Case Study](URL)
```

**Project Detail Page Content:**

| Section | Content |
|---------|---------|
| **Overview** | Project summary, stats, quick links |
| **Problem** | Business problem or challenge addressed |
| **Solution** | How the problem was solved |
| **Architecture** | System design and tech decisions |
| **Features** | Key functionality delivered |
| **Responsibilities** | What was contributed |
| **Challenges** | Technical obstacles and solutions |
| **Gallery** | Screenshots and mockups |
| **Case Study** | Detailed analysis and results |

---

### Experience Section

| Element | Content | Character Limit |
|---------|---------|-----------------|
| **Section Title** | "Experience" or "Work History" | 20 chars |
| **Job Title** | `TODO: Position title` | 60 chars |
| **Company** | `TODO: Company name` | 60 chars |
| **Duration** | `TODO: Start - End` or `TODO - Present` | 20 chars |
| **Description** | Key responsibilities and achievements | 500 chars |
| **Highlights** | 3-5 bullet points | 200 chars each |

**Experience Entry Template:**
```markdown
## [Job Title]

**Company Name** | Location | Duration

TODO: Brief description of company and role.

### Highlights
- TODO: Achievement or responsibility
- TODO: Achievement or responsibility
- TODO: Achievement or responsibility
```

---

### Certificates Section

| Element | Content | Character Limit |
|---------|---------|-----------------|
| **Section Title** | "Certificates" or "Certifications" | 25 chars |
| **Certificate Name** | `TODO: Official certification name` | 100 chars |
| **Issuer** | `TODO: Issuing organization` | 60 chars |
| **Date** | `TODO: Month Year` | 10 chars |
| **Credential ID** | `TODO: Certificate ID` | 50 chars |
| **Credential URL** | `TODO: Verification link` | 100 chars |

**Certificate Entry Template:**
```markdown
## [Certificate Name]

**Issued by:** TODO: Organization
**Date:** TODO: Month Year
**Credential ID:** TODO: ID (if available)

[View Certificate](URL)
[Verify](URL)
```

---

### Contact Section

| Element | Content | Character Limit |
|---------|---------|-----------------|
| **Section Title** | "Contact" or "Get in Touch" | 20 chars |
| **Headline** | Call to action | 80 chars |
| **Description** | How to reach out | 200 chars |
| **Email** | `TODO: email@example.com` | 100 chars |
| **Response Time** | Expected response time | 50 chars |

**Contact Form Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|-------------|
| Name | text | Yes | 2-100 characters |
| Email | email | Yes | Valid email format |
| Subject | text | Yes | 5-200 characters |
| Message | textarea | Yes | 10-2000 characters |

---

## Writing Guidelines

### Tone & Style

| Do | Don't |
|----|-------|
| Use active voice | Use passive voice |
| Be specific | Use vague language |
| Show, don't tell | Overpromise |
| Be authentic | Use clichés |
| Quantify when possible | Be vague about achievements |

### Examples

**Good:**
> "Reduced page load time by 60% by implementing lazy loading and image optimization."

**Bad:**
> "I worked on performance improvements."

### Action Verbs for Experience

| Category | Verbs |
|----------|-------|
| Leadership | Led, Managed, Coordinated, Directed |
| Technical | Built, Developed, Implemented, Designed, Architected |
| Achieved | Increased, Reduced, Improved, Optimized |
| Collaborated | Partnered with, Collaborated, Worked closely |

---

## Image Requirements

### Profile Photo

| Property | Specification |
|----------|---------------|
| **Format** | WebP or JPEG |
| **Size** | 400x400 pixels minimum |
| **Aspect Ratio** | 1:1 (square) |
| **File Size** | Under 100KB |
| **Background** | Clean, neutral |
| **Expression** | Professional, approachable |
| **Attire** | Business casual or formal |

### Project Screenshots

| Property | Specification |
|----------|---------------|
| **Format** | WebP with PNG fallback |
| **Width** | 1200px minimum |
| **File Size** | Under 500KB each |
| **Content** | Clear, not cluttered |
| **Browser Frame** | Optional |

### Certificate Images

| Property | Specification |
|----------|---------------|
| **Format** | WebP or PNG |
| **Width** | 800px minimum |
| **File Size** | Under 300KB |
| **Content** | Full certificate visible |

---

## Content Review Checklist

- [ ] All TODO placeholders replaced
- [ ] No placeholder text remains
- [ ] All links verified and working
- [ ] All images have alt text
- [ ] Contact form configured
- [ ] External links open in new tab
- [ ] No broken images
- [ ] SEO meta tags populated
- [ ] Social links verified

---

## Update Schedule

| Content | Update Frequency |
|---------|-----------------|
| Projects | When new project completed |
| Experience | When job changes |
| Skills | Quarterly review |
| Certificates | When earned |
| Bio | Annually or as needed |
| Links | Monthly verification |

---

*Last updated: TODO: Date*
