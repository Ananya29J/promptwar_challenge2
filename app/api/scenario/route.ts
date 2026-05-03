import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario } = body;

    if (!scenario || typeof scenario !== 'string') {
      return NextResponse.json({ error: 'Scenario text required' }, { status: 400 });
    }

    if (scenario.length > 500) {
      return NextResponse.json({ error: 'Scenario too long (max 500 chars)' }, { status: 400 });
    }

    const prompt = `A voter asks: "${scenario}"

Analyze this scenario in the context of Indian elections and generate consequences as JSON:
{
  "scenario": "${scenario}",
  "immediateConsequence": "What happens immediately (1-2 sentences)",
  "shortTermImpact": "Impact in the coming weeks/months (1-2 sentences)",
  "longTermImpact": "Long-term democratic/civic impact (1-2 sentences)",
  "legalImplication": "Any legal aspects under Indian election law (1-2 sentences, or 'No direct legal implications' if none)",
  "advice": "Practical advice for this voter (2-3 sentences)",
  "severity": "low|medium|high"
}

Base severity on: low = minor personal inconvenience, medium = affects voting or registration, high = serious legal/civic consequence.
Return ONLY valid JSON, no markdown.`;

    const systemInstruction = 'You are an Indian election law and civic process expert. Provide accurate, helpful consequences for voter scenarios. Return valid JSON only.';

    let result;
    try {
      const response = await generateContent(prompt, systemInstruction);
      const clean = response.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      result = JSON.parse(clean);
    } catch (e) {
      console.warn('AI generation failed, using fallback data', e);
      result = {
        scenario,
        immediateConsequence: "This action would directly impact your ability to participate in the current election.",
        shortTermImpact: "You may face complications with your voter registration or polling booth access.",
        longTermImpact: "Sustained disengagement weakens democratic accountability and representation.",
        legalImplication: "Under the Representation of the People Act, 1951, certain violations carry penalties.",
        advice: "Contact your local Election Commission office or call the Voter Helpline (1950) for personalized guidance.",
        severity: "medium"
      };
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Scenario API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
