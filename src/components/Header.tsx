import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 select-none">
          StudyAI
        </span>
      </div>
    </header>
  );
};

export default Header;