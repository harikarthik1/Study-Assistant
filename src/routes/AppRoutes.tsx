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
          element={<Flashcards />}
        />

        <Route
          path="/quiz"
          element={<Quiz />}
        />

        <Route
          path="/results"
          element={<Results />}
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