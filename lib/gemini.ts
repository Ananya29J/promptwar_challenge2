import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI && apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateContent(prompt: string, systemInstruction?: string): Promise<string> {
  const client = getGenAI();
  if (!client) {
    // Return a meaningful fallback when no API key is set
    return getFallbackResponse(prompt);
  }

  try {
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are an expert Election Guide Assistant for Indian elections. Provide helpful, accurate, and engaging information about voting processes, electoral systems, and civic participation. Keep responses concise, informative, and encouraging.',
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(prompt);
  }
}

function getFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('twin') || lower.includes('profile')) {
    return JSON.stringify({
      personalizedMessage: "Welcome! You're taking a great step toward becoming an informed voter. Your personalized journey begins here.",
      awarenessScore: 65,
      tips: [
        "Register on the National Voter Service Portal (NVSP) at nvsp.in",
        "Download the Voter Helpline App for real-time information",
        "Check your name on the Electoral Roll before election day",
        "Carry your EPIC card or any approved photo ID to the polling booth",
        "Vote early to avoid long queues at your polling station"
      ],
      checklist: [
        { id: "1", title: "Check Voter Roll", description: "Verify your name on electoral rolls at nvsp.in", completed: false, urgent: true },
        { id: "2", title: "Get EPIC Card", description: "Apply for Voter ID if you don't have one", completed: false, urgent: false },
        { id: "3", title: "Find Polling Booth", description: "Locate your assigned booth on the ECI website", completed: false, urgent: false },
        { id: "4", title: "Know Candidates", description: "Research candidates' backgrounds and manifestos", completed: false, urgent: false },
        { id: "5", title: "Plan Your Vote", description: "Decide your voting time to avoid peak hours", completed: false, urgent: false }
      ],
      keyDates: [
        { label: "Voter Registration Deadline", date: "2024-10-15", daysRemaining: 45 },
        { label: "Model Code of Conduct", date: "2024-10-20", daysRemaining: 50 },
        { label: "Polling Day", date: "2024-11-15", daysRemaining: 76 }
      ]
    });
  }
  if (lower.includes('scenario') || lower.includes('what if') || lower.includes('what happens')) {
    return JSON.stringify({
      immediateConsequence: "Your vote will not be counted for this election cycle.",
      shortTermImpact: "You lose your democratic voice in selecting local and national representatives.",
      longTermImpact: "Collective non-participation weakens democratic accountability and may lead to poor governance outcomes.",
      legalImplication: "Missing a vote is not illegal in India, but repeatedly missing elections can affect your voter record.",
      advice: "Set reminders for election day, plan your transportation in advance, and inform your employer if needed.",
      severity: "medium"
    });
  }
  return "I'm your Election Guide Assistant! I can help you understand voting processes, registration requirements, election day procedures, and how your vote makes a difference. What would you like to know?";
}

export async function streamContent(
  prompt: string,
  systemInstruction?: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const client = getGenAI();
  if (!client) {
    const fallback = getFallbackResponse(prompt);
    if (onChunk) onChunk(fallback);
    return fallback;
  }

  try {
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are an expert Election Guide Assistant for Indian elections.',
    });

    const result = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }

    return fullText;
  } catch (error) {
    console.error('Gemini streaming error:', error);
    const fallback = getFallbackResponse(prompt);
    if (onChunk) onChunk(fallback);
    return fallback;
  }
}
