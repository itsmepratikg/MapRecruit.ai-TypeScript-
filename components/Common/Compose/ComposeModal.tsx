
import React, { useState } from 'react';
import { Mail, MessageSquare, Lock, X } from '../../Icons';
import { ComposeEmail } from './ComposeEmail';
import { ComposeSMS } from './ComposeSMS';
import { ComposeNote } from './ComposeNote';

type ComposeType = 'MENU' | 'EMAIL' | 'SMS' | 'NOTE';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (type: 'Email' | 'SMS' | 'Note', content: string, subject?: string, isPrivate?: boolean) => void;
}

export const ComposeModal = ({ isOpen, onClose, onSend }: ComposeModalProps) => {
  const [step, setStep] = useState<ComposeType>('MENU');

  if (!isOpen) return null;

  const handleBack = () => {
      setStep('MENU');
  };

  const handleClose = () => {
      setStep('MENU');
      onClose();
  };

  const renderContent = () => {
      switch (step) {
          case 'EMAIL':
              return <ComposeEmail onBack={handleBack} onSend={(data) => { onSend('Email', data.content, data.subject); handleClose(); }} />;
          case 'SMS':
              return <ComposeSMS onBack={handleBack} onSend={(data) => { onSend('SMS', data.content); handleClose(); }} />;
          case 'NOTE':
              return <ComposeNote onBack={handleBack} onSend={(data) => { onSend('Note', data.content, undefined, data.isPrivate); handleClose(); }} />;
          default:
              return (
                  <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Compose</h2>
                          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                              <X size={24} />
                          </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                          <button 
                            onClick={() => setStep('EMAIL')}
                            className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:shadow-md transition-all text-left"
                          >
                              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <Mail size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400">Email</h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">Send a formal message with subject line.</p>
                              </div>
                          </button>

                          <button 
                            onClick={() => setStep('SMS')}
                            className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10 hover:shadow-md transition-all text-left"
                          >
                              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <MessageSquare size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-green-600 dark:group-hover:text-green-400">SMS</h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">Quick text message to mobile number.</p>
                              </div>
                          </button>

                          <button 
                            onClick={() => setStep('NOTE')}
                            className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 hover:shadow-md transition-all text-left"
                          >
                              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <Lock size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400">Internal Note</h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">Private log for you and your team.</p>
                              </div>
                          </button>
                      </div>
                  </div>
              );
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md h-[600px] max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col relative">
          {renderContent()}
      </div>
    </div>
  );
};
