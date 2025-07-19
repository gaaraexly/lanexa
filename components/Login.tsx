import React, { useState } from 'react';
import { UserIcon, ArrowRightIcon } from './common/Icons';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        onLogin(name.trim());
      }, 1800); // Match animation duration
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative">
      <div 
        className={`w-full max-w-md transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="p-8 md:p-12 bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 w-full">
          <div className="flex justify-center items-center gap-3 mb-6">
            <UserIcon className="w-10 h-10 text-purple-600" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Siapa Nama Anda?
            </h2>
          </div>
          <p className="text-center text-purple-800/80 mb-6">
            Mari berkenalan sebelum kita mulai berkreasi!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda..."
              className="w-full px-4 py-3 bg-white/50 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!name.trim() || isAnimating}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transform transition-transform duration-300 ease-in-out"
            >
              Mulai Berkreasi <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {isAnimating && (
        <div className="absolute left-1/2 -translate-x-1/2 animate-launch">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              VEO 3
            </h1>
        </div>
      )}
    </div>
  );
};

export default Login;