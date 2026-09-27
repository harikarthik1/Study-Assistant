import React from "react";

interface ErrorStateProps {
  errorMessage?: string;
  onRetry?: () => void;
  onReset?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage = "The AI returned an unexpected study format. Your notes are safe — try again.",
  onRetry,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full max-w-3xl mx-auto animate-fade-in">
      
      <span className="inline-flex items-center rounded-full bg-[#FEE2E2] px-4 py-1.5 text-xs font-bold text-[#E11D48] tracking-wider uppercase">
        COULD NOT GENERATE
      </span>

      <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
        Something went wrong
      </h2>

      <p className="mt-3 text-slate-500 text-base sm:text-lg text-center max-w-lg leading-relaxed">
        {errorMessage}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#453DD1] hover:bg-[#3931BE] active:scale-98 text-white font-medium px-8 py-3 rounded-xl transition duration-200 shadow-xs cursor-pointer text-base"
          >
            Try Again
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium px-6 py-3 rounded-xl transition duration-200 cursor-pointer text-base"
          >
            Edit Notes
          </button>
        )}
      </div>

      <p className="mt-6 text-slate-400 text-sm text-center">
        Tip: add a little more detail to your topic or notes.
      </p>
    </div>
  );
};

export default ErrorState;
