
import React, { useState } from 'react';
import ImageToPrompt from './ImageToPrompt';
import PromptToPrompt from './PromptToPrompt';
import { PhotoIcon, DocumentTextIcon } from './common/Icons';
import { Veo3Prompt } from '../types';

interface GeneratorProps {
  userName: string;
}

type ActiveTab = 'image' | 'prompt';

const Generator: React.FC<GeneratorProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');
  const [promptToEdit, setPromptToEdit] = useState<Veo3Prompt | null>(null);

  const handleUsePrompt = (prompt: Veo3Prompt) => {
    setPromptToEdit(prompt);
    setActiveTab('prompt');
  };

  const clearPromptToEdit = () => {
    setPromptToEdit(null);
  };

  const TabButton: React.FC<{
    tabName: ActiveTab;
    label: string;
    icon: React.ReactNode;
  }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-t-lg transition-all duration-300 ${
        activeTab === tabName
          ? 'bg-white/50 backdrop-blur-sm text-purple-700'
          : 'bg-white/20 text-purple-500 hover:bg-white/30'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Selamat Datang, {userName}!
        </h1>
        <p className="text-base text-purple-800/90 mt-2">Ayo rancang prompt video Anda selanjutnya.</p>
      </header>
      
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 overflow-hidden">
        <div className="flex">
          <TabButton tabName="image" label="Gambar ke Prompt" icon={<PhotoIcon className="w-6 h-6" />} />
          <TabButton tabName="prompt" label="Teks ke Prompt" icon={<DocumentTextIcon className="w-6 h-6" />} />
        </div>
        
        <div className="p-4 sm:p-6 md:p-8">
          {activeTab === 'image' ? (
            <ImageToPrompt onUsePrompt={handleUsePrompt} />
          ) : (
            <PromptToPrompt
              promptToEdit={promptToEdit}
              onClearPromptToEdit={clearPromptToEdit}
              onUsePrompt={handleUsePrompt}
            />
          )}
        </div>
      </div>
      
      <footer className="mt-12 text-center pb-4">
        <p className="text-sm text-purple-800/80">
          Copyright@2025 VEO 3 Prompt Generator Developer LANEXA.
        </p>
      </footer>
    </div>
  );
};

export default Generator;
