# Detail + Donate Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the donor track Detail + Donate page so Browse cards open NaviSight detail and the primary CTA routes toward donation success.

**Architecture:** Keep static project data in `src/data/projects.ts`; route `/projects/:id` renders a down-drill detail page that consumes `getProject`. Browse owns only list navigation. The donation CTA encodes selected amount in the route query and lands on a lightweight success placeholder until the full Success page is implemented.

**Tech Stack:** React + Vite + TypeScript, React Router, Tailwind CSS v3, existing FuelUp design tokens.

## Global Constraints

- Product UI text must be English.
- Explanation and implementation notes can be Chinese, but user-facing app text stays English.
- Mobile-first layout targets modern iPhone logical widths around 393-402pt and must respect safe-area insets.
- Follow `design/fuelup-design-reference.html`: dark Indigo x Cyan design system, down-drill top nav for Detail + Donate, gradient CTA, amount chips, live token estimate.
- Use Alex's NaviSight as the only dummy project for now.
- No real payment integration in this task.

---

### Task 1: Route Browse Cards to Detail

**Files:**
- Modify: `src/pages/Browse.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `ProjectCard` `onOpen(id: string)`
- Produces: `/projects/:id` app route

- [ ] **Step 1: Update Browse navigation**

Use `useNavigate` from `react-router-dom`. Replace the placeholder `openProject` with `navigate(`/projects/${id}`)`.

- [ ] **Step 2: Add the detail route**

Import `ProjectDetail` and add `<Route path="/projects/:id" element={<ProjectDetail />} />`.

- [ ] **Step 3: Verify**

Run `npm run build`. Expected: build succeeds.

### Task 2: Build Detail + Donate Page

**Files:**
- Create: `src/pages/ProjectDetail.tsx`

**Interfaces:**
- Consumes: `getProject(id)`, `fundingPercent(project)`, `formatTokens(usd)`
- Produces: page UI for `/projects/:id`

- [ ] **Step 1: Create down-drill shell**

Use `useParams`, `useNavigate`, and `useMemo`. Render a mobile `max-w-md` shell with safe-area padding. Header has a top-left back button that goes to `/browse`, centered title `NaviSight`, and right-side `Fundraising` pill.

- [ ] **Step 2: Render project content**

Show status/use-case chips, project title, full description, intended AI use, fundraising card with progress bar and `$raised / $goal`.

- [ ] **Step 3: Render amount selector**

Support `$10`, `$30`, `$50`, and custom input. Default amount is `$30`. Selected chips use the Indigo x Cyan gradient. Token estimate reads `$30 gives Alex approximately 1.5M GPT-4o tokens.`

- [ ] **Step 4: Wire CTA**

Primary CTA text is `Fund this idea`. On click, route to `/donate/success?project=navisight&amount=30`.

- [ ] **Step 5: Render unknown project fallback**

If `getProject(id)` returns undefined, render the down-drill shell with `Project not found`, body copy, and a `Back to Browse` CTA.

### Task 3: Add Success Placeholder

**Files:**
- Create: `src/pages/DonationSuccessPlaceholder.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: query params `project` and `amount`
- Produces: `/donate/success` non-404 route for the Detail CTA

- [ ] **Step 1: Create placeholder**

Render a minimal mobile screen with success status, amount summary, and a `Back to projects` button routing to `/browse`.

- [ ] **Step 2: Add route**

Add `<Route path="/donate/success" element={<DonationSuccessPlaceholder />} />`.

### Task 4: Verify Flow

**Files:**
- No source changes expected.

- [ ] **Step 1: Build**

Run `npm run build`. Expected: Vite production build succeeds.

- [ ] **Step 2: Browser flow**

Run `npm run preview`, open 393x852 viewport, verify:
- Landing `Continue as donor` routes to `/browse`.
- Tapping NaviSight routes to `/projects/navisight`.
- Back button returns to `/browse`.
- Amount chips update estimate.
- `Fund this idea` routes to `/donate/success?project=navisight&amount=<selected>`.

- [ ] **Step 3: Commit and PR**

Commit on a feature branch and open/update a PR.

