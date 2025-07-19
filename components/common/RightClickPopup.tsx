
import React from 'react';
import { ShieldExclamationIcon } from './Icons';

interface RightClickPopupProps {
  show: boolean;
  message: string;
}

const RightClickPopup: React.FC<RightClickPopupProps> = ({ show, message }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 pointer-events-none ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-4 p-4 bg-red-500/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 text-white">
        <ShieldExclamationIcon className="w-8 h-8" />
        <span className="font-bold text-lg">{message}</span>
      </div>
    </div>
  );
};

export default RightClickPopup;
