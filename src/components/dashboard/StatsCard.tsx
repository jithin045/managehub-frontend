"use client";

import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: 'up' | 'down';
    trendValue?: number;
    color?: 'primary' | 'secondary' | 'accent' | 'red';
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "primary"
}: StatsCardProps) {
    const isPositive = trend === 'up';

    const colorMap = {
        primary: "text-primary shadow-primary/20 bg-primary/10",
        secondary: "text-secondary shadow-secondary/20 bg-secondary/10",
        accent: "text-accent shadow-accent/20 bg-accent/10",
        red: "text-red-500 shadow-red-500/20 bg-red-500/10",
    };

    return (
        <div className="glass-card p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] hover:shadow-indigo-500/10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.primary}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trendValue}%
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-text-primary tracking-tight">{value}</p>
            </div>
        </div>
    );
}
