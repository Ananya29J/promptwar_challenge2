import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { constituency, state, electionStatus = 'ongoing' } = body;

    if (!constituency || !state) {
      return NextResponse.json({ error: 'Constituency and state required' }, { status: 400 });
    }

    const isCompleted = electionStatus === 'completed';

    const prompt = `Generate realistic candidate profiles for the "${constituency}" constituency in ${state}, India for a general election. 
    
Return a JSON array of 4–5 candidate objects, each with this structure:
{
  "id": "unique-id",
  "name": "Full Name",
  "party": "Party Name",
  "partyShort": "Acronym",
  "partyColor": "#hexcolor",
  "age": 45,
  "education": "Degree, Institution",
  "profession": "their profession",
  "yearsInPolitics": 12,
  "previousWins": 2,
  "assets": "₹X crore (approx)",
  "criminalCases": 0,
  "keyWorks": ["Achievement 1 in 30 words", "Achievement 2", "Achievement 3"],
  "promises": ["Campaign promise 1", "Campaign promise 2", "Campaign promise 3"],
  "socialMedia": { "twitter": "@handle", "facebook": "page" },
  "rating": 7.2,
  "bioSummary": "2-sentence biography"${isCompleted ? `,
  "isWinner": false,
  "currentWork": ["Ongoing work item 1", "Ongoing work item 2"]` : ''}
}

Include a mix of major national parties (BJP, INC, AAP, TMC etc.) and a regional/independent candidate.
Use realistic Indian names. Make assets, criminal cases realistic for Indian politicians.
${isCompleted ? `CRITICAL: Since the election is COMPLETED, you MUST mark exactly ONE candidate with "isWinner": true. For the winner, fill out the "currentWork" array with 2-3 detailed items about what they are doing in office right now. For all other candidates, "isWinner" must be false and "currentWork" can be empty.` : `Since the election is ONGOING, do not include isWinner or currentWork fields.`}
Return ONLY the JSON array, no markdown.`;

    const systemInstruction = 'You are an Indian political analyst generating realistic candidate profiles for electoral awareness. Return only valid JSON arrays.';

    let candidates;
    try {
      const response = await generateContent(prompt, systemInstruction);
      const clean = response.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      candidates = JSON.parse(clean);
      if (!Array.isArray(candidates)) {
        throw new Error('Parsed response is not an array');
      }
    } catch (e) {
      console.warn('AI generation failed, using fallback data', e);
      candidates = getFallbackCandidates(constituency, isCompleted);
    }

    return NextResponse.json({ candidates, constituency, state });
  } catch (error) {
    console.error('Candidates API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getFallbackCandidates(constituency: string, isCompleted: boolean) {
  return [
    {
      id: "c1", name: "Rajesh Kumar Sharma", party: "Bharatiya Janata Party", partyShort: "BJP",
      partyColor: "#FF9933", age: 52, education: "B.Tech, IIT Delhi",
      profession: "Businessman & Social Worker", yearsInPolitics: 14, previousWins: 2,
      assets: "₹8.4 crore", criminalCases: 0,
      keyWorks: ["Constructed 12 km of roads under PMGSY", "Organized 3 health camps serving 4,000 beneficiaries", "Installed solar panels in 5 local schools"],
      promises: ["Free WiFi in all panchayats", "New medical college in district", "500 new government jobs for youth"],
      socialMedia: { twitter: "@RajeshSharmaMP", facebook: "RajeshSharmaOfficial" },
      rating: 7.4, bioSummary: `A two-term MLA from ${constituency} with a background in engineering and community service. Known for infrastructure development.`,
      ...(isCompleted ? { isWinner: true, currentWork: ["Supervising the construction of the new district hospital", "Implementing the central water scheme across 40 rural villages", "Holding weekly janata darbars"] } : {})
    },
    {
      id: "c2", name: "Priya Anand Mehta", party: "Indian National Congress", partyShort: "INC",
      partyColor: "#138808", age: 44, education: "LLB, Delhi University",
      profession: "Advocate & Activist", yearsInPolitics: 8, previousWins: 1,
      assets: "₹3.2 crore", criminalCases: 0,
      keyWorks: ["Fought legal battles for 200 displaced families", "Established women's self-help groups in 15 villages", "Championed RTI applications for local governance"],
      promises: ["Free legal aid for all citizens", "Women safety patrol in urban areas", "Restore legacy irrigation projects"],
      socialMedia: { twitter: "@PriyaMehtaINC", facebook: "PriyaMehtaCongress" },
      rating: 7.1, bioSummary: "A first-generation politician and practicing advocate who rose through grassroots activism. Passionate about women's rights and civic justice.",
      ...(isCompleted ? { isWinner: false, currentWork: [] } : {})
    },
    {
      id: "c3", name: "Mohan Das Yadav", party: "Samajwadi Party", partyShort: "SP",
      partyColor: "#E50808", age: 58, education: "MA Political Science",
      profession: "Farmer & Former Gram Pradhan", yearsInPolitics: 22, previousWins: 3,
      assets: "₹1.8 crore", criminalCases: 1,
      keyWorks: ["Secured irrigation facility for 8,000 acres of farmland", "Built 3 cooperative dairy societies", "Installed 200 handpumps in underserved villages"],
      promises: ["MSP guarantee for all crops", "Interest-free Kisan loans", "Repair of damaged rural roads"],
      socialMedia: { twitter: "@MohanYadavSP", facebook: "MohanYadavOfficial" },
      rating: 6.5, bioSummary: "A veteran politician with three consecutive wins, deeply rooted in farmer communities. His pending criminal case relates to a land dispute from 2011.",
      ...(isCompleted ? { isWinner: false, currentWork: [] } : {})
    },
    {
      id: "c4", name: "Aishwarya Rajan Nair", party: "Aam Aadmi Party", partyShort: "AAP",
      partyColor: "#0066CC", age: 36, education: "MBA, IIM Ahmedabad",
      profession: "Entrepreneur & NGO Founder", yearsInPolitics: 3, previousWins: 0,
      assets: "₹95 lakh", criminalCases: 0,
      keyWorks: ["Founded NGO providing free coaching to 1,200 students", "Launched app for real-time municipal grievances", "Organized plastic-free drives covering 30 localities"],
      promises: ["Transparent budget portal for constituency", "Free skill development centers", "CCTV on all main roads"],
      socialMedia: { twitter: "@AishwaryaAAP", facebook: "AishwaryaRajanNair" },
      rating: 7.8, bioSummary: "A first-time candidate and tech entrepreneur who founded an NGO to help underprivileged students. Youngest candidate in the constituency.",
      ...(isCompleted ? { isWinner: false, currentWork: [] } : {})
    },
    {
      id: "c5", name: "Abdul Karim Khan", party: "Independent", partyShort: "IND",
      partyColor: "#6B7280", age: 63, education: "BA, Local College",
      profession: "Retired School Principal", yearsInPolitics: 5, previousWins: 0,
      assets: "₹32 lakh", criminalCases: 0,
      keyWorks: ["Renovated 4 government schools using personal funds", "Mediated peaceful resolution of 3 community disputes", "Volunteered for flood relief in 2022 affecting 600 families"],
      promises: ["Focus only on education reform", "Transparent use of MPLAD funds", "Monthly open-door office hours"],
      socialMedia: { twitter: "", facebook: "AbdulKarimVoter" },
      rating: 6.9, bioSummary: "A retired principal standing as an independent candidate on a platform of educational reform and transparent governance.",
      ...(isCompleted ? { isWinner: false, currentWork: [] } : {})
    }
  ];
}
