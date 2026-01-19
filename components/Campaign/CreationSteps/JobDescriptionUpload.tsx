import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';

interface JobDescriptionUploadProps {
    onFileSelect: (file: File) => void;
}

const MAX_SIZE_MB = 2;
const ACCEPTED_FORMATS = [
    '.doc', '.docx', '.pdf', '.rtf', '.txt', '.odt', '.ott', '.htm', '.html'
];

export const JobDescriptionUpload: React.FC<JobDescriptionUploadProps> = ({ onFileSelect }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = (file: File) => {
        setError(null);
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(t("File size exceeds 2MB limit"));
            return false;
        }

        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ACCEPTED_FORMATS.includes(extension)) {
            setError(t("Invalid file format"));
            return false;
        }

        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (validateFile(file)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (validateFile(file)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div
                className={`border-2 border-dashed rounded-xl p-8 transition-colors text-center ${isDragging
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                        : error
                            ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50 dark:bg-slate-900/50'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={ACCEPTED_FORMATS.join(',')}
                    onChange={handleFileChange}
                />

                {selectedFile ? (
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <FileText size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <UploadCloud size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                <span
                                    className="text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {t("Click to upload")}
                                </span>
                                {' '}{t("or drag and drop")}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                DOC, DOCX, PDF, RTF, TXT, HTML (Max 2MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2 animate-in fade-in">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
        </div>
    );
};
