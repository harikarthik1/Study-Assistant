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
}

export interface StudySet {
  id: string;
  topic: string;
  flashcards: Flashcard[];
  questions: QuizQuestion[];
}

export interface QuizResult {
  correct: number;
  wrong:number;
  total: number;
}