
import React, { useRef } from 'react';
import {
    Bold, Italic, Underline, List, Link as LinkIcon, AlignLeft,
    AlignCenter, AlignRight
} from './Icons';

interface Props {
    value: string;
    onChange: (val: string) => void;
    label: string;
    placeholder?: string;
    disabled?: boolean;
}

export const RichTextEditor: React.FC<Props> = ({
    value,
    onChange,
    label,
    placeholder,
    disabled
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tag: string, startTag: string, endTag: string) => {
        if (disabled || !textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${startTag}${selection}${endTag}${after}`;

        onChange(newText);

        // Restore focus and selection (roughly)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + startTag.length, end + startTag.length);
        }, 0);
    };

    return (
        <div className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 transition-all ${disabled ? 'opacity-60 pointer-events-none bg-slate-50 dark:bg-slate-900' : 'focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'}`}>
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{label}</label>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => insertTag('b', '<b>', '</b>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><Bold size={14} /></button>
                    <button type="button" onClick={() => insertTag('i', '<i>', '</i>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><Italic size={14} /></button>
                    <button type="button" onClick={() => insertTag('u', '<u>', '</u>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><Underline size={14} /></button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button type="button" onClick={() => insertTag('left', '<div style="text-align:left">', '</div>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><AlignLeft size={14} /></button>
                    <button type="button" onClick={() => insertTag('center', '<div style="text-align:center">', '</div>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><AlignCenter size={14} /></button>
                    <button type="button" onClick={() => insertTag('right', '<div style="text-align:right">', '</div>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><AlignRight size={14} /></button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button type="button" onClick={() => insertTag('ul', '<ul>\n<li>', '</li>\n</ul>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><List size={14} /></button>
                    <button type="button" onClick={() => insertTag('a', '<a href="#">', '</a>')} className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><LinkIcon size={14} /></button>
                </div>
            </div>
            <textarea
                ref={textareaRef}
                className="w-full h-40 p-4 text-sm bg-transparent outline-none resize-none dark:text-slate-200 placeholder:text-slate-400 font-mono custom-scrollbar"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
            ></textarea>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
                <span>HTML Mode Available</span>
                <span>{value.length} chars</span>
            </div>
        </div>
    );
};
