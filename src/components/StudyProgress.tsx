import { Link } from "react-router-dom";
import type { StudyStep } from "../types/study";

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
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <Link
              key={step.id}
              to={step.path}
              className={`
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
                    : "bg-[#EEF0F4] text-[#616B80] hover:bg-[#E2E6ED]"
                }
              `}
            >
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
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StudyProgress;