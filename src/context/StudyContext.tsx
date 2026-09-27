import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { QuizQuestion, QuizResult, StudySet } from "../types/study";
import { generateStudySetWithGemini } from "../services/gemini";

interface StudyContextType {
  studySet: StudySet | null;
  loading: boolean;
  error: string | null;
  notes: string;
  setNotes: (notes: string) => void;
  // Quiz states
  quizAnswers: Record<string, string>;
  setQuizAnswer: (questionId: string, answer: string) => void;
  quizResult: QuizResult | null;
  mistakesOnly: boolean;
  activeQuestions: QuizQuestion[];
  // Methods
  generate: (customNotes?: string) => Promise<boolean>;
  retryGeneration: () => Promise<boolean>;
  clearError: () => void;
  submitQuiz: () => QuizResult;
  retryMistakes: () => void;
  resetQuiz: () => void;
  loadSavedStudySet: (set: StudySet) => void;
  savedSessions: StudySet[];
  deleteSavedSession: (id: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_SET: "studyai_current_set",
  SAVED_SESSIONS: "studyai_saved_sessions",
  NOTES: "studyai_saved_notes",
  QUIZ_RESULT: "studyai_quiz_result",
};

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studySet, setStudySet] = useState<StudySet | null>(null);

  const [savedSessions, setSavedSessions] = useState<StudySet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [notes, setNotesState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.NOTES) || "";
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [mistakesOnly, setMistakesOnly] = useState<boolean>(false);

  // Request cancellation to prevent race conditions / stale responses
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save changes to localStorage
  const setNotes = (newNotes: string) => {
    setNotesState(newNotes);
    localStorage.setItem(STORAGE_KEYS.NOTES, newNotes);
  };

  useEffect(() => {
    if (studySet) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SET, JSON.stringify(studySet));
    }
  }, [studySet]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SAVED_SESSIONS,
      JSON.stringify(savedSessions)
    );
  }, [savedSessions]);

  useEffect(() => {
    if (quizResult) {
      localStorage.setItem(
        STORAGE_KEYS.QUIZ_RESULT,
        JSON.stringify(quizResult)
      );
    }
  }, [quizResult]);

  const clearError = () => setError(null);

  const generate = async (customNotes?: string): Promise<boolean> => {
    const textToUse = customNotes !== undefined ? customNotes : notes;
    if (!textToUse || textToUse.trim().length === 0) {
      setError("Please provide some notes or a topic to study.");
      return false;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const generatedSet = await generateStudySetWithGemini(textToUse, {
        signal: controller.signal,
      });

      setStudySet(generatedSet);
      setQuizAnswers({});
      setQuizResult(null);
      setMistakesOnly(false);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULT);

      setSavedSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== generatedSet.id);
        return [generatedSet, ...filtered].slice(0, 10);
      });

      setLoading(false);
      return true;
    } catch (err: any) {
      if (err.name === "AbortError") {
        return false;
      }
      console.error("Generation error:", err);
      setError(
        err.message ||
          "The AI returned an unexpected study format. Your notes are safe — try again."
      );
      setLoading(false);
      return false;
    }
  };

  const retryGeneration = async (): Promise<boolean> => {
    return generate(notes);
  };

  const setQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const activeQuestions: QuizQuestion[] = React.useMemo(() => {
    if (!studySet) return [];
    if (mistakesOnly && quizResult?.mistakeQuestionIds?.length) {
      return studySet.questions.filter((q) =>
        quizResult.mistakeQuestionIds?.includes(q.id)
      );
    }
    return studySet.questions;
  }, [studySet, mistakesOnly, quizResult]);

  const submitQuiz = (): QuizResult => {
    if (!studySet) {
      const fallbackResult: QuizResult = { correct: 0, wrong: 0, total: 0 };
      setQuizResult(fallbackResult);
      return fallbackResult;
    }

    const questionsToEvaluate = activeQuestions;
    let correctCount = 0;
    const mistakeIds: string[] = [];

    questionsToEvaluate.forEach((q) => {
      const userAnswer = quizAnswers[q.id];
      if (
        userAnswer &&
        userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      ) {
        correctCount++;
      } else {
        mistakeIds.push(q.id);
      }
    });

    const total = questionsToEvaluate.length;
    const wrongCount = total - correctCount;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const result: QuizResult = {
      correct: correctCount,
      wrong: wrongCount,
      total,
      percentage,
      userAnswers: quizAnswers,
      mistakeQuestionIds: mistakeIds,
    };

    setQuizResult(result);
    return result;
  };

  const retryMistakes = () => {
    if (!quizResult || !quizResult.mistakeQuestionIds?.length) return;
    setMistakesOnly(true);
    setQuizAnswers((prev) => {
      const updated = { ...prev };
      quizResult.mistakeQuestionIds?.forEach((id) => {
        delete updated[id];
      });
      return updated;
    });
  };

  const resetQuiz = () => {
    setMistakesOnly(false);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const loadSavedStudySet = (set: StudySet) => {
    setStudySet(set);
    if (set.rawNotes) {
      setNotes(set.rawNotes);
    }
    setQuizAnswers({});
    setQuizResult(null);
    setMistakesOnly(false);
    clearError();
  };

  const deleteSavedSession = (id: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StudyContext.Provider
      value={{
        studySet,
        loading,
        error,
        notes,
        setNotes,
        quizAnswers,
        setQuizAnswer,
        quizResult,
        mistakesOnly,
        activeQuestions,
        generate,
        retryGeneration,
        clearError,
        submitQuiz,
        retryMistakes,
        resetQuiz,
        loadSavedStudySet,
        savedSessions,
        deleteSavedSession,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
};
