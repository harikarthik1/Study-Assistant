import React from "react";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Building your study set...",
  subMessage = "StudyAI is creating questions from your notes.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full max-w-3xl mx-auto animate-fade-in">
      <span className="inline-flex items-center rounded-full bg-[#E8E5FC] px-4 py-1.5 text-xs font-bold text-[#453DD1] tracking-wider uppercase">
        GENERATING
      </span>

      <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
        {message}
      </h2>

      <p className="mt-3 text-slate-500 text-base sm:text-lg text-center max-w-md">
        {subMessage}
      </p>

      <div className="mt-8 w-full max-w-2xl rounded-2xl bg-white p-8 border border-slate-100 shadow-sm">
        <p className="text-slate-400 text-sm font-normal">
          This may take a few seconds...
        </p>
        <div className="mt-6 space-y-3">
          <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse delay-75"></div>
          <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
