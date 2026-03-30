export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category =
  | "Storage"
  | "Messaging"
  | "Real-time"
  | "Search"
  | "Infrastructure"
  | "Social"
  | "Media";

export interface Problem {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  estimatedMinutes: number;
  requirements: {
    functional: string[];
    nonFunctional: string[];
  };
  hints?: string[];
}
