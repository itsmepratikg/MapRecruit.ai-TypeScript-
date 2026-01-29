import React from 'react';
import { Edit, Trash } from 'lucide-react';

const SchemaTable = ({ data = [], columns = [], onEdit, onDelete, title, selectable = false, selectedItems = [], onSelect }) => {
    if (!data.length) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">No {title || 'items'} found.</p>
            </div>
        );
    }

    const allSelected = data.length > 0 && selectedItems.length === data.length;
    const someSelected = selectedItems.length > 0 && selectedItems.length < data.length;

    const handleSelectAll = (e) => {
        if (onSelect) {
            if (e.target.checked) {
                onSelect(data.map(item => item._id || item.id));
            } else {
                onSelect([]);
            }
        }
    };

    const handleSelectItem = (item, checked) => {
        if (onSelect) {
            const itemId = item._id || item.id;
            if (checked) {
                onSelect([...selectedItems, itemId]);
            } else {
                onSelect(selectedItems.filter(id => id !== itemId));
            }
        }
    };

    // Normalize columns
    const tableColumns = (columns.length ? columns : Object.keys(data[0] || {})
        .filter(key => !['_id', '__v', 'tenantId', 'updatedAt', 'password'].includes(key))
        .map(key => ({ header: key, accessor: key }))
    ).map(col => ({
        header: col.title || col.header,
        accessor: col.key || col.accessor,
        render: col.render,
        width: col.width,
        sortable: col.sortable
    }));

    const getValue = (item, col) => {
        if (col.render && typeof col.render === 'function') {
            return col.render(item[col.accessor], item);
        }
        const accessor = col.accessor;
        if (typeof accessor === 'function') {
            return accessor(item);
        }
        if (!accessor) return '';
        return accessor.split('.').reduce((obj, key) => (obj && obj[key] ? obj[key] : ''), item);
    };

    return (
        <div className="overflow-visible">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
                    <tr>
                        {selectable && (
                            <th className="px-6 py-4 text-left border-b border-slate-100 dark:border-slate-800 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                    checked={allSelected}
                                    ref={el => { if (el) el.indeterminate = someSelected; }}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        {tableColumns.map((col, idx) => (
                            <th
                                key={idx}
                                style={{ width: col.width }}
                                className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800"
                            >
                                {col.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900/50 divide-y divide-slate-50 dark:divide-slate-800/50">
                    {data.map((item, rowIdx) => {
                        const itemId = item._id || item.id;
                        const isSelected = selectedItems.includes(itemId);
                        return (
                            <tr
                                key={itemId || rowIdx}
                                className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200 ${isSelected ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                            >
                                {selectable && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                            checked={isSelected}
                                            onChange={(e) => handleSelectItem(item, e.target.checked)}
                                        />
                                    </td>
                                )}
                                {tableColumns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                        {getValue(item, col)}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SchemaTable;
