# AI Evolution Timeline

Educational Next.js 14 App (TypeScript + Tailwind) showcasing AI's evolution from rule-based
systems to multi-agent architectures. The app is driven by static data in `/data/timeline.ts` and includes comprehensive SEO optimization.

## Quick start

1. Install dependencies

```bash
cd /workspaces/Future-Trace
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Features

- **Interactive AI Evolution Timeline** — Browse milestones from 1950s to 2030s with expandable details
- **Filter & Search** — Filter by technology category, search across year, title, industry, job role
- **Industry Adoption Waves** — See how 8 industries adopted and use AI
- **Jobs Affected Analysis** — Understand which roles are highly exposed, moderately exposed, AI-augmented, or resilient
- **What Comes Next** — Overview of AI governance, traceability, and human-in-the-loop systems
- **SEO Optimized** — Metadata, Open Graph, JSON-LD structured data, semantic HTML, robots.txt

## Tech Stack

- Next.js 14 with App Router and TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Static data driven (no database required)

## Project Structure

```
app/
  layout.tsx          # Root layout with SEO metadata, Open Graph, JSON-LD
  page.tsx            # Homepage with all sections
  globals.css         # Tailwind directives
components/
  Header.tsx          # Main heading (H1)
  Timeline.tsx        # Interactive timeline with filters & search
  IndustryWaves.tsx   # Industry adoption cards
  JobsAffected.tsx    # Job impact groups
  WhatComesNext.tsx   # Future directions CTA
data/
  timeline.ts         # 12 AI milestones from 1950s–2030s
  industries.ts       # 8 industry cards with early/current/future AI use
  jobs.ts             # 4 job exposure groups with example roles
public/
  robots.txt          # SEO-friendly robot directives
```

## Extending

- Edit `/data/timeline.ts` to add or modify AI milestones
- Edit `/data/industries.ts` to update industry adoption stories
- Edit `/data/jobs.ts` to adjust job exposure groups

## Deployment

Build for production:

```bash
npm run build
npm start
```

Or deploy to Vercel:

```bash
vercel deploy
```

## SEO Features

- **Semantic HTML** — Proper H1/H2 hierarchy, section landmarks with aria-labelledby
- **Metadata** — Title, description, keywords, author in layout
- **Open Graph** — og:title, og:description, og:type, og:url for social sharing
- **Twitter Cards** — twitter:card, twitter:title, twitter:description
- **JSON-LD** — EducationalWebpage schema for search engine understanding
- **Robots.txt** — Guides crawlers and references sitemap
- **Accessibility** — ARIA labels, semantic roles (contentinfo), keyboard navigation

## Notes

This is a free educational feature of the Future Trace web app. Use it as a base for building
AI literacy resources, training materials, or educational content at scale.

# Future Trace

**Future Trace** is an AI-powered career intelligence and workforce transition platform that helps people understand how AI is changing industries, how exposed their current role is to automation, and what career paths they can move toward next.

The platform combines AI evolution insights, job automation exposure analysis, AI-safe career recommendations, and personalized transition roadmaps.

---

## What Future Trace Does

Future Trace answers three important questions:

1. **How is AI changing my industry?**
2. **How likely is AI to impact my current role?**
3. **What should I learn or build to stay future-ready?**

---

## Core Product Layers

### Layer 1: AI Evolution Intelligence Hub

Educational layer designed for awareness, learning, and industry intelligence.

Features:

- Interactive AI evolution timeline
- Industry-specific AI evolution pages
- AI adoption trends across healthcare, finance, software, marketing, and customer support
- Weekly AI trend digest
- Educational content around AI agents, automation, and workforce transformation

---

### Layer 2: AI Career Transition Copilot

Action-oriented layer focused on helping users transition into future-ready careers.

Features:

- “Will AI Replace My Job?” exposure score
- AI-safe career suggestions
- Personalized career transition roadmap
- Resume and LinkedIn optimizer
- Resume vs job gap analyzer
- AI learning planner
- AI interview simulator

---

### Layer 3: Career Growth Tools

Advanced tools for users who want deeper career guidance and execution support.

Features:

- Portfolio project generator
- AI career mentor chat
- Job application tracker
- Interview preparation workflows
- Personalized learning progress tracking

---

### Layer 4: Future Enterprise Expansion

Future B2B and advisory layer focused on workforce intelligence and AI governance.

Features:

- Workforce AI exposure dashboard
- Skill transition intelligence
- AI readiness reports
- DTAG-style decision traceability layer
- Governance and accountability insights for AI-driven decisions

---

## Target Users

Future Trace is designed for:

- Students
- Job seekers
- Mid-career professionals
- People concerned about AI-driven workforce changes
- Career switchers
- Upskilling professionals
- Future enterprise HR and workforce planning teams

---

## Example User Flow

1. User enters their current role, industry, and experience level.
2. Future Trace generates an AI exposure score.
3. User receives AI-safe career recommendations.
4. User explores personalized transition roadmaps and learning plans.
5. Users prepare for interviews, optimize resumes, and build portfolio projects.

---

## Tech Stack

Suggested MVP stack:

- Frontend: Next.js
- Styling: Tailwind CSS
- Backend: Supabase
- Authentication: Supabase Auth or Clerk
- Payments: Stripe
- AI Layer: OpenAI API
- Hosting: Vercel

---

## MVP Goal

The first version of Future Trace should focus on:

- Launching quickly
- Validating user demand
- Helping users understand AI-driven workforce transformation
- Providing actionable career transition guidance
- Building a scalable AI career intelligence platform

---

## Long-Term Vision

Future Trace aims to become a trusted platform for AI-era career intelligence, workforce transformation, and decision traceability.

Over time, the platform can expand from individual career guidance into enterprise AI workforce planning and DTAG-based AI advisory services.

---

## Positioning Statement

Future Trace helps people and organizations understand the future of work by tracing how AI is changing industries, jobs, skills, and decisions.

---

## Status

MVP planning stage.
