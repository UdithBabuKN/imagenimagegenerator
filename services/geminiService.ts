import { GoogleGenAI } from "@google/genai";
import type { AspectRatio, ImageSize } from '../types';

if (!process.env.API_KEY) {
    // This is a placeholder for development. The build environment must provide the API key.
    // In a real application, you might want to handle this more gracefully.
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateImage = async (prompt: string, imageSize: ImageSize): Promise<string> => {
    try {
        const config: {
            numberOfImages: number;
            outputMimeType: string;
            aspectRatio?: AspectRatio;
            width?: number;
            height?: number;
        } = {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
        };

        if (typeof imageSize === 'string') {
            config.aspectRatio = imageSize;
        } else if (typeof imageSize === 'object' && imageSize.width && imageSize.height) {
            config.width = imageSize.width;
            config.height = imageSize.height;
        }

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: config,
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated. The response was empty.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The image generation service failed. Please check the console for more details.");
    }
};
