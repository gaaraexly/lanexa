import React from 'react';
import { FilmIcon, SparklesIcon } from './common/Icons';

interface WelcomeProps {
  onGetStarted: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="p-8 md:p-12 bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-6">
          <FilmIcon className="w-16 h-16 text-pink-500" />
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Veo3 Prompt
          </h1>
        </div>
        <p className="text-lg md:text-xl text-purple-800/80 mb-8">
          Buat prompt video yang menakjubkan dan mendetail untuk Veo3 dengan mudah. Ubah ide atau gambar Anda menjadi instruksi sinematik dengan kekuatan AI.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onGetStarted}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out"
          >
            <SparklesIcon className="w-6 h-6" />
            Mulai
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;