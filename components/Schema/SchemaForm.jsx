import React, { useState, useEffect } from 'react';

const SchemaForm = ({ schema, initialData = {}, onSubmit }) => {
    const [formData, setFormData] = useState(initialData);

    // Helper to render recursively
    const renderField = (key, value, parentKey = '') => {
        const fieldName = parentKey ? `${parentKey}.${key}` : key;
        const fieldType = typeof value;

        // Skip technical keys or metadata if preferred
        if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return null;

        if (Array.isArray(value)) {
            // For now, handle arrays as a simple JSON string input or skip
            // Improvement: Create ArrayField component
            return (
                <div key={fieldName} className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()} (List)
                    </label>
                    <textarea
                        className="w-full p-2 border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                        value={JSON.stringify(value)}
                        disabled
                        readOnly // Complex arrays needing specific UI logic
                    />
                </div>
            );
        }

        if (value && fieldType === 'object') {
            return (
                <div key={fieldName} className="mb-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    {Object.entries(value).map(([nestedKey, nestedValue]) =>
                        renderField(nestedKey, nestedValue, fieldName)
                    )}
                </div>
            );
        }

        // Primitive Inputs
        return (
            <div key={fieldName} className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {fieldType === 'boolean' ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name={fieldName}
                            checked={!!value} // Use lodash get in real app
                            onChange={(e) => handleNestedChange(fieldName, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{value ? 'Yes' : 'No'}</span>
                    </div>
                ) : (
                    <input
                        type={fieldType === 'number' ? 'number' : 'text'}
                        name={fieldName}
                        // In a real implementation, we need lodash.get to retrieve nested value from formData
                        // For this basic version, we bind to the initial schema structure passed
                        defaultValue={value}
                        onChange={(e) => handleNestedChange(fieldName, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                )}
            </div>
        );
    };

    const handleNestedChange = (path, value) => {
        // Deep clone and set value using path (e.g., "profile.firstName")
        // Simplified for this prototype: we just log it or update top level
        // In production: use lodash.set

        const newFormData = { ...formData };

        // Simple path handling for 1-level nesting demo
        const keys = path.split('.');
        if (keys.length === 1) {
            newFormData[keys[0]] = value;
        } else if (keys.length === 2) {
            if (!newFormData[keys[0]]) newFormData[keys[0]] = {};
            newFormData[keys[0]][keys[1]] = value;
        }

        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            {schema && Object.entries(schema).map(([key, value]) => renderField(key, value))}

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default SchemaForm;
