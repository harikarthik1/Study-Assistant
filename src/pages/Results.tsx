import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";

const Results: React.FC = () => {
  const navigate = useNavigate();
  const {
    studySet,
    quizResult,
    activeQuestions,
    retryMistakes,
    resetQuiz,
  } = useStudy();

  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // If no quiz result, redirect or show empty state
  if (!quizResult || !studySet) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-[#EDE9FE] text-[#453DD1] rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Results Found</h2>
        <p className="mt-2 text-slate-500 text-sm sm:text-base">
          Complete a quiz first to view your score breakdown and review mistakes.
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

  const { correct, wrong, total, percentage = Math.round((correct / (total || 1)) * 100), userAnswers = {}, mistakeQuestionIds = [] } = quizResult;
  const hasMistakes = wrong > 0;

  const handleRetryMistakes = () => {
    retryMistakes();
    navigate("/quiz");
  };

  const handleRetakeAll = () => {
    resetQuiz();
    navigate("/quiz");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 pb-16 animate-fade-in">
      {/* Pill Badge matching Image 4 */}
      <span className="inline-flex items-center rounded-full bg-[#E6F4EA] px-3.5 py-1 text-xs font-bold text-[#137333] tracking-wider uppercase">
        QUIZ COMPLETE
      </span>

      {/* Main Heading matching Image 4 */}
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
        Session complete
      </h1>

      {/* Subheading matching Image 4 */}
      <p className="mt-2 text-slate-500 text-base sm:text-lg text-center">
        You scored {correct} out of {total}
      </p>

      {/* 3 Stats Cards Grid matching Image 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
        {/* Card 1: Correct (Green) */}
        <div className="bg-[#E6F4EA] rounded-2xl p-6 flex flex-col justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-slate-900">
            {correct}
          </span>
          <span className="text-slate-600 text-sm mt-1 font-medium">
            Correct
          </span>
        </div>

        {/* Card 2: Needs Review (Pink/Red) */}
        <div className="bg-[#FEE2E2] rounded-2xl p-6 flex flex-col justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-slate-900">
            {wrong}
          </span>
          <span className="text-slate-600 text-sm mt-1 font-medium">
            Needs review
          </span>
        </div>

        {/* Card 3: Score (Purple) */}
        <div className="bg-[#E8E5FC] rounded-2xl p-6 flex flex-col justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-slate-900">
            {percentage}%
          </span>
          <span className="text-slate-600 text-sm mt-1 font-medium">
            Score
          </span>
        </div>
      </div>

      {/* Review Mistakes Card matching Image 4 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm w-full mt-6">
        {hasMistakes ? (
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Review your mistakes
            </h2>
            <p className="text-slate-500 text-sm mt-1 mb-4">
              {wrong} {wrong === 1 ? "question needs" : "questions need"} another attempt.
            </p>
            <button
              onClick={handleRetryMistakes}
              className="bg-[#453DD1] hover:bg-[#3931BE] active:scale-98 text-white font-medium px-6 py-3 rounded-xl transition duration-200 cursor-pointer shadow-xs text-sm sm:text-base"
            >
              Retry {wrong} {wrong === 1 ? "Mistake" : "Mistakes"}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Perfect score! Outstanding work!
            </h2>
            <p className="text-slate-500 text-sm mt-1 mb-4">
              You mastered all {total} questions on this study set.
            </p>
            <button
              onClick={handleRetakeAll}
              className="bg-[#453DD1] hover:bg-[#3931BE] active:scale-98 text-white font-medium px-6 py-3 rounded-xl transition duration-200 cursor-pointer shadow-xs text-sm sm:text-base"
            >
              Retake Full Quiz
            </button>
          </div>
        )}
      </div>

      {/* Additional Actions */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => setShowDetailedReview(!showDetailedReview)}
          className="text-sm text-[#453DD1] hover:underline font-medium cursor-pointer"
        >
          {showDetailedReview ? "Hide Answer Key" : "Show Detailed Answer Key"}
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/flashcards"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition"
          >
            Review Flashcards
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition"
          >
            New Topic
          </Link>
        </div>
      </div>

      {/* Detailed Answer Review Dropdown */}
      {showDetailedReview && (
        <div className="w-full mt-6 space-y-4 animate-fade-in">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Question Breakdown
          </h2>

          {activeQuestions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect =
              userAnswer &&
              userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            const isMistake = mistakeQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-5 border shadow-2xs ${
                  isMistake ? "border-rose-200" : "border-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">
                    Question {idx + 1}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      isCorrect
                        ? "bg-[#E6F4EA] text-[#137333]"
                        : "bg-[#FEE2E2] text-[#E11D48]"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Needs Review"}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-3">
                  {q.question}
                </h4>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div
                    className={`p-2.5 rounded-lg flex items-center justify-between ${
                      isCorrect
                        ? "bg-[#E6F4EA]/60 text-slate-800"
                        : "bg-[#FEE2E2]/60 text-slate-800"
                    }`}
                  >
                    <span>
                      <strong className="text-slate-700">Your Answer:</strong>{" "}
                      {userAnswer || "(No answer selected)"}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className="p-2.5 rounded-lg bg-[#E6F4EA]/60 text-slate-800 flex items-center justify-between">
                      <span>
                        <strong className="text-[#137333]">Correct Answer:</strong>{" "}
                        {q.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>

                {q.explanation && (
                  <p className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;