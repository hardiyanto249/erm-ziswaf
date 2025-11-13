
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center h-16 sm:h-20 px-3 sm:px-6 bg-base-100 border-b border-base-300">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Risk Management Dashboard</h2>
    </header>
  );
};

export default Header;
