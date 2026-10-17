# OpportunityKit — SETU 2026 Submission Status

Live tracker for submission section 15.G. Update as items are completed.

## Requirements checklist

- [x] **Live prototype demonstrates the core workflow** — implemented and verified by automated tests (`npm test`, including the 11-step judge sequence) and manual walkthrough. *Pending: permanent public HTTPS URL (see below).*
- [x] **Problem and solution clearly explained** — landing page sections "The problem", "The solution", "The distinguishing principle" (interactive).
- [x] **Technology and approach documented accurately** — "Technology & Approach" section with architecture diagram; implemented vs optional vs future clearly separated.
- [x] **Three eligibility statuses behave correctly** — unit-tested rules engine; MATCH / MISMATCH / MISSING INFORMATION with explanations.
- [x] **Business model and evaluation-relevant features explained** — Business Model section (free / premium / institutional, illustrative pricing, no unsupported claims); "For judges" mapping table.
- [ ] **Source code published to GitHub** — PENDING. Action: `git init` is done; create a GitHub repo and `git push -u origin main` (README has exact commands), then paste the URL into the PDF.
- [ ] **Demonstration video accessible to judges** — PENDING. Action: record per `docs/DEMO_VIDEO_SCRIPT.md`, publish unlisted (YouTube) or link-shared (Drive), verify it opens without a sign-in request, then add the URL.
- [ ] **Three URLs verified and clickable** — PENDING (all three links pending; PDF marks each clearly).
- [ ] **One PDF contains all three links** — DONE as a draft with all three links clearly marked PENDING; regenerate with `python3 scripts/make_pdf.py --team ... --member ... --live-url ... --github-url ... --video-url ...` once URLs exist.
- [x] **No placeholder URLs or unsupported claims remain** — no URLs are invented anywhere; pending items are labeled with the exact action required.

## Exact actions to finish each pending item

1. **Live prototype URL** — deploy: `npm run build && vercel --prod` (or Netlify). Verify the URL opens, shows the landing page, and the demo runs. Then: `python3 scripts/make_pdf.py --live-url "https://..." ...` and regenerate the PDF.
2. **GitHub source URL** — create a public repo, push the `opportunitykit/` directory, verify it loads, then regenerate the PDF with `--github-url`.
3. **Demonstration video URL** — follow `docs/DEMO_VIDEO_SCRIPT.md` (script + recording checklist + publishing steps), verify incognito access without a sign-in prompt, then regenerate the PDF with `--video-url`.
4. **Team name / member name** — supply them and regenerate: `--team "Team Name" --member "Member Name"`.
