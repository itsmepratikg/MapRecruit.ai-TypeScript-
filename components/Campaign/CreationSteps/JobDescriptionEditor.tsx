import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTranslation } from 'react-i18next';
import { useUserPreferences } from '../../../hooks/useUserPreferences';

interface JobDescriptionEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export const JobDescriptionEditor: React.FC<JobDescriptionEditorProps> = ({ value, onChange }) => {
    const { t } = useTranslation();
    const { theme } = useUserPreferences();
    const editorRef = useRef<any>(null);

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("Job Description")}
            </label>
            <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={value}
                    onEditorChange={(content) => onChange(content)}
                    init={{
                        height: 400,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: `
                            body { 
                                font-family:Inter,Helvetica,Arial,sans-serif; 
                                font-size:14px; 
                                background-color: ${isDark ? '#0f172a' : '#ffffff'}; 
                                color: ${isDark ? '#e2e8f0' : '#1e293b'};
                            }
                        `,
                        skin: isDark ? "oxide-dark" : "oxide",
                        content_css: isDark ? "dark" : "default",
                        branding: false,
                        statusbar: false
                    }}
                />
            </div>
        </div>
    );
};
