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
    <div className="min-h-screen bg-[#F6F7FA] flex flex-col">
      <Header />

      <div className="flex-1 px-4 py-6 flex flex-col items-center">
        <StudyProgress currentStep={currentStep} />

        <main className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudyLayout;