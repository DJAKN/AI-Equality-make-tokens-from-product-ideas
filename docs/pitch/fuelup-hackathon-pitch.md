# FuelUp Hackathon Pitch

## Strongest Failure Mode

Judges may see FuelUp as a generic charity crowdfunding app with AI branding. If the demo stops at "Sarah donates $30" and lands on a placeholder receipt, it will under-score on the two largest event-specific criteria: creative use of OpenAI/Codex and demo quality.

The pitch must prove a sharper claim: a donation becomes usable, capped OpenAI compute for a builder immediately. If we cannot show that transformation, we should not spend much time on market size, social mission, or future platform features.

The extra risk is that OpenAI becomes only the thing being paid for, not a tool used creatively. Add at least one visible OpenAI/Codex use inside FuelUp itself, such as AI project matching, an AI-generated "what your donation unlocked" receipt, or a Codex-generated capped client snippet.

## Positioning

FuelUp is a donation rail for AI compute. Donors fund an idea, and the builder receives capped OpenAI API access through a FuelUp-managed proxy they can use right away.

Short tagline:

> Turn donations into working AI compute.

Expanded one-liner:

> FuelUp lets anyone sponsor a builder's OpenAI usage, converting a donation into capped FuelUp API access and live model calls for a specific project.

## Winning Narrative

Start with a concrete builder, not "AI equality" in the abstract.

Alex is building NaviSight, a GPT-4o Vision navigation tool for visually impaired users. His blocker is not motivation, a mentor, or a landing page. His blocker is metered AI usage. He needs $50 of model calls to test the idea.

Sarah wants to help, but giving cash is vague. FuelUp makes the donation concrete: $30 becomes about 1.5M GPT-4o tokens, assigned to a capability Alex can use, behind capped FuelUp proxy access. Alex clicks run, the model responds inside his project dashboard, and the remaining balance visibly decreases.

The memorable line:

> This is not a crowdfunding receipt. It is a working AI call.

## Demo Priority

If time is short, build only one complete path. The developer dashboard comes before donor polish.

1. Donor opens NaviSight.
2. Donor chooses $30.
3. Success screen says the donation funded about 1.5M GPT-4o tokens.
4. Switch to Alex's dashboard.
5. Alex sees balance increase from $0 to $30 and a masked FuelUp proxy key.
6. Alex clicks "Run test call".
7. A real OpenAI response appears.
8. The balance drops visibly, for example $30.00 to $29.94.

The "aha" is the handoff from money to compute. A polished donation card without the developer-side compute moment is not enough.

Best staging: show Sarah's donor view on one phone and Alex's dashboard on another screen. The state change across two users is more memorable than one polished mobile flow.

## 90-Second Pitch

0:00 to 0:10, hook:

> Every AI builder now has a meter running. A laptop is not enough anymore. Great ideas can die because the first prototype costs API credits.

0:10 to 0:25, user and problem:

> Meet Alex. He is building NaviSight, an AI navigation assistant for blind pedestrians. He only needs $50 of GPT-4o Vision calls to test it. Today, the people willing to help him can donate money, but they cannot easily donate usable AI compute with limits and accountability.

0:25 to 0:35, solution:

> FuelUp turns a donation into platform-managed OpenAI capacity. Donors fund a project. Builders receive capped FuelUp proxy access and can start calling the API immediately.

0:35 to 1:10, live demo:

> Sarah funds NaviSight with $30. FuelUp converts that into about 1.5M GPT-4o tokens. Now we switch to Alex. His balance updated, his FuelUp proxy key is ready, and when he clicks run, he gets a real model response for his project. Watch the balance drop after the call.

1:10 to 1:25, OpenAI/Codex angle:

> OpenAI is not just pasted onto the app. It is the asset being distributed, metered, and made accountable. Codex helped us build the narrow donor-to-builder path fast, and GPT helps translate each donation into a clear impact receipt.

1:25 to 1:30, close:

> Our goal is simple: make AI compute fundable, accountable, and immediately useful for builders who would otherwise be priced out.

## 3-Minute Pitch

0:00 to 0:20, hook:

> The cost of building AI products has shifted. Before, a builder needed a laptop and time. Now every experiment has a meter attached. For under-resourced builders, that meter can stop the project before the first user test.

0:20 to 0:45, specific user:

> Alex wants to build NaviSight, a navigation assistant for visually impaired users using GPT-4o Vision. This is exactly the kind of idea communities want to support. But the useful unit is not a like, a grant application, or vague cash. It is API capacity.

0:45 to 1:05, solution:

> FuelUp connects donors and builders through compute, not cash. A donor chooses a project and amount. FuelUp converts the donation into a token estimate, assigns it to that project, and exposes capped FuelUp proxy access to the builder.

1:05 to 2:05, demo:

> Here is Sarah's donor view. She opens NaviSight, sees the use case, and funds $30. The app shows what that means in model usage. Now we switch to Alex's builder dashboard. His balance updates, he gets masked FuelUp proxy access, and he can run a test call immediately. The response comes back, and the balance decreases. The important part is that the donation became a bounded OpenAI capability, not a receipt.

2:05 to 2:30, creative OpenAI/Codex use:

> The OpenAI layer is central. FuelUp is a budget and access layer around OpenAI usage: model calls, token estimates, capped proxy access, and usage accountability. Codex was part of the build loop: we kept the scope to one tested path, used it to wire the React flow, and focused the demo on the moment judges can verify.

2:30 to 2:50, why now and future:

> Why now? API credits are becoming the new cloud grant. Hackathons, universities, open-source communities, and accelerators all need a way to sponsor AI work without handing out unrestricted credentials or vague cash.

2:50 to 3:00, close:

> FuelUp makes AI compute fundable. The prototype proves the smallest version: one donor, one builder, one capped path from dollars to a working OpenAI call.

## Slide Order

Use slides only as labels around the demo. The demo should be the center.

1. FuelUp: turn donations into working AI compute.
2. Alex's blocker: NaviSight needs $50 of GPT-4o Vision testing.
3. The missing rail: donors can give cash, but builders need capped API capacity.
4. Live demo: Sarah funds, Alex runs, balance decrements.
5. OpenAI/Codex: OpenAI usage is the funded asset, Codex compressed the build loop, GPT explains impact.
6. Future: AI credit rails for hackathons, schools, open source, nonprofits, and accelerators.

## What To Avoid

- Do not say "we transfer unused OpenAI credits" unless that is actually implemented and permitted. Say donors fund platform-managed capacity.
- Do not say Alex receives a raw OpenAI key with magical spend limits. Say Alex receives FuelUp-managed proxy access, capped by FuelUp.
- Do not pitch this as blockchain tokens. "Tokens" should mean model usage, not crypto.
- Do not spend the opening on generic AI inequality. Use Alex and NaviSight first.
- Do not imply real payments, KYC, fraud checks, or production key provisioning are complete if they are mocked.
- Do not claim there are no alternatives. Compare honestly: grants give cash, free-credit lists give information, and FuelUp gives bounded usable compute.
- Do not over-explain the platform architecture before the demo. Judges can understand capped access after they see it work.

## Objections And Answers

Why not just donate cash?

> Cash is vague. FuelUp makes the donation accountable: it is attached to a project, translated into model usage, capped, and visible to both sides.

Why would donors trust builders?

> The MVP proves the compute rail. The next layer is verification, usage logs, milestone unlocks, and public project updates. The key point is that spend limits and model usage give more control than a raw cash donation.

Is this technically feasible if credits are not transferable?

> FuelUp does not transfer credits between provider accounts. It uses platform-managed capacity and exposes bounded proxy access to approved builders. In the hackathon demo, we can simulate provisioning while showing a real model call and visible balance decrement.

Who is the first real customer?

> Start with communities that already allocate AI resources: hackathons, universities, open-source programs, nonprofits, and accelerators. They need controlled distribution more than a consumer donation marketplace needs social features.

What should judges remember?

> A $30 donation became Alex's working OpenAI call.

## Judging Map

Problem significance, 30%:

FuelUp makes metered AI access a concrete blocker for one builder and one socially meaningful project.

Creative use of OpenAI/Codex, 30%:

OpenAI usage is not a side feature. It is the resource FuelUp packages, caps, and distributes. Codex should be framed as the build system that made a narrow verified path possible in the allotted time.

Add one extra visible OpenAI use inside the product if time permits: donor interest matching, project moderation, impact receipt generation, or a Codex-generated client snippet.

Demo quality, 30%:

The demo should show state change across two users and end in a model response. This is more memorable than a polished static marketplace.

Future potential, 10%:

The credible expansion is controlled AI budget allocation for communities, schools, open-source funds, and accelerators.

## Sources Reviewed

- Luma event page: https://luma.com/oiaa9x0o?tk=vrGwkR
- YC, How to Pitch Your Company: https://www.ycombinator.com/library/4b-how-to-pitch-your-company
- Sequoia, Writing a Business Plan: https://www.sequoiacap.com/article/writing-a-business-plan/
- First Round Review, storytelling guidance: https://review.firstround.com/good-leaders-are-great-storytellers-our-6-tips-for-telling-stories-that-resonate/
