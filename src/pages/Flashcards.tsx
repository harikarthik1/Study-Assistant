import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";

const Flashcards: React.FC = () => {
  const navigate = useNavigate();
  const { studySet } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "grid">("card");

  const cards = studySet?.flashcards || [];
  const currentCard = cards[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, cards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  // If no study set loaded, show empty state
  if (!studySet || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-[#EDE9FE] text-[#453DD1] rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Flashcards Yet</h2>
        <p className="mt-2 text-slate-500 text-sm sm:text-base">
          Generate a study set from your notes first to view interactive flashcards.
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

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Flashcards</h1>
            <span className="inline-flex items-center rounded-full bg-[#E8E5FC] px-2.5 py-0.5 text-xs font-semibold text-[#453DD1]">
              STEP 1 FLASHCARDS
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 truncate max-w-md">
            Topic: <span className="font-semibold text-slate-700">{studySet.topic}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode("card")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              viewMode === "card"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Cards ({cards.length})
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
              <span>
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#453DD1] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div
            className="w-full min-h-[300px] sm:min-h-[340px] cursor-pointer select-none perspective-1000 my-4"
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-2xl transition-transform duration-500 transform-style-3d border border-slate-100 shadow-sm ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Card Front (Question) */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-2xl p-8 flex flex-col justify-between backface-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    Question
                  </span>
                </div>

                <div className="my-auto py-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center leading-relaxed">
                    {currentCard.question}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-50">
                  <span>Press Space to flip</span>
                  <span className="flex items-center gap-1 text-[#453DD1] font-medium">
                    Show Answer
                  </span>
                </div>
              </div>

              {/* Card Back (Answer) */}
              <div className="absolute inset-0 w-full h-full bg-[#FBFBFF] rounded-2xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-[#453DD1]/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#453DD1] bg-[#E8E5FC] px-2.5 py-1 rounded-md">
                    Answer
                  </span>
                </div>

                <div className="my-auto py-6">
                  <p className="text-lg sm:text-xl text-slate-800 text-center leading-relaxed font-medium">
                    {currentCard.answer}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span>Press Space to flip back</span>
                  <span className="flex items-center gap-1 text-[#453DD1] font-medium">
                    Show Question
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Controls */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border transition cursor-pointer ${
                currentIndex === 0
                  ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleFlip}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              Flip Card (Space)
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border transition cursor-pointer ${
                currentIndex === cards.length - 1
                  ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs"
              }`}
            >
              Next
            </button>
          </div>

          {/* Quick Quiz Transition Banner */}
          <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Ready to test your knowledge?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Take the generated quiz with {studySet.questions.length} questions.
              </p>
            </div>
            <button
              onClick={() => navigate("/quiz")}
              className="w-full sm:w-auto bg-[#453DD1] hover:bg-[#3931BE] text-white font-medium px-6 py-2.5 rounded-xl transition shadow-xs text-sm cursor-pointer whitespace-nowrap"
            >
              Start Quiz
            </button>
          </div>
        </>
      ) : (
        /* Grid View Mode */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      Card #{index + 1}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">
                    {card.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {card.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => navigate("/quiz")}
              className="bg-[#453DD1] hover:bg-[#3931BE] text-white font-medium px-6 py-3 rounded-xl transition shadow-xs text-sm cursor-pointer"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;