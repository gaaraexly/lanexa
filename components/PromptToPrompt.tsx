import React, { useState, useCallback, useEffect } from 'react';
import { Veo3Prompt } from '../types';
import { PROMPT_STRUCTURE, INITIAL_PROMPT } from '../constants';
import { expandPromptFromText } from '../services/geminiService';
import PromptResult from './PromptResult';
import Spinner from './common/Spinner';
import { SparklesIcon } from './common/Icons';

const TextAreaInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 2 }) => (
    <div>
        <label className="block text-sm font-medium text-purple-800 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 bg-white/50 border border-purple-200 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-400 transition resize-y"
        />
    </div>
);

interface PromptToPromptProps {
  promptToEdit: Veo3Prompt | null;
  onClearPromptToEdit: () => void;
  onUsePrompt: (prompt: Veo3Prompt) => void;
}

const PromptToPrompt: React.FC<PromptToPromptProps> = ({ promptToEdit, onClearPromptToEdit }) => {
    const [inputPrompt, setInputPrompt] = useState<Partial<Veo3Prompt>>(INITIAL_PROMPT);
    const [generatedPrompt, setGeneratedPrompt] = useState<Veo3Prompt | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (promptToEdit) {
            setInputPrompt(promptToEdit);
            onClearPromptToEdit();
        }
    }, [promptToEdit, onClearPromptToEdit]);

    const placeholders = {
        promptVideo: "Contoh: Video sinematik hyper-realistic seekor rubah kutub berburu di tengah badai salju di malam hari.",
        pembukaanKonsep: "Contoh: Menunjukkan perjuangan dan ketahanan hidup di alam liar yang paling ekstrem.",
        adegan: "Contoh: Seekor rubah kutub dengan bulu putih tebal bergerak diam-diam di antara tumpukan salju, matanya bersinar terkena cahaya bulan.",
        subjek: "Contoh: Rubah kutub yang gesit dan waspada, bulunya tertutup butiran salju.",
        aksi: "Contoh: Rubah tiba-tiba melompat tinggi dan menukikkan kepalanya ke dalam salju untuk menangkap mangsa.",
        lingkungan: "Contoh: Lanskap tundra Arktik yang luas di malam hari, badai salju lebat, cahaya bulan samar-samar menembus awan.",
        pencahayaan: "Contoh: Pencahayaan malam yang dramatis dan moody, dengan cahaya rembulan yang dingin sebagai sumber utama.",
        suasanaHati: "Contoh: Tegang, intens, sunyi, misterius, dan dramatis.",
        kalimatYangDiucapkan: "Contoh: (Hanya suara alam: desiran angin kencang dan deru salju)",
        promptNegatif: "Contoh: Siang hari, cerah, hangat, gambar kartun, rubah yang bersahabat, kualitas rendah.",
        saranTambahan: {
            sudutKamera: "Contoh: Low angle shot mengikuti rubah, close-up pada matanya, high-angle shot saat ia melompat.",
            pergerakanKamera: "Contoh: Gerakan kamera genggam yang sedikit goyah, slow-motion saat rubah menukik.",
            transisi: "Contoh: Hard cut ke adegan yang berbeda, fade to black di akhir.",
            musikLatar: "Contoh: Musik ambient yang menegangkan dengan nada rendah, tanpa melodi.",
            efekVisual: "Contoh: Partikel salju yang beterbangan ditiup angin, efek vignette tipis untuk memfokuskan perhatian."
        }
    };
    
    const rowCounts = {
        promptVideo: 4,
        pembukaanKonsep: 3,
        adegan: 4,
        subjek: 3,
        aksi: 4,
        lingkungan: 4,
        pencahayaan: 4,
        suasanaHati: 3,
        kalimatYangDiucapkan: 2,
        promptNegatif: 3,
        saranTambahan: {
            sudutKamera: 4,
            pergerakanKamera: 3,
            transisi: 3,
            musikLatar: 3,
            efekVisual: 4,
        }
    };

    const handleInputChange = (field: keyof Omit<Veo3Prompt, 'saranTambahan'>, value: string) => {
        setInputPrompt(prev => ({ ...prev, [field]: value }));
    };

    const handleSaranChange = (field: keyof Veo3Prompt['saranTambahan'], value: string) => {
        setInputPrompt(prev => ({
            ...prev,
            saranTambahan: {
                ...(prev.saranTambahan || INITIAL_PROMPT.saranTambahan),
                [field]: value
            },
        }));
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt(null);
        try {
            const prompt = await expandPromptFromText(inputPrompt);
            setGeneratedPrompt(prompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [inputPrompt]);

    return (
        <div>
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-purple-800">Hasilkan dari Teks</h3>
                <p className="text-purple-700/90">Isi ide-ide Anda, dan AI kami akan mengembangkannya menjadi prompt yang lengkap dan mendetail.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {Object.entries(PROMPT_STRUCTURE).map(([key, value]) => {
                    if (key !== 'saranTambahan') {
                        const typedKey = key as keyof Omit<Veo3Prompt, 'saranTambahan'>;
                        return (
                            <TextAreaInput
                                key={key}
                                label={value as string}
                                value={inputPrompt[typedKey] || ''}
                                onChange={(val) => handleInputChange(typedKey, val)}
                                placeholder={placeholders[typedKey]}
                                rows={rowCounts[typedKey]}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            <details className="mb-6">
                <summary className="cursor-pointer font-semibold text-purple-800">Saran Tambahan untuk Video (Opsional)</summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4 p-4 bg-white/20 rounded-lg">
                    {Object.entries(PROMPT_STRUCTURE.saranTambahan).map(([key, value]) => {
                        const typedKey = key as keyof Veo3Prompt['saranTambahan'];
                        return (
                            <TextAreaInput
                                key={key}
                                label={value}
                                value={inputPrompt.saranTambahan?.[typedKey] || ''}
                                onChange={(val) => handleSaranChange(typedKey, val)}
                                placeholder={placeholders.saranTambahan[typedKey]}
                                rows={rowCounts.saranTambahan[typedKey]}
                            />
                        );
                    })}
                </div>
            </details>

            <div className="text-center">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-auto mx-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transform transition-transform duration-300 ease-in-out"
                >
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5"/>}
                    Hasilkan Prompt
                </button>
            </div>

            {error && <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
            
            {generatedPrompt && (
                <div className="mt-8">
                    <PromptResult initialPrompt={generatedPrompt} />
                </div>
            )}
        </div>
    );
};

export default PromptToPrompt;