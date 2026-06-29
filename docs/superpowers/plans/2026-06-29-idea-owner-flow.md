# Idea Owner Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the idea-owner side of FuelUp: My Ideas, per-idea Dashboard, and Post New Idea, with routes correctly connected from Landing.

**Architecture:** Add a static `creatorIdeas` data module separate from donor browse data because this flow needs creator-specific fields: available balance, masked API key, live API call status, and owner-facing status. Route `/ideas` is the top-level owner entry; `/ideas/:id` and `/ideas/new` are down-drill screens with app-level back controls. Post New Idea is a mocked form that returns to `/ideas?created=1` without backend persistence.

**Tech Stack:** React + Vite + TypeScript, React Router, Tailwind CSS v3, existing FuelUp design tokens.

## Global Constraints

- Product UI text must be English.
- Explanations can be Chinese, but shareable/product UI strings remain English.
- Mobile-first layout targets modern iPhone logical widths around 393-402pt and respects safe-area insets.
- Follow `design/fuelup-design-reference.html`: dark Indigo x Cyan base, Violet x Indigo for creator CTAs, top-level nav for My Ideas, down-drill nav for Dashboard and Post New Idea.
- Use static mock data only; no backend or persistent storage.
- Show NaviSight as the main idea and EchoNote as secondary mock data, matching the design prototype.

---

### Task 1: Creator Data

**Files:**
- Create: `src/data/creatorIdeas.ts`

**Interfaces:**
- Produces: `CreatorIdea`, `creatorIdeas`, `getCreatorIdea(id)`, `creatorFundingPercent(idea)`, `formatCurrency(usd)`
- Consumes: existing `formatTokens` helper from `src/data/projects.ts`

- [ ] **Step 1: Define data shape**

Include fields: `id`, `name`, `tagline`, `description`, `useCase`, `goal`, `raised`, `availableBalance`, `apiKeyPreview`, `status`, `lastDonation`, `liveResponse`.

- [ ] **Step 2: Seed ideas**

Seed `navisight` with `$30 / $50`, `$30` available balance, GPT-4o Vision, and a masked API key. Seed `echonote` with `$5 / $40` as a secondary card.

### Task 2: Shared Owner UI Patterns

**Files:**
- Create: `src/components/OwnerTopNav.tsx`
- Create: `src/components/CreatorIdeaCard.tsx`

**Interfaces:**
- `OwnerTopNav` props: `variant: 'top-level' | 'down-drill'`, `title`, `subtitle?`, `onBack?`, `action?`
- `CreatorIdeaCard` props: `idea: CreatorIdea`, `onOpen(id)`

- [ ] **Step 1: OwnerTopNav**

Render the top-level header for My Ideas and a down-drill header for Dashboard/Post New Idea.

- [ ] **Step 2: CreatorIdeaCard**

Render per-idea status, progress, balance, and an open affordance.

### Task 3: My Ideas Page

**Files:**
- Create: `src/pages/MyIdeas.tsx`

**Interfaces:**
- Route: `/ideas`
- Consumes: `creatorIdeas`
- Produces: navigation to `/ideas/:id` and `/ideas/new`

- [ ] **Step 1: Layout**

Top-level owner header, summary strip, list of creator idea cards.

- [ ] **Step 2: Actions**

Click idea card routes to `/ideas/:id`; `Post new idea` routes to `/ideas/new`.

- [ ] **Step 3: Created feedback**

If query `created=1`, show `Idea draft added to your workspace.`

### Task 4: Idea Dashboard Page

**Files:**
- Create: `src/pages/IdeaDashboard.tsx`

**Interfaces:**
- Route: `/ideas/:id`
- Consumes: `getCreatorIdea`
- Produces: local live API call demo state

- [ ] **Step 1: Dashboard shell**

Down-drill nav with back to `/ideas`; not found fallback.

- [ ] **Step 2: Balance and API key**

Show available balance, incoming donations, masked API key, and copy affordance.

- [ ] **Step 3: Live API call**

`Run live API call` toggles a local success panel: `200 OK · response received`.

### Task 5: Post New Idea Page

**Files:**
- Create: `src/pages/PostNewIdea.tsx`

**Interfaces:**
- Route: `/ideas/new`
- Produces: navigation to `/ideas?created=1`

- [ ] **Step 1: Form shell**

Down-drill nav with cancel/back to `/ideas`. Fields: idea name, pitch, goal amount, intended AI use case.

- [ ] **Step 2: Mock submit**

CTA `Submit idea` routes to `/ideas?created=1`.

### Task 6: Route Wiring and Verification

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Landing creator route**

Clicking `Continue as creator` plays entering animation then routes to `/ideas`.

- [ ] **Step 2: Add routes**

Add `/ideas`, `/ideas/new`, `/ideas/:id`.

- [ ] **Step 3: Verify**

Run `npm run build` and browser-check: Landing → creator → My Ideas → NaviSight Dashboard → Run live API call → Back → Post New Idea → Submit → My Ideas confirmation.

