import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 select-none hover:opacity-90 transition"
        >
          StudyAI
        </Link>
      </div>
    </header>
  );
};

export default Header;