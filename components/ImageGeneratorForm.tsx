import React from 'react';
import type { AspectRatio, ImageSize } from '../types';

interface ImageGeneratorFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const presetOptions: { value: AspectRatio; label: string; platforms: string; icon: React.ReactNode }[] = [
  { value: '16:9', label: '16:9', platforms: 'YouTube, Facebook', icon: <div className="w-8 h-[18px] bg-gray-500 rounded-sm"></div> },
  { value: '1:1', label: '1:1', platforms: 'Instagram Post', icon: <div className="w-6 h-6 bg-gray-500 rounded-sm"></div> },
  { value: '9:16', label: '9:16', platforms: 'Instagram Story', icon: <div className="w-[18px] h-8 bg-gray-500 rounded-sm"></div> },
  { value: '4:3', label: '4:3', platforms: 'Standard Photo', icon: <div className="w-8 h-6 bg-gray-500 rounded-sm"></div> },
  { value: '3:4', label: '3:4', platforms: 'Pinterest, Mobile', icon: <div className="w-6 h-8 bg-gray-500 rounded-sm"></div> },
];

const customOption = {
  value: 'custom' as const,
  label: 'Custom',
  platforms: 'Enter W x H',
  icon: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const AspectRatioButton: React.FC<{
  option: (typeof presetOptions)[0] | typeof customOption;
  isSelected: boolean;
  onClick: () => void;
}> = ({ option, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Select aspect ratio ${option.label}`}
      className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 border-2 h-full ${
        isSelected
          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
          : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 text-gray-300'
      }`}
    >
      {option.icon}
      <span className="text-sm font-semibold mt-2">{option.label}</span>
      <span className="text-xs text-gray-400 text-center leading-tight mt-1">{option.platforms}</span>
    </button>
);


const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({
  prompt,
  setPrompt,
  imageSize,
  setImageSize,
  onSubmit,
  isLoading,
}) => {
  const isCustom = typeof imageSize === 'object';
  const selectedOption = isCustom ? 'custom' : imageSize;

  const handleOptionClick = (option: AspectRatio | 'custom') => {
    if (option === 'custom') {
      if (!isCustom) {
        setImageSize({ width: 1920, height: 1080 });
      }
    } else {
      setImageSize(option);
    }
  };

  const handleCustomDimensionChange = (dimension: 'width' | 'height', value: string) => {
    if (!isCustom) return;

    const numericValue = parseInt(value, 10) || 64;
    const clampedValue = Math.max(64, Math.min(4096, numericValue));

    setImageSize({
      ...imageSize,
      [dimension]: clampedValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-2xl space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Image Prompt
        </label>
        <textarea
          id="prompt"
          rows={5}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          placeholder="e.g., A majestic lion wearing a crown..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presetOptions.map((option) => (
            <AspectRatioButton
                key={option.value}
                option={option}
                isSelected={selectedOption === option.value}
                onClick={() => handleOptionClick(option.value)}
             />
          ))}
           <AspectRatioButton
                key={customOption.value}
                option={customOption}
                isSelected={selectedOption === 'custom'}
                onClick={() => handleOptionClick('custom')}
            />
        </div>
        {isCustom && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg animate-fade-in">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Custom Dimensions</h3>
            <div className="flex items-center space-x-2">
              <input 
                type="number"
                aria-label="Custom width"
                value={imageSize.width}
                onChange={(e) => handleCustomDimensionChange('width', e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                min="64"
                max="4096"
                disabled={isLoading}
              />
              <span className="text-gray-400 font-bold">x</span>
              <input 
                type="number"
                aria-label="Custom height"
                value={imageSize.height}
                onChange={(e) => handleCustomDimensionChange('height', e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                min="64"
                max="4096"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Dimensions must be between 64 and 4096px.
            </p>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-500"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Image'
        )}
      </button>
    </form>
  );
};

export default ImageGeneratorForm;