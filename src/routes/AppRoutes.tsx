import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StudyLayout from "../layouts/StudyLayout";
import GenerateStudySet from "../pages/GenerateStudySet";
import Flashcards from "../pages/Flashcards";
import Quiz from "../pages/Quiz";
import Results from "../pages/Results";
import { useStudy } from "../context/StudyContext";

const ProtectedFlashcards = () => {
  const { studySet } = useStudy();
  if (!studySet) {
    return <Navigate to="/" replace />;
  }
  return <Flashcards />;
};

const ProtectedQuiz = () => {
  const { studySet } = useStudy();
  if (!studySet) {
    return <Navigate to="/" replace />;
  }
  return <Quiz />;
};

const ProtectedResults = () => {
  const { studySet, quizResult } = useStudy();
  if (!studySet) {
    return <Navigate to="/" replace />;
  }
  if (!quizResult) {
    return <Navigate to="/quiz" replace />;
  }
  return <Results />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<StudyLayout />}>
        <Route
          path="/"
          element={<GenerateStudySet />}
        />

        <Route
          path="/flashcards"
          element={<ProtectedFlashcards />}
        />

        <Route
          path="/quiz"
          element={<ProtectedQuiz />}
        />

        <Route
          path="/results"
          element={<ProtectedResults />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;