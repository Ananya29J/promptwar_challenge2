// Shared TypeScript types for Election Guide Assistant

export interface ElectionTwinProfile {
  ageGroup: string;
  state: string;
  firstTimeVoter: boolean;
  awarenessLevel: number; // 1-5
}

export interface TwinDashboard {
  profile: ElectionTwinProfile;
  awarenessScore: number;
  tips: string[];
  checklist: ChecklistItem[];
  keyDates: KeyDate[];
  personalizedMessage: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  urgent?: boolean;
}

export interface KeyDate {
  label: string;
  date: string;
  daysRemaining: number;
}

export interface SimulatorStep {
  id: string;
  phase: 'register' | 'choose-method' | 'vote';
  title: string;
  description: string;
  options: SimulatorOption[];
}

export interface SimulatorOption {
  id: string;
  text: string;
  consequence: string;
  points: number;
  isCorrect: boolean;
  badge?: Badge;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface ScenarioNode {
  id: string;
  question: string;
  category: string;
}

export interface ScenarioResult {
  scenario: string;
  immediateConsequence: string;
  shortTermImpact: string;
  longTermImpact: string;
  legalImplication: string;
  advice: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface FlowNode {
  id: string;
  label: string;
  description: string;
  icon: string;
  phase: 'registration' | 'verification' | 'voting' | 'counting' | 'results';
  isActive: boolean;
  isCompleted: boolean;
}
