"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Users,
    FileText,
    Settings,
    LogOut,
    X,
    LucideIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['superadmin', 'owner', 'manager'] },
    { name: 'Shops', href: '/dashboard/shops', icon: Building2, roles: ['superadmin', 'owner', 'manager'] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['superadmin'] },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText, roles: ['superadmin', 'owner'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['superadmin', 'owner', 'manager'] },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const filteredNav = navItems.filter(item => {
        const userRole = user?.role as UserRole;
        return item.roles.includes(userRole);
    });

    return (
        <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/5 flex flex-col pt-8 transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
            <div className="px-8 mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                        <Building2 className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gradient">ManageHub</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {filteredNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => { if (onClose) onClose(); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-primary transition-colors'}`} />
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
