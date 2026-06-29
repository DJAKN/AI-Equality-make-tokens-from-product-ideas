# Donation Success Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the donor-flow success placeholder with a high-fidelity Donation Success screen that matches the FuelUp design reference and connects cleanly from Detail + Donate.

**Architecture:** Keep the existing `/donate/success?project=<id>&amount=<usd>` route. The Success page reads query params, resolves the static project data, computes post-donation progress locally for demo purposes, and returns to Browse via app-level routing. No real payment or global state mutation is introduced.

**Tech Stack:** React + Vite + TypeScript, React Router, Tailwind CSS v3, existing FuelUp design tokens.

## Global Constraints

- Product UI text must be English.
- Explanations can be Chinese, but shareable/product UI strings remain English.
- Mobile-first layout targets modern iPhone logical widths around 393-402pt and respects safe-area insets.
- Follow `design/fuelup-design-reference.html`: dark Indigo x Cyan visual system, terminal success screen, no back arrow, impact line, updated project status, `Back to projects` forward CTA.
- Only Alex's NaviSight project is shown for now.
- No real payment integration and no backend state mutation in this task.

---

### Task 1: Upgrade Success Placeholder to High-Fidelity Page

**Files:**
- Modify: `src/pages/DonationSuccessPlaceholder.tsx`

**Interfaces:**
- Consumes: query params `project` and `amount`
- Consumes: `getProject(id)`, `formatTokens(usd)`, `fundingPercent(project-like)`
- Produces: terminal success page for `/donate/success`

- [ ] **Step 1: Parse route state**

Read `project` and `amount` from `useSearchParams`. Default amount to `30`; default project copy to NaviSight fallback if the query is absent.

- [ ] **Step 2: Compute demo impact**

Compute `previousRaised`, `updatedRaised = min(goal, raised + amount)`, and `updatedPct`. Keep this local; do not mutate `projects`.

- [ ] **Step 3: Render success moment**

Render a centered success burst/check, eyebrow `Donation complete`, title `You just fueled NaviSight`, and impact line `$30 → ~1.5M GPT-4o tokens for Alex`.

- [ ] **Step 4: Render updated project status**

Show an impact card with `Fundraising updated`, `$30 / $50`, progress bar, and short copy explaining that FuelUp converts the donation into platform-managed API access.

- [ ] **Step 5: Wire CTA**

Primary CTA `Back to projects` routes to `/browse`.

### Task 2: Verify Flow

**Files:**
- No source changes expected.

- [ ] **Step 1: Build**

Run `npm run build`. Expected: Vite production build succeeds.

- [ ] **Step 2: Browser flow**

Run local preview and verify at 393x852:
- Landing `Continue as donor` routes to `/browse`.
- NaviSight card routes to `/projects/navisight`.
- `Fund this idea` routes to `/donate/success?project=navisight&amount=30`.
- Success page shows `Donation complete`, `$30 → ~1.5M GPT-4o tokens for Alex`, `$30 / $50`, and `Back to projects`.
- `Back to projects` returns to `/browse`.

- [ ] **Step 3: Push**

Commit and push to the existing donor-flow PR branch.

