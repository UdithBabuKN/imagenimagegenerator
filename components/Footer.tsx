
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/30 border-t border-gray-700 mt-8">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400">
          Powered by Google's Gemini API.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
