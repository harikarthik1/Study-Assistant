import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/Header";
import StudyProgress from "../components/StudyProgress";
import type { StudyStep } from "../types/study";

const pathToStep: Record<string, StudyStep> = {
  "/": "generate",
  "/flashcards": "flashcards",
  "/quiz": "quiz",
  "/results": "results",
};

const StudyLayout = () => {
  const location = useLocation();
  const currentStep = pathToStep[location.pathname] || "generate";

  return (
    <div className="min-h-screen bg-[#F6F7FA]">
      <Header />

      <div className="min-h-screen p-6 flex flex-col align-center justify-center">
        <StudyProgress currentStep={currentStep} />

        <main className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudyLayout;