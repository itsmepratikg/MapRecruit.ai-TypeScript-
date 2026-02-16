
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from './Icons';

// --- Helper Functions ---

export const formatTimeDisplay = (val: string, format: '12h' | '24h') => {
    if (!val || val.includes('now')) return val || '';
    if (format === '24h') return val;
    try {
        const parts = val.split(':');
        if (parts.length < 2) return val;
        const h = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const period = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
    } catch (e) { return val; }
};

export const generateTimeOptions = (format: '12h' | '24h', interval = 30) => {
    const options = [];
    for (let min = 0; min < 24 * 60; min += interval) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        const hStr = h.toString().padStart(2, '0');
        const mStr = m.toString().padStart(2, '0');
        const value = `${hStr}:${mStr}`; // Always 24h for storage
        const label = formatTimeDisplay(value, format);
        options.push({ value, label });
    }
    return options;
};

export const parseTimeString = (input: string, format: '12h' | '24h'): string | null => {
    if (!input) return null;

    if (format === '24h') {
        const match = input.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (match) return `${match[1].padStart(2, '0')}:${match[2]}`;
        return null;
    } else {
        const match = input.match(/^([0-1]?[0-9]):([0-5][0-9])\s?(AM|PM|am|pm)$/i);
        if (match) {
            let h = parseInt(match[1]);
            const m = match[2];
            const period = match[3].toUpperCase();
            if (h === 12) h = 0;
            if (period === 'PM') h += 12;
            return `${h.toString().padStart(2, '0')}:${m}`;
        }
        return null;
    }
};

// --- Component ---

interface TimePickerProps {
    value: string;
    onChange: (val: string) => void;
    format: '12h' | '24h';
    disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
    value,
    onChange,
    format,
    disabled
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(formatTimeDisplay(value, format));
    }, [value, format]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                // Validate on close
                const display = formatTimeDisplay(value, format);
                if (inputValue !== display) {
                    const parsed = parseTimeString(inputValue, format);
                    if (parsed) onChange(parsed);
                    else setInputValue(display);
                }
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [inputValue, value, format]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        const parsed = parseTimeString(inputValue, format);
        if (parsed) {
            onChange(parsed);
            setInputValue(formatTimeDisplay(parsed, format));
        } else {
            setInputValue(formatTimeDisplay(value, format));
        }
    };

    const options = generateTimeOptions(format, 30);

    return (
        <div className="relative w-32" ref={containerRef}>
            <div className={`relative border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500'}`}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onFocus={() => !disabled && setIsOpen(true)}
                    disabled={disabled}
                    className="w-full p-2 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200"
                    placeholder={format === '12h' ? "09:00 AM" : "09:00"}
                />
                <button
                    className="pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    type="button"
                >
                    <ChevronDown size={14} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 custom-scrollbar">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`px-3 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-slate-700 dark:text-slate-200 ${opt.value === value ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
