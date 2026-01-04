
import React, { useState } from 'react';
import { 
  Mail, MessageSquare, Clock, Repeat, Plus, Trash2, GitBranch, Layers, CheckSquare, Square, ArrowDown, Split, ChevronDown, ChevronUp, FileText, X, User
} from 'lucide-react';
import { TemplateSection } from './TemplateSection';

interface AnnouncementConfigProps {
  config: any;
  onChange: (newConfig: any) => void;
  onPreview?: (id: string | null) => void;
}

const APP_TYPES = ['Internal Sourcing', 'External Sourcing'];
const APP_METHODS = ['Active Sourcing', 'Passive Sourcing'];

// Dummy Preview Component - Exported for Layout use
export const TemplatePreviewPanel = ({ onClose }: { onClose: () => void }) => (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
        <div className="h-[57px] flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                <FileText size={16} className="text-indigo-600 dark:text-indigo-400" /> Template Preview
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={18} />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50 dark:bg-slate-900/50 custom-scrollbar">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mx-auto max-w-sm">
                {/* Email Header */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="h-2.5 bg-slate-300 dark:bg-slate-600 rounded w-24 mb-1.5"></div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        </div>
                        <div className="text-xs text-slate-400">Just now</div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                    </div>
                </div>
                
                {/* Email Body */}
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </div>
                    
                    <div className="py-2">
                        <div className="h-32 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2">
                            <FileText size={24} className="opacity-50" />
                            <span className="text-xs font-medium">Dynamic Content Area</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                    
                    <div className="pt-6 mt-4 border-t border-slate-50 dark:border-slate-700 flex flex-col gap-3">
                        <button className="w-full py-2.5 bg-indigo-600 text-white rounded-md text-xs font-bold shadow-sm">
                            Accept Invitation
                        </button>
                        <p className="text-[10px] text-slate-400 text-center">
                            You are receiving this email because you applied to a position.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ConditionBuilder = ({ condition, onChange, onDelete, channelType, onPreview }: any) => {
    // Default to collapsed unless it's a brand new condition (empty) which helps flow
    const hasData = (condition.appTypes && condition.appTypes.length > 0) || (condition.appMethods && condition.appMethods.length > 0);
    const [isExpanded, setIsExpanded] = useState(!hasData);

    const toggleSelection = (field: string, value: string) => {
        const current = condition[field] || [];
        const updated = current.includes(value) 
            ? current.filter((v: string) => v !== value)
            : [...current, value];
        onChange({ ...condition, [field]: updated });
    };

    const toggleOperator = () => {
        onChange({ ...condition, operator: condition.operator === 'OR' ? 'AND' : 'OR' });
    };

    // Summary generation for collapsed view
    const hasAppTypes = condition.appTypes && condition.appTypes.length > 0;
    const hasAppMethods = condition.appMethods && condition.appMethods.length > 0;
    const isComplete = hasAppTypes || hasAppMethods;

    return (
        <div className={`border rounded-lg bg-white dark:bg-slate-800 shadow-sm transition-all ${isExpanded ? 'border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-50 dark:ring-indigo-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}>
            {/* Header / Summary */}
            <div 
                className="flex items-center justify-between p-3 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 rounded-t-lg select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded bg-white dark:bg-slate-700 border shadow-sm ${isComplete ? 'text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800' : 'text-slate-400 border-slate-200 dark:border-slate-600'}`}>
                        <GitBranch size={14} />
                    </div>
                    
                    {isComplete ? (
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase mr-1">If</span>
                            
                            {condition.appTypes?.map((t: string) => (
                                <span key={t} className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium shadow-sm">{t}</span>
                            ))}

                            {hasAppTypes && hasAppMethods && (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-600 px-1.5 rounded">{condition.operator || 'AND'}</span>
                            )}

                            {condition.appMethods?.map((m: string) => (
                                <span key={m} className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium shadow-sm">{m}</span>
                            ))}

                            <span className="text-slate-300 dark:text-slate-600 mx-1">→</span>
                            <button
                                onClick={(e) => {
                                    if (condition.templateId && onPreview) {
                                        e.stopPropagation();
                                        onPreview(condition.templateId);
                                    }
                                }}
                                className={`flex items-center gap-1 font-semibold hover:underline ${condition.templateId ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-400'}`}
                            >
                                {condition.templateId ? (
                                    <><FileText size={12}/> Template Selected</>
                                ) : (
                                    "Select Template"
                                )}
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-400 italic">Configure condition...</span>
                    )}
                </div>

                <div className="flex items-center gap-1 pl-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Remove Condition"
                    >
                        <Trash2 size={14} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    <button className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Body */}
            {isExpanded && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-1 duration-200">
                    <div className="mb-4">
                        <div className="space-y-3">
                            {/* Application Type */}
                            <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Application Type</span>
                                <div className="flex flex-wrap gap-2">
                                    {APP_TYPES.map(type => {
                                        const isSelected = condition.appTypes?.includes(type);
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => toggleSelection('appTypes', type)}
                                                className={`px-3 py-1.5 rounded text-xs font-medium border transition-all flex items-center gap-2 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            >
                                                {isSelected ? <CheckSquare size={12} /> : <Square size={12} />}
                                                {type}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Boolean Operator */}
                            <div className="flex justify-center -my-1.5 relative z-10">
                                <button 
                                    onClick={toggleOperator}
                                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors uppercase"
                                >
                                    {condition.operator || 'AND'}
                                </button>
                            </div>

                            {/* Application Method */}
                            <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Application Method</span>
                                <div className="flex flex-wrap gap-2">
                                    {APP_METHODS.map(method => {
                                        const isSelected = condition.appMethods?.includes(method);
                                        return (
                                            <button
                                                key={method}
                                                onClick={() => toggleSelection('appMethods', method)}
                                                className={`px-3 py-1.5 rounded text-xs font-medium border transition-all flex items-center gap-2 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            >
                                                {isSelected ? <CheckSquare size={12} /> : <Square size={12} />}
                                                {method}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <TemplateSection 
                            label="Then Send Template"
                            type={channelType}
                            selectedId={condition.templateId}
                            onSelect={(id) => onChange({ ...condition, templateId: id })}
                            color={channelType === 'EMAIL' ? 'indigo' : 'purple'}
                            onPreview={onPreview}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const FollowupSection = ({ config, onChange, type, onPreview }: { config: any, onChange: (c: any) => void, type: 'EMAIL' | 'SMS', onPreview?: (id: string) => void }) => {
    const enabledKey = `${type.toLowerCase()}FollowupEnabled`;
    const delayKey = `${type.toLowerCase()}FollowupDelay`;
    const unitKey = `${type.toLowerCase()}FollowupUnit`;
    const countKey = `${type.toLowerCase()}FollowupCount`;
    const templateKey = `${type.toLowerCase()}FollowupTemplate`;

    const isEnabled = config[enabledKey] || false;
    const color = type === 'EMAIL' ? 'orange' : 'pink';

    const handleChange = (key: string, value: any) => {
        onChange({ ...config, [key]: value });
    };

    return (
        <div className="relative pt-6">
             {/* Visual Connector Line */}
             <div className="absolute left-8 top-0 h-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
             <div className="absolute left-6 top-6 h-4 w-4 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center z-10">
                <ArrowDown size={10} className="text-slate-400" />
             </div>

             <div className={`ml-0 md:ml-0 bg-white dark:bg-slate-800 border rounded-xl p-5 transition-all ${isEnabled ? `border-${color}-200 dark:border-${color}-800 shadow-sm` : 'border-slate-200 dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <Repeat size={16} className={isEnabled ? `text-${color}-500` : "text-slate-400"} /> 
                          Follow-up Automation
                       </h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automatically nudge candidates if no response.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isEnabled}
                        onChange={(e) => handleChange(enabledKey, e.target.checked)}
                      />
                      <div className={`w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${type === 'EMAIL' ? 'peer-checked:bg-orange-500' : 'peer-checked:bg-pink-500'}`}></div>
                    </label>
                </div>

                {isEnabled && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col md:flex-row gap-4">
                         {/* Timing Config */}
                         <div className="flex-1 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1"><Clock size={12}/> Wait Time</label>
                            <div className="flex gap-2">
                               <input 
                                  type="number" 
                                  className={`w-20 text-sm border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1.5 focus:border-${color}-500 focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-200`}
                                  placeholder="24"
                                  value={config[delayKey] || ''}
                                  onChange={(e) => handleChange(delayKey, e.target.value)}
                               />
                               <select 
                                  className={`flex-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1.5 focus:border-${color}-500 focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-200`}
                                  value={config[unitKey] || 'Hours'}
                                  onChange={(e) => handleChange(unitKey, e.target.value)}
                               >
                                  <option value="Minutes">Minutes</option>
                                  <option value="Hours">Hours</option>
                                  <option value="Days">Days</option>
                               </select>
                            </div>
                         </div>

                         {/* Frequency Config */}
                         <div className="flex-1 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1"><Repeat size={12}/> Repeat Count</label>
                            <div className="flex items-center gap-2">
                               <input 
                                  type="number" 
                                  className={`w-full text-sm border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1.5 focus:border-${color}-500 focus:outline-none bg-white dark:bg-slate-800 dark:text-slate-200`}
                                  placeholder="1"
                                  value={config[countKey] || ''}
                                  onChange={(e) => handleChange(countKey, e.target.value)}
                               />
                               <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Times</span>
                            </div>
                        </div>
                      </div>

                      {/* Followup Content */}
                      <div>
                         <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Follow-up Template</label>
                         <TemplateSection 
                            label="Select Template" 
                            type={type} 
                            selectedId={config[templateKey]} 
                            onSelect={(id) => handleChange(templateKey, id)}
                            color={color}
                            onPreview={onPreview}
                         />
                      </div>
                   </div>
                )}
             </div>
        </div>
    );
};

const ChannelTab = ({ type, config, onChange, onPreview }: { type: 'EMAIL' | 'SMS', config: any, onChange: (c: any) => void, onPreview?: (id: string) => void }) => {
    const isEmail = type === 'EMAIL';
    const enabledKey = isEmail ? 'emailEnabled' : 'smsEnabled';
    const conditionalKey = isEmail ? 'emailConditional' : 'smsConditional';
    const defaultTemplateKey = isEmail ? 'emailTemplate' : 'smsTemplate';
    const conditionsKey = isEmail ? 'emailConditions' : 'smsConditions';
    
    const color = isEmail ? 'indigo' : 'purple';
    const Icon = isEmail ? Mail : MessageSquare;

    const isEnabled = config[enabledKey] || false;
    const isConditional = config[conditionalKey] || false;
    const conditions = config[conditionsKey] || [];

    const handleToggle = () => onChange({ ...config, [enabledKey]: !isEnabled });
    const handleConditionalToggle = () => onChange({ ...config, [conditionalKey]: !isConditional });
    const handleTemplateChange = (id: string) => onChange({ ...config, [defaultTemplateKey]: id });
    
    const handleAddCondition = () => {
        const newCondition = { 
            id: Date.now().toString(), 
            appTypes: [], 
            appMethods: [], 
            operator: 'AND', 
            templateId: '' 
        };
        onChange({ ...config, [conditionsKey]: [...conditions, newCondition] });
    };

    const handleUpdateCondition = (index: number, newCond: any) => {
        const newConditions = [...conditions];
        newConditions[index] = newCond;
        onChange({ ...config, [conditionsKey]: newConditions });
    };

    const handleDeleteCondition = (index: number) => {
        const newConditions = conditions.filter((_: any, i: number) => i !== index);
        onChange({ ...config, [conditionsKey]: newConditions });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Master Toggle */}
            <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${isEnabled ? `bg-${color}-50 dark:bg-${color}-900/20 border-${color}-200 dark:border-${color}-800` : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isEnabled ? `bg-${color}-100 dark:bg-${color}-900/40 text-${color}-600 dark:text-${color}-400` : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${isEnabled ? `text-${color}-900 dark:text-${color}-300` : 'text-slate-500 dark:text-slate-400'}`}>{isEmail ? 'Email Channel' : 'SMS Channel'}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Send announcements via {isEmail ? 'Email' : 'SMS'}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isEnabled} onChange={handleToggle} />
                    <div className={`w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isEmail ? 'peer-checked:bg-indigo-600' : 'peer-checked:bg-purple-600'}`}></div>
                </label>
            </div>

            {isEnabled && (
                <div className="space-y-8 pl-4 border-l-2 border-slate-100 dark:border-slate-700 ml-6">
                    {/* Conditional Logic Toggle */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Split size={16} className={`text-${color}-600`} /> Personalization
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Send different templates based on candidate source?</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={isConditional} onChange={handleConditionalToggle} />
                            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                    </div>

                    {isConditional ? (
                        <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Conditions</span>
                                <button 
                                    onClick={handleAddCondition}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isEmail ? 'border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40' : 'border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40'}`}
                                >
                                    <Plus size={14} /> Add Condition
                                </button>
                            </div>

                            {conditions.length === 0 ? (
                                <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                    <p className="text-xs text-slate-400">No conditions added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {conditions.map((cond: any, idx: number) => (
                                        <ConditionBuilder 
                                            key={cond.id || idx}
                                            condition={cond}
                                            onChange={(newCond: any) => handleUpdateCondition(idx, newCond)}
                                            onDelete={() => handleDeleteCondition(idx)}
                                            channelType={type}
                                            onPreview={onPreview}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Default Template</label>
                                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">Fallback</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Sent to everyone else who doesn't match the above conditions.</p>
                                <TemplateSection 
                                    label="Select Default Template" 
                                    type={type} 
                                    selectedId={config[defaultTemplateKey]} 
                                    onSelect={handleTemplateChange}
                                    color={color}
                                    onPreview={onPreview}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Template</label>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">Standard</span>
                            </div>
                            <TemplateSection 
                                label="Select Template" 
                                type={type} 
                                selectedId={config[defaultTemplateKey]} 
                                onSelect={handleTemplateChange}
                                color={color}
                                onPreview={onPreview}
                            />
                        </div>
                    )}

                    {/* Integrated Follow-up Section */}
                    <FollowupSection config={config} onChange={onChange} type={type} onPreview={onPreview} />
                </div>
            )}
        </div>
    );
};

export const AnnouncementConfig = ({ config, onChange, onPreview }: AnnouncementConfigProps) => {
  const [activeTab, setActiveTab] = useState<'EMAIL' | 'SMS'>('EMAIL');
  
  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-white dark:bg-slate-800">
      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 px-6 pt-3 shrink-0 h-[57px]">
         <button 
            onClick={() => setActiveTab('EMAIL')}
            className={`flex items-center gap-2 px-4 pb-3 pt-2 text-sm font-bold border-b-2 transition-colors -mb-[1px] ${activeTab === 'EMAIL' ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}
         >
            <Mail size={16} /> Email Channel
         </button>
         <button 
            onClick={() => setActiveTab('SMS')}
            className={`flex items-center gap-2 px-4 pb-3 pt-2 text-sm font-bold border-b-2 transition-colors -mb-[1px] ${activeTab === 'SMS' ? 'border-purple-600 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}
         >
            <MessageSquare size={16} /> SMS Channel
         </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
         {activeTab === 'EMAIL' && (
            <ChannelTab type="EMAIL" config={config} onChange={onChange} onPreview={onPreview} />
         )}

         {activeTab === 'SMS' && (
            <ChannelTab type="SMS" config={config} onChange={onChange} onPreview={onPreview} />
         )}
      </div>
    </div>
  );
};
