import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import { ElectionTwinProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile: ElectionTwinProfile = body.profile;

    if (!profile) {
      return NextResponse.json({ error: 'Profile data required' }, { status: 400 });
    }

    const prompt = `Based on this voter profile, generate a personalized election guide dashboard as JSON:
Profile:
- Age Group: ${profile.ageGroup}
- State: ${profile.state}
- First-time voter: ${profile.firstTimeVoter}
- Self-reported awareness level: ${profile.awarenessLevel}/5

Generate a JSON object with these exact fields:
{
  "personalizedMessage": "A warm, encouraging 2-sentence personalized welcome",
  "awarenessScore": <number 0-100 based on their profile>,
  "tips": ["5 specific, actionable tips for this voter type"],
  "checklist": [
    {"id": "1", "title": "Short title", "description": "Clear description", "completed": false, "urgent": true/false}
  ],
  "keyDates": [
    {"label": "Event name", "date": "YYYY-MM-DD", "daysRemaining": <number>}
  ]
}

Make tips and checklist specific to:
- ${profile.firstTimeVoter ? 'First-time voters (emphasize registration, ID requirements)' : 'Returning voters (emphasize staying updated, checking roll)'}
- Awareness level ${profile.awarenessLevel} (${profile.awarenessLevel <= 2 ? 'low — use simple language, basic steps' : profile.awarenessLevel <= 3 ? 'medium — include some procedural detail' : 'high — include nuanced civic information'})
- State: ${profile.state}

Return ONLY valid JSON, no markdown.`;

    const systemInstruction = 'You are an Indian election expert generating structured voter guidance. Always return valid JSON only.';

    let dashboard;
    try {
      const response = await generateContent(prompt, systemInstruction);
      // Strip markdown code blocks if present
      const clean = response.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      dashboard = JSON.parse(clean);
    } catch (e) {
      console.warn('AI generation failed, using fallback data', e);
      dashboard = JSON.parse(getFallbackDashboard(profile));
    }

    return NextResponse.json({ dashboard });
  } catch (error) {
    console.error('Twin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getFallbackDashboard(profile: ElectionTwinProfile): string {
  return JSON.stringify({
    personalizedMessage: `Welcome, ${profile.firstTimeVoter ? 'first-time voter' : 'valued voter'}! Your voice matters in shaping India's democracy. Let's make sure you're fully prepared for election day.`,
    awarenessScore: profile.awarenessLevel * 18 + 10,
    tips: [
      "Register on the National Voter Service Portal at nvsp.in",
      "Download the Voter Helpline App (1950) for instant assistance",
      "Check your name on the Electoral Roll before election day",
      "Carry your EPIC card or Aadhaar to the polling booth",
      "Vote early in the morning to avoid long queues"
    ],
    checklist: [
      { id: "1", title: "Verify Voter Roll", description: "Confirm your registration at nvsp.in or the Voter Helpline App", completed: false, urgent: true },
      { id: "2", title: "Get EPIC Card", description: "Apply for your Voter ID card if you haven't already", completed: false, urgent: false },
      { id: "3", title: "Find Your Booth", description: "Locate your assigned polling station using the ECI app", completed: false, urgent: false },
      { id: "4", title: "Research Candidates", description: "Review candidates' affidavits and track records", completed: false, urgent: false },
      { id: "5", title: "Plan Your Day", description: "Arrange transport and plan your voting time in advance", completed: false, urgent: false }
    ],
    keyDates: [
      { label: "Last Date to Register", date: "2024-10-15", daysRemaining: 45 },
      { label: "Model Code of Conduct Begins", date: "2024-10-20", daysRemaining: 50 },
      { label: "Election Day", date: "2024-11-15", daysRemaining: 76 }
    ]
  });
}
