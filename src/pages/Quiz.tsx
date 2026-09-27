import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const {
    studySet,
    activeQuestions,
    quizAnswers,
    setQuizAnswer,
    submitQuiz,
    mistakesOnly,
  } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQuestions = activeQuestions.length;
  const currentQuestion = activeQuestions[currentIndex];
  const selectedAnswer = currentQuestion ? quizAnswers[currentQuestion.id] : "";

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    setQuizAnswer(currentQuestion.id, option);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitQuiz();
      navigate("/results");
    }
  }, [currentIndex, totalQuestions, submitQuiz, navigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (!currentQuestion) return;

      const key = e.key.toUpperCase();
      let optionIdx = -1;

      if (key >= "1" && key <= "4") {
        optionIdx = parseInt(key, 10) - 1;
      } else if (key >= "A" && key <= "D") {
        optionIdx = key.charCodeAt(0) - 65;
      }

      if (optionIdx >= 0 && optionIdx < currentQuestion.options.length) {
        handleSelectOption(currentQuestion.options[optionIdx]);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, handleNext, handlePrev]);

  // Empty state if no study set or active questions
  if (!studySet || totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-[#EDE9FE] text-[#453DD1] rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Quiz Available</h2>
        <p className="mt-2 text-slate-500 text-sm sm:text-base">
          Generate a study set from your notes first to take a customized quiz.
        </p>
        <Link
          to="/"
          className="mt-6 bg-[#453DD1] hover:bg-[#3931BE] text-white font-medium px-6 py-3 rounded-xl transition shadow-xs"
        >
          Create Study Set
        </Link>
      </div>
    );
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-12 animate-fade-in">
      {/* Title Header matching Image 3 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-slate-900">Quiz Time</h1>
          <span className="ml-3 inline-flex items-center rounded-full bg-[#E8E5FC] px-3 py-1 text-xs font-semibold text-[#453DD1] uppercase tracking-wider">
            {mistakesOnly ? "RETESTING MISTAKES" : "STEP 2 QUIZ"}
          </span>
        </div>

        <span className="text-xs font-medium text-slate-500">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Main Question Card matching Image 3 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {currentQuestion.question}
        </h2>

        {/* Options List matching Image 3 */}
        <div className="space-y-3 mt-6">
          {currentQuestion.options.map((option, index) => {
            const letter = OPTION_LETTERS[index] || String(index + 1);
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left rounded-xl p-4 flex items-center gap-3.5 transition-all duration-150 cursor-pointer border ${
                  isSelected
                    ? "bg-[#F0EEFD] border-[#453DD1]/40 shadow-2xs"
                    : "bg-[#F6F7FA] hover:bg-[#EEF0F4] border-transparent"
                }`}
              >
                {/* Letter Badge */}
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-[#453DD1] text-white shadow-xs"
                      : "bg-white text-slate-700 shadow-2xs"
                  }`}
                >
                  {letter}
                </span>

                {/* Option Text */}
                <span
                  className={`text-sm sm:text-base font-medium flex-1 ${
                    isSelected ? "text-[#453DD1] font-semibold" : "text-slate-800"
                  }`}
                >
                  {option}
                </span>

                {/* Selected Checkmark */}
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-[#453DD1] shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions at bottom of card */}
        <div className="mt-8 flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition cursor-pointer ${
              currentIndex === 0
                ? "invisible"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="bg-[#453DD1] hover:bg-[#3931BE] active:scale-98 text-white font-medium px-7 py-3 rounded-xl transition duration-200 shadow-xs flex items-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <span>{isLastQuestion ? "Finish Quiz " : "Next Question"}</span>
          </button>
        </div>
      </div>

      {/* Subtext below card matching Image 3 */}
      <p className="mt-6 text-slate-400 text-sm text-center">
        You can change your answer before submitting.
      </p>

      {/* Question Indicators */}
      <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
        {activeQuestions.map((q, idx) => {
          const isAnswered = !!quizAnswers[q.id];
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                isCurrent
                  ? "bg-[#453DD1] text-white ring-2 ring-[#453DD1]/30"
                  : isAnswered
                  ? "bg-[#E8E5FC] text-[#453DD1]"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;