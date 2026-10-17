#!/usr/bin/env python3
"""Generate the OpportunityKit SETU 2026 submission PDF.

Usage:
  python3 scripts/make_pdf.py \
      --team "TEAM NAME" --member "MEMBER NAME" \
      --live-url "https://..." \
      --github-url "https://github.com/..." \
      --video-url "https://..." \
      --out submission/OpportunityKit-SETU2026-Submission.pdf

Any link argument that is omitted is printed as PENDING with the exact
action required to complete it. The PDF never implies a pending
deliverable is ready.
"""
import argparse
import datetime
import os
import tempfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (BaseDocTemplate, Frame, Image, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

BRAND = colors.HexColor('#4f46e5')
BRAND_LIGHT = colors.HexColor('#eef2ff')
GREY = colors.HexColor('#475569')
AMBER_BG = colors.HexColor('#fef3c7')
AMBER_BORDER = colors.HexColor('#f59e0b')
GREEN_BG = colors.HexColor('#d1fae5')
GREEN_BORDER = colors.HexColor('#10b981')
BORDER = colors.HexColor('#e2e8f0')

TITLE = 'OpportunityKit — SETU 2026 Prototype Submission'

PENDING_ACTIONS = {
    'live': ('PENDING', 'Deploy the prototype (README.md → "Deploying"), then re-run this script with --live-url.'),
    'github': ('PENDING', 'Push this repository to GitHub (README.md → "Publishing the source code"), then re-run with --github-url.'),
    'video': ('PENDING', 'Record and publish the demo video per docs/DEMO_VIDEO_SCRIPT.md, then re-run with --video-url.'),
}


def build_styles():
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle('TitleBig', parent=ss['Title'], fontSize=22, leading=27, textColor=colors.HexColor('#1e1b4b'), spaceAfter=4))
    ss.add(ParagraphStyle('Subtitle', parent=ss['Normal'], fontSize=11, leading=15, textColor=GREY))
    ss.add(ParagraphStyle('H1', parent=ss['Heading1'], fontSize=14, leading=18, textColor=BRAND, spaceBefore=14, spaceAfter=6))
    ss.add(ParagraphStyle('H2', parent=ss['Heading2'], fontSize=11.5, leading=15, textColor=colors.HexColor('#1e293b'), spaceBefore=8, spaceAfter=3))
    ss.add(ParagraphStyle('Body', parent=ss['Normal'], fontSize=9.5, leading=13.5, textColor=colors.HexColor('#1e293b')))
    ss.add(ParagraphStyle('Small', parent=ss['Normal'], fontSize=8, leading=11, textColor=GREY))
    ss.add(ParagraphStyle('BulletItem', parent=ss['Normal'], fontSize=9.5, leading=13.5, leftIndent=10, bulletIndent=2, textColor=colors.HexColor('#1e293b')))
    ss.add(ParagraphStyle('Mono', parent=ss['Normal'], fontName='Courier', fontSize=8.5, leading=12, textColor=colors.HexColor('#334155')))
    ss.add(ParagraphStyle('LinkText', parent=ss['Normal'], fontSize=9, leading=12, textColor=BRAND))
    return ss


def link_paragraph(url, styles):
    return Paragraph(f'<a href="{url}" color="#4f46e5"><u>{url}</u></a>', styles['LinkText'])


def status_chip(status, styles):
    if status == 'LIVE':
        t = Table([[Paragraph('<b>LIVE</b>', styles['Small'])]], colWidths=[16 * mm], rowHeights=[6 * mm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), GREEN_BG),
            ('BOX', (0, 0), (-1, -1), 0.75, GREEN_BORDER),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#065f46')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
    else:
        t = Table([[Paragraph('<b>PENDING</b>', styles['Small'])]], colWidths=[16 * mm], rowHeights=[6 * mm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), AMBER_BG),
            ('BOX', (0, 0), (-1, -1), 0.75, AMBER_BORDER),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#92400e')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
    return t


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--team', default='')
    ap.add_argument('--member', default='')
    ap.add_argument('--live-url', default='')
    ap.add_argument('--github-url', default='')
    ap.add_argument('--video-url', default='')
    ap.add_argument('--out', default='submission/OpportunityKit-SETU2026-Submission.pdf')
    args = ap.parse_args()

    styles = build_styles()
    today = datetime.date.today().strftime('%d %B %Y')

    story = []
    story.append(Paragraph(TITLE, styles['TitleBig']))
    story.append(Paragraph('SETU 2026 prototype submission · generated ' + today, styles['Subtitle']))
    story.append(Spacer(1, 6))

    # meta table
    meta = [
        ['Project name', 'OpportunityKit'],
        ['Problem statement', 'Opportunity requirements are scattered across different sources and formats; students struggle to determine whether they meet the criteria, and missing skills, documents or unconfirmed information create uncertainty.'],
        ['Team name', args.team or '[TO BE FILLED IN — see SUBMISSION-STATUS.md]'],
        ['Team member(s)', args.member or '[TO BE FILLED IN — see SUBMISSION-STATUS.md]'],
        ['Prototype status', 'Working MVP demo. No paid API, external account or configuration required.'],
    ]
    t = Table(meta, colWidths=[38 * mm, 132 * mm])
    t.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('BACKGROUND', (0, 0), (0, -1), BRAND_LIGHT),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t)

    # 1. problem & solution
    story.append(Paragraph('1. Problem and proposed solution', styles['H1']))
    story.append(Paragraph(
        'Opportunity requirements are scattered across posters, PDFs, emails and chat groups, each in a different '
        'format. Students struggle to determine whether they meet the criteria, and missing skills, documents or '
        'unconfirmed information create uncertainty — which feels like rejection.', styles['Body']))
    story.append(Paragraph(
        'OpportunityKit structures requirements into a consistent format, compares them with the student profile, '
        'explains every result as MATCH, MISMATCH or MISSING INFORMATION, and turns gaps and unknowns into an '
        'actionable preparation checklist. The distinguishing principle — <b>"missing information is not the same '
        'as ineligibility"</b> — is demonstrated through a live interaction in the app, not just a tagline.', styles['Body']))

    # 2. demonstrated features
    story.append(Paragraph('2. Demonstrated features', styles['H1']))
    feats = [
        'One-click interactive demo with no registration and a clearly labeled sample opportunity',
        'Requirement extraction from opportunity descriptions (validated parsing; manual add supported)',
        'Three-state eligibility analysis: MATCH, MISMATCH, MISSING INFORMATION — each with an explanation',
        'Per-requirement "Why this status?" detail view (rule applied, profile value considered, source line)',
        'Preparation checklist generated from gaps and unknowns, with saved progress',
        'Profile editing with automatic re-analysis and change highlighting',
        'Demo reset, empty/loading/error states, responsive layout',
        'Automated tests covering extraction, the rules engine, the checklist and the full demo sequence (npm test)',
    ]
    for f in feats:
        story.append(Paragraph('• ' + f, styles['BulletItem']))

    # 3. technology
    story.append(Paragraph('3. Technology stack and technical approach', styles['H1']))
    tech = [
        'Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS — implemented.',
        'Requirement extraction: validated rule-based parsing with zod schemas; optional server-side LLM integration is PLANNED, not configured (/api/extract reports llmConfigured: false).',
        'Eligibility engine: explicit, documented, unit-tested rules (RULE-DEGREE-01 … RULE-OTHER-01).',
        'Persistence: localStorage for the demo; Supabase PostgreSQL is an optional integration, not configured.',
        'Validation: typed zod schemas, form validation, automated vitest tests.',
        'Deployment: see the Live Prototype link status below.',
    ]
    for f in tech:
        story.append(Paragraph('• ' + f, styles['BulletItem']))
    story.append(Paragraph(
        'Pipeline: Student Profile + Opportunity Description → Requirement Extraction → Validated Structured '
        'Requirements → Eligibility Rules Engine → Explained Results → Preparation Checklist.', styles['Body']))

    # 4. demo overview
    story.append(Paragraph('4. Demonstration overview', styles['H1']))
    story.append(Paragraph(
        'Landing page → Start Interactive Demo → fictional profile loads → open the labeled sample internship → '
        'extract requirements → run the analysis → see MATCH / MISMATCH / MISSING INFORMATION with explanations → '
        'open a requirement to see why → generate the checklist → mark an item complete (progress saved) → edit the '
        'profile (e.g. CGPA 7.2 → 8.0) and re-run to watch results change. Full timed script: '
        'docs/DEMO_VIDEO_SCRIPT.md.', styles['Body']))

    # 5. links
    story.append(Paragraph('5. Submission links', styles['H1']))

    def link_row(label, url, key, note_extra=''):
        if url:
            status, action = 'LIVE', 'Verified working link.'
            url_par = link_paragraph(url, styles)
        else:
            status, action = PENDING_ACTIONS[key]
            url_par = Paragraph('(not available yet)', styles['Small'])
        chip = status_chip(status, styles)
        note = Paragraph(
            (f'<b>{status}.</b> {action} {note_extra} {action if status == "PENDING" else ""}').strip(),
            styles['Small'])
        row = Table([[chip, [Paragraph(f'<b>{label}</b>', styles['Body']), Spacer(1, 2), url_par, Spacer(1, 2), note]]],
                    colWidths=[20 * mm, 150 * mm])
        row.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ]))
        return row

    story.append(link_row('Live Prototype', args.live_url, 'live',
                          'Deploy target: Vercel or Netlify (free tier).'))
    story.append(Spacer(1, 6))
    story.append(link_row('GitHub Source Code', args.github_url, 'github',
                          'The complete source is in this repository (README.md has push instructions).'))
    story.append(Spacer(1, 6))
    story.append(link_row('Demonstration Video', args.video_url, 'video',
                          'Script and recording checklist: docs/DEMO_VIDEO_SCRIPT.md.'))
    story.append(Spacer(1, 8))

    if args.live_url:
        try:
            import qrcode
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                img = qrcode.make(args.live_url)
                img.save(tmp.name)
                story.append(Paragraph('QR code for the live prototype:', styles['Small']))
                story.append(Spacer(1, 2))
                story.append(Image(tmp.name, width=28 * mm, height=28 * mm))
                story.append(Spacer(1, 4))
        except ImportError:
            story.append(Paragraph(
                '(QR code omitted — install the Python "qrcode" package and regenerate to include it.)', styles['Small']))
    else:
        story.append(Paragraph(
            'QR code for the live prototype will be included once the permanent URL exists.', styles['Small']))

    # 6. limitations
    story.append(Paragraph('6. Prototype limitations and demo-mode functionality', styles['H1']))
    lims = [
        'Demo mode: all student, company and opportunity data is fictional. Persistence is localStorage only (demo storage); Supabase PostgreSQL is an optional integration that is not configured.',
        'The eligibility engine covers the requirement types in lib/types.ts; anything else is surfaced as MISSING INFORMATION for manual review — never silently passed or failed.',
        'No LLM, database or paid API is configured or operational. Everything advertised as "optional" is labeled as such in the app.',
        'No survey results, user statistics, performance metrics or validation evidence are claimed.',
    ]
    for l in lims:
        story.append(Paragraph('• ' + l, styles['BulletItem']))

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        'Regenerate this PDF after any URL changes: python3 scripts/make_pdf.py --team "..." --member "..." '
        '--live-url ... --github-url ... --video-url ... --out submission/OpportunityKit-SETU2026-Submission.pdf',
        styles['Small']))

    # build
    os.makedirs(os.path.dirname(args.out), exist_ok=True)

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 7.5)
        canvas.setFillColor(GREY)
        canvas.drawString(15 * mm, 10 * mm, TITLE)
        canvas.drawRightString(195 * mm, 10 * mm, f'Page {doc.page}')
        canvas.restoreState()

    doc = BaseDocTemplate(args.out, pagesize=A4,
                          leftMargin=15 * mm, rightMargin=15 * mm,
                          topMargin=15 * mm, bottomMargin=18 * mm,
                          title=TITLE, author='OpportunityKit team')
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='main')
    doc.addPageTemplates([PageTemplate(id='page', frames=[frame], onPage=footer)])
    doc.build(story)
    print(f'PDF written to {args.out}')


if __name__ == '__main__':
    main()
