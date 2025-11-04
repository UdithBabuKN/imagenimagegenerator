import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';
import type { ImageSize } from './types';
import Header from './components/Header';
import ImageGeneratorForm from './components/ImageGeneratorForm';
import ImageDisplay from './components/ImageDisplay';
import Footer from './components/Footer';

function App() {
  const [prompt, setPrompt] = useState<string>('A photorealistic image of a futuristic city skyline at dusk, with flying vehicles and neon lights.');
  const [imageSize, setImageSize] = useState<ImageSize>('16:9');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, imageSize);
      setGeneratedImage(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, imageSize]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
          <ImageGeneratorForm
            prompt={prompt}
            setPrompt={setPrompt}
            imageSize={imageSize}
            setImageSize={setImageSize}
            onSubmit={handleGenerateImage}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-2/3 xl:w-3/4 flex-grow flex items-center justify-center">
          <ImageDisplay
            isLoading={isLoading}
            generatedImage={generatedImage}
            error={error}
            imageSize={imageSize}
            prompt={prompt}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
