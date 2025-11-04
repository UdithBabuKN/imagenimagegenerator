import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { AspectRatio } from '../types';

interface ImageDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  aspectRatio: AspectRatio;
  prompt: string;
}

const getAspectRatioClass = (ratio: AspectRatio) => {
  switch (ratio) {
    case '16:9': return 'aspect-[16/9]';
    case '1:1': return 'aspect-square';
    case '9:16': return 'aspect-[9/16]';
    case '4:3': return 'aspect-[4/3]';
    case '3:4': return 'aspect-[3/4]';
    default: return 'aspect-video';
  }
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  isLoading,
  generatedImage,
  error,
  aspectRatio,
  prompt
}) => {
  const aspectRatioClass = getAspectRatioClass(aspectRatio);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Generating your masterpiece...</p>
          <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-red-400 p-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">Generation Failed</p>
          <p className="text-sm text-center mt-2">{error}</p>
        </div>
      );
    }

    if (generatedImage) {
      const handleDownload = () => {
        const link = document.createElement('a');
        link.href = generatedImage;
        const filename = prompt
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // remove special characters
          .trim()
          .replace(/\s+/g, '-') // replace spaces with hyphens
          .slice(0, 50) || 'generated-image'; // limit length
        link.download = `${filename}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      return (
        <div className="relative w-full h-full group">
          <img
            src={generatedImage}
            alt={prompt}
            className="w-full h-full object-contain rounded-lg shadow-lg animate-fade-in"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <button
              onClick={handleDownload}
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              aria-label="Download generated image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-4 text-xl">Your generated image will appear here</p>
        <p className="text-sm">Fill out the form and click "Generate Image"</p>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-4xl bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center p-4 transition-all duration-300 ${aspectRatioClass}`}>
        {renderContent()}
    </div>
  );
};

export default ImageDisplay;