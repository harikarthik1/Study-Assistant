export type StudyStep =
  | "generate"
  | "flashcards"
  | "quiz"
  | "results"
  | "loading"
  | "error";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface StudySet {
  id: string;
  topic: string;
  rawNotes?: string;
  createdAt?: number;
  flashcards: Flashcard[];
  questions: QuizQuestion[];
}

export interface QuizResult {
  correct: number;
  wrong: number;
  total: number;
  userAnswers?: Record<string, string>;
  mistakeQuestionIds?: string[];
  percentage?: number;
}