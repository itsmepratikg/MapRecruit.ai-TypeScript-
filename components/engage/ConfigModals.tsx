
import React, { useState, useMemo } from 'react';
import {
  Edit3, Trash2, PlusCircle, Layout, Settings, Zap, X
} from 'lucide-react';
import { MOCK_QUESTIONS_DATA } from '../../data';
import { EngageNode } from '../../types';
import { AutomationConfig } from './AutomationConfig';
import { AnnouncementConfig, TemplatePreviewPanel } from './rounds/AnnouncementConfig';

export const AutomationPlaceholderModal = ({ onClose, isEnabled, onToggle }: { onClose: () => void, isEnabled: boolean, onToggle: (val: boolean) => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Zap size={20} className={isEnabled ? "text-green-600 dark:text-green-400" : "text-slate-400"} />
            {isEnabled ? 'Edit Automation' : 'Configure Automation'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20} /></button>
        </div>

        <AutomationConfig isEnabled={isEnabled} onToggle={onToggle} />
      </div>
    </div>
  );
};

export const QuestionsPanel = ({ config, onUpdate }: any) => {
  const selectedIds = config.questions || [];

  const toggleQuestion = (id: string) => {
    if (selectedIds.includes(id)) {
      onUpdate({ ...config, questions: selectedIds.filter((q: string) => q !== id) });
    } else {
      onUpdate({ ...config, questions: [...selectedIds, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-700 dark:text-slate-300">Screening Questions</h3>
        <button className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300">
          <PlusCircle size={16} /> Add Question
        </button>
      </div>
      <div className="space-y-4">
        {MOCK_QUESTIONS_DATA.map((q, i) => (
          <div key={q.id}
            onClick={() => toggleQuestion(q.id)}
            className={`border rounded-lg p-4 transition-colors cursor-pointer bg-white dark:bg-slate-800 ${selectedIds.includes(q.id) ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Question {i + 1}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                {selectedIds.includes(q.id) && <Edit3 size={10} className="hidden" />} {/* Mock checkmark logic via CSS or icon */}
                {selectedIds.includes(q.id) && <span className="text-xs">✓</span>}
              </div>
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm mb-3">{q.questionText}</p>
            <div className="flex gap-2 text-xs">
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">{q.responseType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TemplateManager = ({ nodeType, config, onUpdate }: any) => {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4 flex items-start gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg"><Layout size={20} /></div>
        <div>
          <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Template Configuration</h4>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Select or customize the template used for this step.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selected Template</label>
          <select
            className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={config.templateId || ''}
            onChange={(e) => onUpdate({ ...config, templateId: e.target.value })}
          >
            <option value="">Select a template...</option>
            <option value="t1">Standard Screening Template</option>
            <option value="t2">Technical Assessment (React)</option>
            <option value="t3">Behavioral Interview Guide</option>
          </select>
        </div>

        {config.templateId && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Template Preview</h5>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Edit Template</button>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const NodeConfigurationModal = ({ node, onClose, onSave }: { node: EngageNode, onClose: () => void, onSave: (node: EngageNode) => void }) => {
  const [roundName, setRoundName] = useState(node.title);
  const [nodeConfig, setNodeConfig] = useState(node.data.config || {});
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const tabs = useMemo(() => {
    if (node.type === 'ANNOUNCEMENT') return ['Template Configuration'];
    if (node.type === 'INTERVIEW') return ['Templates', 'Interview Details'];
    return ['Questionnaire', 'Templates'];
  }, [node.type]);

  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className={`h-full bg-white dark:bg-slate-800 shadow-2xl w-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 transition-all ${previewTemplateId ? 'max-w-[85vw]' : 'max-w-2xl'}`}>
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start bg-white dark:bg-slate-800 shrink-0">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-3">
              Configure Round
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-600 tracking-wide uppercase">{node.type}</span>
            </h2>
            <div className="max-w-md">
              <input
                type="text"
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Round Name"
              />
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Only show tabs if it's NOT an announcement (Announcement has custom internal layout) */}
        {node.type !== 'ANNOUNCEMENT' && (
          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex gap-1 p-1 bg-slate-200/60 dark:bg-slate-700/60 rounded-lg w-fit">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-600 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'}`}>{tab}</button>
              ))}
            </div>
          </div>
        )}

        {/* Content Body - Split View Supported */}
        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 flex flex-col min-w-0 ${previewTemplateId ? 'border-r border-slate-200 dark:border-slate-700' : ''}`}>
            {node.type === 'ANNOUNCEMENT' ? (
              <div className="flex-1 overflow-hidden h-full">
                <AnnouncementConfig config={nodeConfig} onChange={setNodeConfig} onPreview={setPreviewTemplateId} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-slate-800">
                {activeTab === 'Questionnaire' ? <QuestionsPanel config={nodeConfig} onUpdate={setNodeConfig} /> : activeTab === 'Templates' ? <div className="max-w-3xl mx-auto"><TemplateManager nodeType={node.type} config={nodeConfig} onUpdate={setNodeConfig} /></div> : <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/30 dark:bg-slate-700/30"><Settings size={32} className="text-indigo-200 dark:text-indigo-800 mb-4" /><p className="text-sm">Configuration for {activeTab}</p></div>}
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          {previewTemplateId && (
            <div className="w-[450px] flex flex-col bg-slate-50 dark:bg-slate-900 shrink-0 animate-in slide-in-from-right duration-300">
              <TemplatePreviewPanel onClose={() => setPreviewTemplateId(null)} />
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-3 shrink-0 z-20">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => onSave({ ...node, title: roundName, data: { ...node.data, config: nodeConfig } })} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all transform active:scale-95">Save Changes</button>
        </div>
      </div>
    </div>
  );
};
