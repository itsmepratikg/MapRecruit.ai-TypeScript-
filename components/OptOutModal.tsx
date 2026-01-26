
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface OptOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    emails: string[];
    phones: string[];
    onSave: (selected: string[]) => void;
}

export const OptOutModal: React.FC<OptOutModalProps> = ({ isOpen, onClose, emails = [], phones = [], onSave }) => {
    const [selected, setSelected] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleSelection = (value: string) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(s => s !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    const handleSave = () => {
        onSave(selected);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-center relative">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Opt-Out</h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Emails */}
                    {emails.length > 0 && (
                        <div>
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">Email ID</h4>
                            <div className="space-y-3">
                                {emails.map((email, idx) => (
                                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(email) ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                            {selected.includes(email) && <X size={14} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selected.includes(email)}
                                            onChange={() => toggleSelection(email)}
                                        />
                                        <span className="text-slate-600 dark:text-slate-400 text-sm group-hover:text-slate-900 dark:group-hover:text-slate-100">{email}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phones */}
                    {phones.length > 0 && (
                        <div>
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">Phone Number</h4>
                            <div className="space-y-3">
                                {phones.map((phone, idx) => (
                                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(phone) ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                            {selected.includes(phone) && <X size={14} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selected.includes(phone)}
                                            onChange={() => toggleSelection(phone)}
                                        />
                                        <span className="text-slate-600 dark:text-slate-400 text-sm group-hover:text-slate-900 dark:group-hover:text-slate-100">{phone}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between gap-4 mt-6">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
