"use client";

import React, { useEffect, useState } from "react";
import { getAllShops } from "../../services/shop.service";
import { getAllUsers } from "../../services/user.service";
import DashboardShell from "../../components/dashboard/DashboardShell";
import StatsCard from "../../components/dashboard/StatsCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import { Building2, Users, ShoppingBag, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Shop } from "../../types";
import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [shopData, userData] = await Promise.all([
                    getAllShops(),
                    getAllUsers()
                ]);
                setShops(shopData.shops || []);
                setUserCount(userData.users?.length || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <DashboardShell
            title="Admin Overview"
            description="System-wide management and global performance tracking."
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Revenue"
                        value="$124,592"
                        icon={ShoppingBag}
                        trend="up"
                        trendValue={12}
                        color="primary"
                    />
                    <StatsCard
                        title="Active Shops"
                        value={loading ? "..." : shops.length.toString()}
                        icon={Building2}
                        color="accent"
                    />
                    <StatsCard
                        title="Total Users"
                        value={loading ? "..." : userCount.toString()}
                        icon={Users}
                        trend="up"
                        trendValue={8}
                        color="secondary"
                    />
                    <StatsCard
                        title="Growth"
                        value="+24%"
                        icon={Plus}
                        color="primary"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <RevenueChart />
                    </motion.div>

                    {/* Side Performance List */}
                    <motion.div variants={item}>
                        <Card className="h-full bg-background/50 border-white/5 overflow-hidden">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="text-lg font-bold">Top Performing</CardTitle>
                                <CardDescription>Shops by occupancy rate.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <div key={i} className="p-4 flex items-center justify-between">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-10" />
                                            </div>
                                        ))
                                    ) : shops.slice(0, 5).map((shop) => (
                                        <div key={shop._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {shop.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium group-hover:text-primary transition-colors truncate max-w-[120px]">{shop.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-accent">98%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Global Shop Table */}
                <motion.div variants={item}>
                    <Card className="bg-background/50 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Global Registry</CardTitle>
                                <CardDescription>Detailed overview of all platform shops.</CardDescription>
                            </div>
                            <Link href="/dashboard/users" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all text-text-secondary hover:text-text-primary">
                                Manage Users
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="w-[250px] text-text-secondary font-bold uppercase text-[10px] tracking-wider">Shop Name</TableHead>
                                            <TableHead className="text-text-secondary font-bold uppercase text-[10px] tracking-wider">Owner</TableHead>
                                            <TableHead className="text-text-secondary font-bold uppercase text-[10px] tracking-wider text-center">Status</TableHead>
                                            <TableHead className="text-text-secondary font-bold uppercase text-[10px] tracking-wider text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array(3).fill(0).map((_, i) => (
                                                <TableRow key={i} className="border-white/5">
                                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : shops.map((shop) => {
                                            const ownerName = typeof shop.owner === 'object' ? shop.owner.name : 'Unknown';
                                            return (
                                                <TableRow key={shop._id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="font-medium group-hover:text-primary transition-colors">{shop.name}</TableCell>
                                                    <TableCell className="text-text-secondary">{ownerName}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase">Active</span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-all">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </DashboardShell>
    );
}
