export interface User {
  id: string;
  name: string;
  email: string;
  institution?: string;
  role?: string;
  createdAt?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  level: string;
  objectives: string;
  studentProfile?: string;
  conversation: ChatMessage[];
  preClass?: PlanPhase;
  inClass?: PlanPhase;
  assessment?: AssessmentPhase;
  status: 'draft' | 'complete';
  createdAt: string;
  updatedAt: string;
  materials?: Material[];
  reflections?: Reflection[];
}

export interface PlanPhase {
  description: string;
  activities: string[];
  materials?: string[];
  methodology?: string;
  duration: string;
}

export interface AssessmentPhase {
  description: string;
  methods: string[];
  criteria: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Material {
  id: string;
  planId?: string;
  type: 'quiz' | 'summary' | 'video-script' | 'activity';
  title: string;
  content: any;
  createdAt: string;
  updatedAt: string;
  plan?: { title: string; subject: string };
}

export interface QuizContent {
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

export interface SummaryContent {
  sections: {
    title: string;
    content: string;
  }[];
}

export interface VideoScriptContent {
  segments: {
    timestamp: string;
    narration: string;
    visual: string;
  }[];
}

export interface ActivityContent {
  steps: {
    step: number;
    instruction: string;
    duration: string;
    groupSize: string;
  }[];
}

export interface Reflection {
  id: string;
  planId?: string;
  perceptions: string;
  difficulties: string;
  improvements: string;
  aiSuggestion?: string;
  createdAt: string;
  plan?: { title: string; subject: string };
}

export interface TrailContent {
  id: string;
  title: string;
  body: string;
  context: 'pre-class' | 'in-class' | 'assessment' | 'general';
  duration: string;
  order: number;
}
