# OpportunityKit — SETU 2026 Prototype Submission

## Project

- **Name:** OpportunityKit
- **Problem:** Opportunity requirements are scattered across posters, PDFs, emails and chat groups, in inconsistent formats. Students struggle to determine whether they meet the criteria, and missing skills, documents or unconfirmed information create uncertainty.
- **Solution:** OpportunityKit structures requirements into a consistent format, compares them with a student profile using explicit rules, explains every result as **MATCH**, **MISMATCH** or **MISSING INFORMATION**, and turns gaps and unknowns into an actionable preparation checklist.
- **Distinguishing principle:** *Missing information is not the same as ineligibility.*

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # automated tests (extractor, rules engine, checklist, demo sequence)
npm run build      # production build
npm start          # serve the production build
```

## Demo walkthrough (the 11-step judge sequence)

1. Open the landing page → prominent **Start Interactive Demo** button.
2. Click it → the demo launches with **no registration**.
3. The fictional student profile (Aarav Sharma) loads automatically.
4. A clearly labeled **sample internship** is pre-loaded; more samples and a manual-add form are available.
5. Click **Extract & review requirements** → the parser structures the description into validated requirements.
6. Click **Run eligibility analysis** → the rules engine evaluates every requirement.
7. Results show **MATCH**, **MISMATCH** and **MISSING INFORMATION** with explanations.
8. Click any requirement's **Why this status?** → a modal shows the rule applied, the profile value considered, the source line, and the status definition.
9. Click **Generate preparation checklist** → every non-MATCH becomes an actionable item.
10. Mark a checklist item complete → progress bar updates and is saved to localStorage.
11. Edit the profile (e.g. raise CGPA to 8.0, set availability, upload transcript) → **Save profile & re-run analysis** → results change and the diff is highlighted.

A **Reset demo** button restores all defaults at any time.

## Architecture

```
Student Profile + Opportunity Description
        → Requirement Extraction (validated parsing; optional LLM planned)
        → Validated Structured Requirements (zod schemas)
        → Eligibility Rules Engine (explicit, testable rules)
        → Explained Results (MATCH / MISMATCH / MISSING INFORMATION)
        → Preparation Checklist (improve / confirm items)
```

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Requirement extraction:** deterministic rule-based parser with zod validation; optional server-side LLM integration is **planned, not configured** (`/api/extract` runs the same parser and reports `llmConfigured: false`).
- **Eligibility engine:** explicit rules `RULE-DEGREE-01` … `RULE-OTHER-01`, each documented and unit-tested.
- **Persistence:** localStorage for the demo; Supabase PostgreSQL is an **optional, not configured** integration.
- **Validation:** zod typed schemas, form validation, automated vitest tests.
- **Deployment:** pending — see "Deploying" below.

## Project structure

```
app/                  Next.js App Router pages + API route
  page.tsx            Landing page (problem, solution, principle, tech, business model)
  demo/page.tsx       Interactive demo
  api/extract/route.ts  Server-side extraction endpoint (deterministic parser)
components/           Navbar, Footer, StatusBadge, ArchitectureDiagram, PrincipleDemo
components/demo/      Demo workspace, panels, requirement modal
lib/                  types, zod schemas, extractor, eligibility engine, checklist, store, demo data
lib/*.test.ts         Automated tests
scripts/make_pdf.py   Generates the submission PDF
docs/                 Demo video script and recording checklist
```

## Deploying (permanent live URL)

The prototype is a standard Next.js app — deploy to any static-compatible host:

```bash
# Vercel (recommended, free tier)
npm i -g vercel
vercel            # follow prompts, then "vercel --prod"

# or Netlify
npm run build     # then drag the /out directory (after next export) or connect the repo
```

After deploying, paste the public HTTPS URL into the PDF generator:

```bash
python3 scripts/make_pdf.py \
  --team "TEAM NAME" --member "MEMBER NAME" \
  --live-url "https://your-app.vercel.app" \
  --github-url "https://github.com/you/opportunitykit" \
  --video-url "https://youtu.be/..." \
  --out submission/OpportunityKit-SETU2026-Submission.pdf
```

## Publishing the source code

```bash
cd opportunitykit
git init            # already done in this workspace
git add .
git commit -m "OpportunityKit SETU 2026 prototype"
# create a new GitHub repo, then:
git remote add origin https://github.com/YOU/opportunitykit.git
git push -u origin main
```

## Recording the demonstration video

See `docs/DEMO_VIDEO_SCRIPT.md` for the full timed script, recording checklist and publishing instructions. Record the 11-step demo walkthrough, upload as **unlisted** (YouTube) or with **link sharing** (Drive), then pass the URL to `make_pdf.py` above.

## Limitations (honest scope)

- Demo mode: all data is fictional; persistence is localStorage only (clears if the browser clears site data).
- The eligibility engine covers the requirement types in `lib/types.ts`; anything else is surfaced as MISSING INFORMATION for manual review rather than silently passed or failed.
- No LLM, database or paid API is configured or operational. Everything advertised as "optional" is labeled as such in the app.
- No survey results, user statistics, performance metrics or validation evidence are claimed anywhere.
