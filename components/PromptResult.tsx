
import React, { useState, useEffect, useCallback } from 'react';
import { Veo3Prompt, DetailedEngPrompt } from '../types';
import { translatePrompt, generateDetailedEngPrompt } from '../services/geminiService';
import Spinner from './common/Spinner';
import { CopyIcon, CheckIcon, ArrowUturnLeftIcon, StarIcon, LockClosedIcon } from './common/Icons';

interface PromptResultProps {
  initialPrompt: Veo3Prompt;
  onUsePrompt?: (prompt: Veo3Prompt) => void;
}

const PromptResult: React.FC<PromptResultProps> = ({ initialPrompt, onUsePrompt }) => {
    const [editablePrompt, setEditablePrompt] = useState<Veo3Prompt>(initialPrompt);
    const [translatedPrompt, setTranslatedPrompt] = useState<Veo3Prompt | null>(null);
    const [detailedEngPrompt, setDetailedEngPrompt] = useState<DetailedEngPrompt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [detailedCopySuccess, setDetailedCopySuccess] = useState(false);
    const [isPremiumLocked, setIsPremiumLocked] = useState(true);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const generateAllPrompts = useCallback(async () => {
        setIsLoading(true);
        setTranslatedPrompt(null);
        setDetailedEngPrompt(null);
        try {
            const [translation, detailed] = await Promise.all([
                translatePrompt(editablePrompt),
                generateDetailedEngPrompt(editablePrompt)
            ]);
            setTranslatedPrompt(translation);
            setDetailedEngPrompt(detailed);
        } catch (error) {
            console.error("Failed to generate final prompts:", error);
            // Optionally, set an error state to show a message to the user
        } finally {
            setIsLoading(false);
        }
    }, [editablePrompt]);
    
    useEffect(() => {
        setEditablePrompt(initialPrompt);
        setIsPremiumLocked(true);
        setPasswordInput('');
        setPasswordError('');
        generateAllPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPrompt]);
    
    const handleUnlockAttempt = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === 'larenva') {
            setIsPremiumLocked(false);
            setPasswordError('');
        } else {
            setPasswordError('Kata sandi salah. Silakan coba lagi.');
            setPasswordInput('');
        }
    };

    const copyToClipboard = () => {
        if (!translatedPrompt) return;

        const sections = [
            `Prompt Video: ${translatedPrompt.promptVideo}`,
            `Concept Opening: ${translatedPrompt.pembukaanKonsep}`,
            `Scene: ${translatedPrompt.adegan}`,
            `Subject: ${translatedPrompt.subjek}`,
            `Action: ${translatedPrompt.aksi}`,
            `Environment: ${translatedPrompt.lingkungan}`,
            `Lighting: ${translatedPrompt.pencahayaan}`,
            `Mood: ${translatedPrompt.suasanaHati}`,
            `Spoken Lines: ${translatedPrompt.kalimatYangDiucapkan}`,
            `Negative Prompt: ${translatedPrompt.promptNegatif}`,
            `\n--- Additional Suggestions for Video ---`,
            `Camera Angle: ${translatedPrompt.saranTambahan.sudutKamera}`,
            `Camera Movement: ${translatedPrompt.saranTambahan.pergerakanKamera}`,
            `Transitions: ${translatedPrompt.saranTambahan.transisi}`,
            `Background Music: ${translatedPrompt.saranTambahan.musikLatar}`,
            `Visual Effects: ${translatedPrompt.saranTambahan.efekVisual}`,
        ];
        
        navigator.clipboard.writeText(sections.join('\n'));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };
    
    const copyDetailedToClipboard = () => {
        if (!detailedEngPrompt) return;

        const detailedLabels: { [key in keyof DetailedEngPrompt]?: string } = {
            subjek: "Subject",
            aksi: "Action",
            tempat: "Place",
            gayaVideo: "Video Style",
            suasanaVideo: "Video Mood",
        };
        
        const previewKeys: Array<keyof DetailedEngPrompt> = ['subjek', 'aksi', 'tempat', 'gayaVideo', 'suasanaVideo'];

        const textToCopy = previewKeys
            .filter(key => detailedEngPrompt[key])
            .map(key => `${detailedLabels[key]}: ${detailedEngPrompt[key]}`)
            .join('\n');

        navigator.clipboard.writeText(textToCopy);
        setDetailedCopySuccess(true);
        setTimeout(() => setDetailedCopySuccess(false), 2000);
    };
    
    const renderSection = (prompt: Veo3Prompt) => {
      const langLabels = {
          promptVideo: "Video Prompt",
          pembukaanKonsep: "Concept Opening",
          adegan: "Scene",
          subjek: "Subject",
          aksi: "Action",
          lingkungan: "Environment",
          pencahayaan: "Lighting",
          suasanaHati: "Mood",
          kalimatYangDiucapkan: "Spoken Lines",
          promptNegatif: "Negative Prompt",
      };

      return Object.entries(prompt)
        .filter(([key]) => key !== 'saranTambahan' && langLabels.hasOwnProperty(key))
        .map(([key, value]) => (
          <div key={key} className="mb-4">
            <h4 className="font-bold text-purple-800">{langLabels[key as keyof typeof langLabels] as string}</h4>
            <p className="mt-1 p-2 bg-white/10 rounded-md text-purple-900/90">{value as string}</p>
          </div>
        ));
    };

    const renderSaranSection = (prompt: Veo3Prompt) => {
        const langLabels = {
            sudutKamera: "Camera Angle",
            pergerakanKamera: "Camera Movement",
            transisi: "Transitions",
            musikLatar: "Background Music",
            efekVisual: "Visual Effects",
        };
        return Object.entries(prompt.saranTambahan).map(([key, value]) => (
            <div key={key} className="mb-4">
              <h4 className="font-bold text-purple-800">{langLabels[key as keyof typeof langLabels]}</h4>
              <p className="mt-1 p-2 bg-white/10 rounded-md text-purple-900/90">{value as string}</p>
            </div>
          ));
    };

    const renderDetailedSection = () => {
        if (!detailedEngPrompt) return null;
        
        const detailedLabels: { [key in keyof DetailedEngPrompt]: string } = {
            subjek: "Subject",
            aksi: "Action",
            ekspresi: "Expression",
            tempat: "Place",
            waktu: "Time",
            gerakanKamera: "Camera Movement",
            pencahayaan: "Lighting",
            gayaVideo: "Video Style",
            suasanaVideo: "Video Mood",
            suaraAtauMusik: "Sound or Music",
            kalimatYangDiucapkan: "Spoken Lines",
            detailTambahan: "Additional Details",
        };

        const previewKeys: Array<keyof DetailedEngPrompt> = ['subjek', 'aksi', 'tempat', 'gayaVideo', 'suasanaVideo'];

        return (
            <div className="space-y-3">
                {previewKeys.map((key) => (
                    detailedEngPrompt[key] && (
                        <div key={key}>
                            <p className="text-sm font-semibold text-purple-800">{detailedLabels[key]}</p>
                            <p className="mt-1 p-2 text-sm bg-white/10 rounded-md text-purple-900/90 whitespace-pre-wrap">{detailedEngPrompt[key]}</p>
                        </div>
                    )
                ))}
                 <div className="mt-4 pt-4 border-t border-purple-300/50 text-center">
                    <p className="text-sm text-purple-800 font-semibold">
                        ... dan lebih banyak lagi!
                    </p>
                    <p className="text-xs text-purple-700/80 mt-1">
                        Buka <span className="font-bold">Prompt Premium</span> untuk mendapatkan versi lengkap dan sangat detail.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                {isPremiumLocked ? (
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                            <h3 className="font-bold text-lg text-purple-800">Prompt Premium Terstruktur Lengkap, Konsisten Karakter dan Sangat Detail.</h3>
                        </div>
                        <p className="text-purple-700/90 mb-4">Fitur ini terkunci. Masukkan kata sandi untuk membukanya.</p>
                        <form onSubmit={handleUnlockAttempt} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Masukkan kata sandi..."
                                className="w-full px-3 py-2 bg-white/50 border border-purple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400 transition"
                                aria-label="Password for premium prompt"
                            />
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                            >
                                <LockClosedIcon className="w-5 h-5" />
                                Buka
                            </button>
                        </form>
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-purple-800">Prompt Final (Bahasa Inggris)</h3>
                            <div className="flex items-center gap-2">
                                {onUsePrompt && (
                                    <button
                                        onClick={() => onUsePrompt(editablePrompt)}
                                        className="flex items-center justify-center gap-2 px-3 py-1.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition text-sm text-center"
                                    >
                                        <ArrowUturnLeftIcon className="w-5 h-5 flex-shrink-0" />
                                        <span className="flex-grow">Gunakan prompt ini untuk di edit kembali</span>
                                    </button>
                                )}
                                <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition text-sm">
                                    {copySuccess ? <CheckIcon className="w-5 h-5"/> : <CopyIcon className="w-5 h-5"/>}
                                    {copySuccess ? 'Tersalin!' : 'Salin'}
                                </button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48"><Spinner /></div>
                        ) : translatedPrompt && (
                            <div>
                                {renderSection(translatedPrompt)}
                                <h3 className="text-lg font-bold text-purple-800 mt-6 mb-2">Saran Tambahan</h3>
                                {renderSaranSection(translatedPrompt)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-purple-800">Prompt Terperinci (Bahasa Inggris)</h3>
                    {!isLoading && detailedEngPrompt && (
                        <button onClick={copyDetailedToClipboard} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-sm">
                            {detailedCopySuccess ? <CheckIcon className="w-5 h-5"/> : <CopyIcon className="w-5 h-5"/>}
                            {detailedCopySuccess ? 'Tersalin!' : 'Salin Cuplikan'}
                        </button>
                    )}
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-96"><Spinner /></div>
                ) : (
                    renderDetailedSection()
                )}
            </div>
        </div>
    );
};

export default PromptResult;
