import { Link } from "react-router-dom";
import type { StudyStep } from "../types/study";
import { useStudy } from "../context/StudyContext";

interface StudyProgressProps {
  currentStep: StudyStep;
}

interface StepItem {
  id: StudyStep;
  number: number;
  label: string;
  path: string;
}

const steps: StepItem[] = [
  {
    id: "generate",
    number: 1,
    label: "Generate",
    path: "/",
  },
  {
    id: "flashcards",
    number: 2,
    label: "Flashcards",
    path: "/flashcards",
  },
  {
    id: "quiz",
    number: 3,
    label: "Quiz",
    path: "/quiz",
  },
  {
    id: "results",
    number: 4,
    label: "Results",
    path: "/results",
  },
];

const StudyProgress = ({ currentStep }: StudyProgressProps) => {
  const { studySet, quizResult } = useStudy();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const isStepUnlocked = (stepId: StudyStep) => {
    switch (stepId) {
      case "generate":
        return true;
      case "flashcards":
      case "quiz":
        return !!studySet;
      case "results":
        return !!quizResult;
      default:
        return false;
    }
  };

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const unlocked = isStepUnlocked(step.id);

          const content = (
            <>
              <span
                className={`
                  flex h-6 w-6 items-center justify-center
                  rounded-full
                  text-xs font-semibold
                  ${
                    isCompleted
                      ? "bg-[#137333] text-white"
                      : isCurrent
                      ? "bg-[#453DD1] text-white"
                      : "bg-[#D9DDE6] text-[#616B80]"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </span>

              <span>{step.label}</span>
            </>
          );

          const className = `
            flex items-center gap-2
            rounded-full
            px-4 py-2
            text-sm font-medium
            transition-all duration-200
            ${
              isCompleted
                ? "bg-[#E6F4EA] text-[#137333] hover:bg-[#D7EFE0]"
                : isCurrent
                ? "bg-[#E8E5FC] text-[#453DD1]"
                : unlocked
                ? "bg-[#EEF0F4] text-[#616B80] hover:bg-[#E2E6ED] cursor-pointer"
                : "bg-[#F1F3F7] text-[#9AA2B1] opacity-60 cursor-not-allowed select-none"
            }
          `;

          if (unlocked) {
            return (
              <Link key={step.id} to={step.path} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <div key={step.id} className={className} title="Complete previous step to unlock">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyProgress;