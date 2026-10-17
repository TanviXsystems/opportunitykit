# OpportunityKit — Demonstration Video Script & Recording Checklist

**Status: PENDING** — no video has been recorded or hosted yet. This document is the complete script and the exact recording/publishing procedure. The video link stays PENDING until the file exists at a public, judge-accessible URL.

## Target

- Length: 2:30–3:30 minutes
- Resolution: 1080p minimum, 16:9
- Audio: clear voiceover (built-in mic is fine; record in a quiet room)
- Tools: any screen recorder (OBS Studio, QuickTime, Windows Game Bar, Loom, or your phone pointed at the screen)

## Timed script

| Time | Scene | Narration |
|---|---|---|
| 0:00–0:20 | Landing page (hero) | "OpportunityKit turns scattered opportunity requirements into explained eligibility results. The problem: requirements live in posters, PDFs and chat groups, in different formats, and students can't tell whether they qualify — especially when information is missing." |
| 0:20–0:40 | How It Works + principle widget | "The solution structures requirements, compares them with the student profile, explains every result with three states, and turns gaps into a checklist. The key idea: missing information is not the same as ineligibility. Watch it live." |
| 0:40–1:00 | Principle widget interaction | Toggle "Not provided" → MISSING INFORMATION; "6 months" → MATCH. "The same requirement flips from unknown to match the moment the student confirms it — never an automatic rejection." |
| 1:00–1:15 | Demo page opens | "One click — Start Interactive Demo — no registration. The fictional student profile loads instantly." |
| 1:15–1:45 | Sample opportunity + extraction | Open the labeled sample internship, click Extract. "Ten structured requirements, schema-validated, from one pasted description." |
| 1:45–2:15 | Analysis + three statuses | Run analysis. Point out MATCH (degree, Python, React), MISMATCH (CGPA 7.2 vs 7.5; ROS not in skills), MISSING INFORMATION (availability, relocation, transcript). "Each result has an explanation — click Why this status? to see the exact rule, the profile value considered, and the source line." |
| 2:15–2:30 | Checklist | Generate checklist. "Every mismatch becomes an improve item; every unknown becomes a confirm item. Mark one complete — progress is saved." |
| 2:30–2:50 | Profile update + re-run | Edit CGPA to 8.0, set availability to 6 months, willing to relocate, upload transcript. Save. "Watch the results change — mismatches become matches, unknowns resolve, the checklist shrinks." |
| 2:50–3:10 | Technology & Approach | "Next.js, React, TypeScript, Tailwind. Validated rule-based extraction, an explicit testable rules engine, localStorage demo persistence, zod validation and automated tests. LLM extraction and Supabase are planned optional integrations — not configured, and labeled as such." |
| 3:10–3:20 | Business model | "Free student tier for adoption; premium student tools and college licensing for sustainability. Pricing is illustrative only." |
| 3:20–3:30 | Close | "OpportunityKit: missing information is not ineligibility. Try the demo — link in the description." |

## Recording checklist

- [ ] Browser at 1280×720 or larger; bookmarks bar hidden; no personal data visible
- [ ] Demo reset clicked before recording so the judge sees a clean run
- [ ] Voiceover recorded clearly; no background noise
- [ ] Cursor visible and deliberate; no rushed clicks
- [ ] Show the "Why this status?" modal at least once
- [ ] Show the checklist progress saving (reload the page to prove persistence — optional)
- [ ] Mention that all data is fictional and runs locally in the browser
- [ ] End slate: project name, team name, "prototype" label

## Publishing

1. Export as MP4 (H.264).
2. Upload to **YouTube as Unlisted** (or Google Drive with "anyone with the link can view", or Vimeo).
3. Verify the link opens in an incognito window **without** a sign-in request.
4. Paste the URL into `scripts/make_pdf.py --video-url ...` and regenerate the PDF.
5. Only then mark the video link LIVE in the PDF and SUBMISSION-STATUS.md.
