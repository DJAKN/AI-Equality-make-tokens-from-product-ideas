# Product Requirements Document
## FuelUp — Token Donation Platform for Developers

---

## 1. Problem Statement

AI-powered product flow/development access is unevenly distributed. Independent developers and idea owners with genuine potential may not afford sparing enough budget for subscription plans or API credits, while enterprises and individuals on paid plans frequently leave a significant portion of their monthly budget unused.

There is currently no platform that bridges this gap by enabling willing donors to fund AI API access directly for developers in need — not as a cash grant, but as usable compute capacity delivered through a managed API layer.

---

## 2. Product Vision

**FuelUp** is a web platform that connects donors (individuals, enterprises, or organizations) with idea owners (developers in need of AI compute) through a transparent, community-driven donation flow. Donors contribute money; the platform converts those contributions into API access and distributes it to verified idea owners via platform-managed API keys.

> "Turn idle AI budgets into new idea's breakthrough."

---

## 3. Target Users

### Idea Owners (Receivers)
- Independent developers or small teams with a concrete product idea
- Cannot afford AI API subscriptions or credit top-ups
- Have a clear use case for AI compute or development (e.g., calling GPT-4o, Claude, etc.)

### Donors (Givers)
- Individuals who want to support interested emerging projects
- Enterprises or teams whose monthly AI budget consistently goes partially unused
- Organizations aligned with tech-for-good or FuelUp missions

---

## 4. Core Use Case (Happy Path)

### Actors
- **Alex**: Independent developer with a promising idea, no API budget
- **Sarah**: Individual donor willing to support new projects

### Flow

**Step 1 — Alex posts a project**
Alex registers on the platform and submits a project:
- Project name: *NaviSight — AI Navigation for the Visually Impaired*
- Description: Real-time image recognition + voice guidance to help blind users navigate independently
- Credits requested: $50 worth of API credits
- Intended usage: GPT-4o Vision API calls for image recognition

The project appears on the public listing with status: **"Fundraising — $0 / $50"**

**Step 2 — Sarah discovers and donates**
Sarah browses the project list, selects NaviSight, and chooses to donate $30. The platform shows:
> "Your $30 will give Alex approximately 1.5 million tokens of AI compute in GPT-4o."

Sarah confirms and completes payment. The project status updates to: **"Fundraising — $30 / $50"**

**Step 3 — Credits are delivered, Alex starts building**
Alex receives an in-app notification confirming the donation. In his developer dashboard, he sees:
- A platform-issued API key
- Available balance: $30

Alex copies the key into his development environment and makes a live API call — which succeeds immediately.

---

## 5. Technical Architecture

### How Token Delivery Works

The platform does **not** transfer credits between user accounts on AI providers (which is technically impossible — credits are non-transferable on platforms like OpenAI). Instead, the platform operates a **proxy pool model**:

1. The platform maintains its own OpenAI Organization account, funded by donor contributions
2. When an idea owner is approved, the platform programmatically creates a dedicated Project + API Key within its Organization via the OpenAI Admin API
3. A spending limit is set per key, corresponding to the idea owner's allocated credits
4. When new donations arrive, the platform increases the spending limit on the corresponding key
5. The idea owner uses the platform-issued API key directly in their code — no personal OpenAI account required

This model is fully implementable using OpenAI's Admin API (create project, issue key, set/update spending limits, query usage).

### Tech Stack (MVP)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Vite | Lightweight, fast setup |
| UI | Tailwind CSS + shadcn/ui | High quality design with low effort |
| Backend API | Node.js + Express | Familiar, easy to deploy |
| Database + Auth | Supabase | PostgreSQL + built-in auth, generous free tier |
| Payment | Mocked flow (button → success state) | Sufficient for the demo |
| API Key delivery | Platform OpenAI Org key (real call in demo) | Makes the demo moment real and convincing |
| Deployment | Vercel (frontend + backend) | Zero-config, instant URL for reviewers to access via QR code |

### Core Pages

1. **Home / Project Listing** — Browse idea owner projects (mock data seeded), donor entry point
2. **Project Detail Page** — Project description, fundraising progress bar, donate button
3. **Donation Confirmation Page** — Amount selection → confirm → success animation
4. **Developer Dashboard** — Incoming donations, platform-issued API key, available balance, live test call button

---

## 6. Key Differentiators vs. Existing Solutions

| Existing Solution | Overlap | Gap FuelUp Fills |
|---|---|---|
| Gitcoin Grants | Community funds developers via crypto | Funds cash/tokens, not AI compute; no API proxy layer |
| OpenAI Codex Open Source Fund | Directly grants API credits to developers | Platform-controlled, unidirectional; no community donation mechanism |
| TechSoup | Discounted software for nonprofits | Institutional focus, not individual developers; no AI API specialization |
| GetAIPerks / AIFreePlan | Aggregates free credit info | Information only; no donation or distribution mechanism |

**The gap:** No existing platform enables community members to fund AI compute access for developers and deliver it as usable API capacity through a managed proxy layer.

---

## 7. MVP Scope (Hackathon)

### In Scope
- Initial landing page: selection between donors/idea owners.
- (donors) Project listing page with seeded mock data
- (donors) Project detail + donation flow (payment mocked)
- (idea owners) Developer dashboard with platform-issued API key display
- (idea owners) One live API call demo triggered from the dashboard
- Mobile-responsive web UI accessible via QR code

### Out of Scope (Post-Hackathon)
- Real payment integration (Stripe, crypto)
- Multi-provider support (Anthropic, Gemini, etc.)
- Real OpenAI Admin API integration for key provisioning
- KYC / project verification workflow
- Donor history and tax receipts
- Idea owner progress updates / accountability features

---

## 8. Demo Script (1.5 minutes)

| Time | Content |
|------|---------|
| 0:00–0:15 | Pain point: developers with great ideas blocked by AI API costs; enterprises with unused budgets |
| 0:15–0:35 | Solution: FuelUp bridges the gap — donor funds become developer API capacity |
| 0:35–1:15 | Live demo: Alex posts NaviSight → Sarah donates $30 → Alex's dashboard shows new key + live API call succeeds |
| 1:15–1:30 | Vision: a more equitable AI ecosystem where great ideas aren't gated by compute budgets |

---

## 9. Open Questions

- Should donor contributions be anonymous or publicly attributed?
- How to verify that idea owners are using credits for their stated project?
