
import React from 'react';
import { X, Construction } from 'lucide-react';

interface PlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const PlaceholderModal: React.FC<PlaceholderModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                <Construction size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {message}
            </p>
            <button 
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
                Got it
            </button>
        </div>
      </div>
    </div>
  );
};
