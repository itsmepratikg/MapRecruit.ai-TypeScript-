
import React, { useState } from 'react';
import { ScreeningRound, Question } from '../../../../../types/Round';
import { Trash2, Edit2, Plus, X, Clock, CheckSquare, AlignLeft, Video, Mic, Star } from '../../../../../components/Icons';
import { ConfirmationModal } from '../../../../../components/Common/ConfirmationModal';

interface Props {
    round: ScreeningRound;
    onChange: (updates: Partial<ScreeningRound>) => void;
}

export const ScreeningQuestions: React.FC<Props> = ({ round, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const questions = round.questions || [];

    const handleAdd = () => {
        setEditingIndex(null);
        setCurrentQuestion({
            question: { text: '' },
            questionType: 'QUESTION',
            questionFormat: 'TEXT',
            responseType: 'TEXT',
            optional: false,
            durationInMinutes: 1
        });
        setIsModalOpen(true);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setCurrentQuestion({ ...questions[index] });
        setIsModalOpen(true);
    };

    const requestDelete = (index: number) => {
        setDeleteIndex(index);
    };

    const confirmDelete = () => {
        if (deleteIndex === null) return;
        const newQuestions = [...questions];
        newQuestions.splice(deleteIndex, 1);
        onChange({ questions: newQuestions });
        setDeleteIndex(null);
    };

    const handleSave = () => {
        if (!currentQuestion) return;

        const newQuestions = [...questions];
        if (editingIndex !== null) {
            newQuestions[editingIndex] = currentQuestion;
        } else {
            newQuestions.push(currentQuestion);
        }

        onChange({ questions: newQuestions });
        setIsModalOpen(false);
        setCurrentQuestion(null);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video size={16} className="text-purple-500" />;
            case 'AUDIO': return <Mic size={16} className="text-pink-500" />;
            case 'RATING': return <Star size={16} className="text-yellow-500" />;
            case 'MCQ': return <CheckSquare size={16} className="text-blue-500" />;
            default: return <AlignLeft size={16} className="text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Add Button */}
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Questions ({questions.length})
                </h3>
                <button
                    onClick={handleAdd}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                >
                    <Plus size={16} /> Add Question
                </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
                {questions.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No questions added yet.</p>
                    </div>
                )}

                {questions.map((q, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-colors group">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center mt-0.5">
                                    {idx + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                                        {q.question.text || <span className="italic text-slate-400">Empty Question</span>}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                                            {getIconForType(q.responseType)}
                                            {q.responseType}
                                        </span>
                                        {['VIDEO', 'AUDIO'].includes(q.responseType) && q.durationInMinutes && (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                                                <Clock size={12} /> {q.durationInMinutes}m limit
                                            </span>
                                        )}
                                        {q.optional && (
                                            <span className="text-[10px] text-slate-400 italic">Optional</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(idx)}
                                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => requestDelete(idx)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Logic for Modal */}
            {isModalOpen && currentQuestion && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                                {editingIndex !== null ? 'Edit Question' : 'Add Question'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Question Text */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Question Text</label>
                                <textarea
                                    value={currentQuestion.question.text}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: { ...currentQuestion.question, text: e.target.value } })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200 resize-none h-24"
                                    placeholder="What would you like to ask?"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Response Type */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Response Type</label>
                                    <select
                                        value={currentQuestion.responseType}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, responseType: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200"
                                    >
                                        <option value="TEXT">Text Answer</option>
                                        <option value="VIDEO">Video Response</option>
                                        <option value="AUDIO">Audio Response</option>
                                        <option value="RATING">Star Rating</option>
                                        <option value="MCQ">Multiple Choice</option>
                                    </select>
                                </div>

                                {/* Duration (Conditional) */}
                                {['VIDEO', 'AUDIO'].includes(currentQuestion.responseType) && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Time Limit (Mins)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={currentQuestion.durationInMinutes || 1}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, durationInMinutes: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-200"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Optional Toggle */}
                            <label className="flex items-center gap-3 cursor-pointer py-2">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={currentQuestion.optional || false}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, optional: e.target.checked })}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Optional (Candidate can skip)</span>
                            </label>

                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!currentQuestion.question.text}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
                            >
                                {editingIndex !== null ? 'Save Changes' : 'Add Question'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={deleteIndex !== null}
                onClose={() => setDeleteIndex(null)}
                onConfirm={confirmDelete}
                title="Delete Question?"
                message="Are you sure you want to delete this question? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                icon="danger"
            />
        </div>
    );
};
