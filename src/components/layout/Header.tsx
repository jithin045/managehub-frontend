"use client";

import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
    Tooltip as UITooltip,
    TooltipContent as UITooltipContent,
    TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className="h-20 glass border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <UITooltip>
                    <UITooltipTrigger>
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all md:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </UITooltipTrigger>
                    <UITooltipContent side="bottom">Open Menu</UITooltipContent>
                </UITooltip>

                <div className="relative w-40 sm:w-64 md:w-96 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full input-field input-with-icon py-2 text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <UITooltip>
                    <UITooltipTrigger>
                        <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                        </button>
                    </UITooltipTrigger>
                    <UITooltipContent side="bottom">Notifications</UITooltipContent>
                </UITooltip>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-sm font-semibold text-text-primary capitalize">{user?.role || 'User'}</span>
                        <span className="text-[10px] text-text-secondary truncate max-w-[100px]">{user?.email || 'user@example.com'}</span>
                    </div>
                    <UITooltip>
                        <UITooltipTrigger>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10 flex-shrink-0 cursor-pointer">
                                <User className="text-white w-5 h-5" />
                            </div>
                        </UITooltipTrigger>
                        <UITooltipContent side="bottom">Your Profile</UITooltipContent>
                    </UITooltip>
                </div>
            </div>
        </header>
    );
}
