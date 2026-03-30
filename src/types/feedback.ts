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

export interface StoredFeedback {
  id: string;
  feedback: StructuredFeedback;
  timestamp: number;
}

export type FeedbackStreamEvent =
  | { type: "section_complete"; section: FeedbackSection }
  | { type: "cross_reference"; inconsistencies: string[] }
  | { type: "diagram_analysis"; diagramFeedback: string }
  | {
      type: "calibration";
      overallScore: number;
      summary: string;
      strengths: string[];
      improvements: string[];
    }
  | { type: "follow_up"; followUpQuestions: string[] }
  | { type: "complete"; feedback: StructuredFeedback }
  | { type: "error"; message: string };
