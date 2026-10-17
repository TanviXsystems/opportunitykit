import { NextResponse } from 'next/server';
import { extractRequirements } from '@/lib/extractor';

/**
 * Server-side extraction endpoint.
 *
 * CURRENT STATUS (honest): this endpoint runs the same validated,
 * deterministic rule-based parser used in the browser. The optional
 * server-side LLM integration is PLANNED but NOT configured — no API
 * key exists, and no LLM call is made. If an LLM key is added later,
 * this route is where the integration would be wired in.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { title?: string; description?: string };
    const title = typeof body.title === 'string' ? body.title : 'Untitled opportunity';
    const description = typeof body.description === 'string' ? body.description : '';
    if (description.length < 40) {
      return NextResponse.json(
        { error: 'Description too short (minimum 40 characters).' },
        { status: 400 }
      );
    }
    const requirements = extractRequirements(title, description);
    return NextResponse.json({
      engine: 'validated-rule-based-parser',
      llmConfigured: false,
      llmNote: 'Server-side LLM extraction is a planned optional integration and is not configured.',
      count: requirements.length,
      requirements,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Extraction failed', detail: String(e) }, { status: 400 });
  }
}
