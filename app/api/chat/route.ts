import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'Election Guide Assistant API', timestamp: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, currentPage, userProfile } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const conversationHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n');

    const systemInstruction = `You are an expert, friendly Election Guide Assistant specializing in Indian elections and democracy. 
Your role is to educate, guide, and empower voters with accurate information.
Current page the user is on: ${currentPage || 'home'}
${userProfile ? `User profile: ${JSON.stringify(userProfile)}` : ''}
Keep responses concise (2-4 sentences), engaging, and actionable. Use simple language. Be encouraging and positive about civic participation.`;

    const prompt = conversationHistory 
      ? `Previous conversation:\n${conversationHistory}\n\nUser: ${lastMessage.content}`
      : lastMessage.content;

    const response = await generateContent(prompt, systemInstruction);

    return NextResponse.json({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
