import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const GenerateStudySet = () => {
  const navigate = useNavigate();
  const {
    notes,
    setNotes,
    generate,
    retryGeneration,
    clearError,
    loading,
    error,
    savedSessions,
    loadSavedStudySet,
    deleteSavedSession,
  } = useStudy();

  const [inputError, setInputError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setInputError("Please enter your study notes or topic above.");
      return;
    }
    setInputError("");
    const success = await generate(notes);
    if (success) {
      navigate("/flashcards");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        errorMessage={error}
        onRetry={async () => {
          const success = await retryGeneration();
          if (success) {
            navigate("/flashcards");
          }
        }}
        onReset={clearError}
      />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10 w-full max-w-3xl mx-auto px-4">
      {/* Kept exactly as user structured */}
      <h1 className="text-3xl text-primary font-bold text-center">
        Turn your notes into a study set instantly
      </h1>

      <p className="mt-3 text-slate-500 text-center max-w-xl text-base sm:text-lg">
        Paste your lecture notes, textbook excerpts, or any topic to generate flashcards and a quiz in seconds.
      </p>

      {/* Form Card */}
      <form onSubmit={handleGenerate} className="w-full mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="notes-input"
            className="text-sm font-semibold text-slate-800"
          >
            Study Material / Notes
          </label>
          {notes && (
            <button
              type="button"
              onClick={() => {
                setNotes("");
                setInputError("");
              }}
              className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              Clear notes
            </button>
          )}
        </div>

        <textarea
          id="notes-input"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (inputError) setInputError("");
          }}
          placeholder="Paste your notes here, write a list of key terms, or describe a topic (e.g., Object-Oriented Programming, World War II timeline, Machine Learning fundamentals)..."
          rows={7}
          className="w-full p-4 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#453DD1] focus:border-transparent text-sm sm:text-base resize-y transition"
        />

        {inputError && (
          <p className="mt-2 text-xs font-medium text-rose-500">
            {inputError}
          </p>
        )}

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            {notes.length} characters • Generates 5 Flashcards + 5 Quiz Questions
          </span>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#453DD1] hover:bg-[#3931BE] active:scale-98 text-white font-medium px-8 py-3 rounded-xl transition duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <span>Generate Study Set</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Saved Sessions Section */}
      {savedSessions.length > 0 && (
        <div className="w-full mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Recent Study Sets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs hover:shadow-sm transition flex items-center justify-between group"
              >
                <div
                  onClick={() => {
                    loadSavedStudySet(session);
                    navigate("/flashcards");
                  }}
                  className="cursor-pointer flex-1 min-w-0 pr-3"
                >
                  <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-[#453DD1] transition">
                    {session.topic}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {session.flashcards.length} cards • {session.questions.length} questions
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSavedSession(session.id);
                  }}
                  className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition cursor-pointer"
                  title="Remove from history"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateStudySet;