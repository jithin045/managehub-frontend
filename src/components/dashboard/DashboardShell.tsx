"use client";

import React, { ReactNode } from 'react';

interface DashboardShellProps {
    title: string;
    description: string;
    children: ReactNode;
    actions?: ReactNode;
}

export default function DashboardShell({ title, description, children, actions }: DashboardShellProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h1>
                    <p className="text-text-secondary text-sm md:text-base">{description}</p>
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {children}
            </div>
        </div>
    );
}
