export interface FeedbackSection {
  name: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface StructuredFeedback {
  overallScore: number;
  summary: string;
  sections: FeedbackSection[];
  strengths: string[];
  improvements: string[];
  followUpQuestions: string[];
}
