
import React from 'react';

export interface ClientData {
    _id: string;
    clientName: string;
    clientNameAlias?: string;
    clientCode: string;
    clientType: string;
    clientURL?: string;
    clientLogo?: string;
    country?: string;
    countryCode?: string;
    status: string;
    description?: string;
    enable?: boolean;
    language?: string;
    settings?: any;
    locations?: any[];
    ClientUsersList?: any[];
    companyID?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const CLIENT_SCHEMA = [
    {
        header: "Client Name",
        accessor: "clientName",
        sortable: true,
        render: (value: string, row: ClientData) => (
            <div className="flex items-center gap-3">
                {row.clientLogo ? (
                    <img src={row.clientLogo} alt={value} className="w-8 h-8 rounded-full object-contain bg-white border border-slate-100" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                        {value?.substring(0, 2)}
                    </div>
                )}
                <div>
                    <div className="font-medium text-slate-800 dark:text-slate-100">{value}</div>
                    {row.clientCode && <div className="text-xs text-slate-500">{row.clientCode}</div>}
                </div>
            </div>
        )
    },
    {
        header: "Type",
        accessor: "clientType",
        sortable: true,
        render: (value: string) => (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {value || 'Client'}
            </span>
        )
    },
    {
        header: "Location",
        accessor: "country",
        sortable: true,
        render: (value: string) => value || 'N/A'
    },
    {
        header: "Status",
        accessor: "status",
        sortable: true,
        render: (value: string) => {
            const isActive = value === 'Active';
            return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {value || 'Inactive'}
                </span>
            );
        }
    },
    {
        header: "Last Updated",
        accessor: "updatedAt",
        sortable: true,
        render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
];
