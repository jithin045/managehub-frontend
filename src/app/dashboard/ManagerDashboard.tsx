"use client";

import React, { useEffect, useState } from "react";
import { getManagerShop } from "../../services/shop.service";
import DashboardShell from "../../components/dashboard/DashboardShell";
import StatsCard from "../../components/dashboard/StatsCard";
import { Building2, Users, Calendar, ArrowUpRight, MessageSquare } from "lucide-react";
import { Shop } from "../../types";

export default function ManagerDashboard() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getManagerShop();
                setShop(data.shop);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <DashboardShell
            title="Management Portal"
            description="Daily operations and maintenance oversight."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Avg. Daily Visitors"
                    value="1,240"
                    icon={Users}
                    trend="up"
                    trendValue={8}
                    color="secondary"
                />
                <StatsCard
                    title="Maintenance Requests"
                    value="2"
                    icon={MessageSquare}
                    color="red"
                />
                <StatsCard
                    title="Next Inspection"
                    value="In 4 days"
                    icon={Calendar}
                    color="accent"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <h3 className="font-bold text-xl">Managed Shop</h3>
                            {shop && <button className="text-primary flex items-center gap-1 text-sm font-semibold hover:underline">Full Report <ArrowUpRight className="w-4 h-4" /></button>}
                        </div>

                        <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="w-32 h-32 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/10">
                                <Building2 className="w-16 h-16" />
                            </div>

                            <div className="flex-1 space-y-4">
                                {loading ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-8 bg-white/5 rounded-lg w-1/3"></div>
                                        <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
                                    </div>
                                ) : shop ? (
                                    <>
                                        <div>
                                            <h2 className="text-3xl font-bold mb-1">{shop.name}</h2>
                                            <p className="text-text-secondary uppercase tracking-widest text-[10px] font-black">Serial: {shop._id.substring(0, 8).toUpperCase()}</p>
                                        </div>
                                        <p className="text-text-secondary leading-relaxed">
                                            This shop is currently under your direct supervision. All operational activities,
                                            staff management, and maintenance coordination should be logged through this interface.
                                        </p>
                                        <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                                            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">12 Active Units</div>
                                            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">8 Staff Members</div>
                                            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">98% Satisfied</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-4">
                                        <p className="text-text-secondary">No shop assigned to your account yet. Please contact your administrator.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-6">Staff Shifts</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary transition-colors">
                                        <Users className="w-5 h-5 text-text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">Staff Member #{i}</p>
                                        <p className="text-[10px] text-text-secondary uppercase">Morning Shift • 08:00 - 16:00</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-2 rounded-xl bg-white/5 text-text-secondary text-sm font-semibold hover:bg-white/10 transition-all">View All Staff</button>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
