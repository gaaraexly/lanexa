import React, { useState, useCallback } from 'react';
import { Veo3Prompt } from '../types';
import { generatePromptFromImage } from '../services/geminiService';
import PromptResult from './PromptResult';
import { UploadIcon, SparklesIcon } from './common/Icons';
import Spinner from './common/Spinner';

interface ImageToPromptProps {
  onUsePrompt: (prompt: Veo3Prompt) => void;
}

const ImageToPrompt: React.FC<ImageToPromptProps> = ({ onUsePrompt }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<Veo3Prompt | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setGeneratedPrompt(null);
            setError(null);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImageBase64(base64String);
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = useCallback(async () => {
        if (!imageBase64) {
            setError("Silakan unggah gambar terlebih dahulu.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedPrompt(null);

        try {
            const prompt = await generatePromptFromImage(imageBase64);
            setGeneratedPrompt(prompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg bg-white/20 h-64 overflow-hidden">
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label htmlFor="imageUpload" className={`cursor-pointer w-full h-full text-purple-700 ${!previewUrl ? 'flex flex-col items-center justify-center' : ''}`}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="flex flex-col items-center p-6 text-center">
                                <UploadIcon className="w-12 h-12 mb-2"/>
                                <span className="font-semibold">Klik untuk mengunggah gambar</span>
                                <span className="text-sm">PNG, JPG, WEBP</span>
                            </div>
                        )}
                    </label>
                </div>
                <div className="flex flex-col gap-4 items-center md:items-start">
                    <h3 className="text-2xl font-bold text-purple-800">Hasilkan dari Gambar</h3>
                    <p className="text-purple-700/90 text-center md:text-left">Unggah gambar dan biarkan AI kami membuat prompt video mendetail berdasarkan kontennya.</p>
                    <button
                        onClick={handleGenerate}
                        disabled={!imageFile || isLoading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transform transition-transform duration-300 ease-in-out"
                    >
                        {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5"/>}
                        Hasilkan Prompt
                    </button>
                </div>
            </div>

            {error && <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
            
            {generatedPrompt && (
                <div className="mt-8">
                    <PromptResult initialPrompt={generatedPrompt} onUsePrompt={onUsePrompt} />
                </div>
            )}
        </div>
    );
};

export default ImageToPrompt;