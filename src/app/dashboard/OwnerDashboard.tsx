"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { getMyShops, createShop } from "../../services/shop.service";
import DashboardShell from "../../components/dashboard/DashboardShell";
import StatsCard from "../../components/dashboard/StatsCard";
import { Building2, ShoppingBag, Plus, Search, MoreVertical, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Shop } from "../../types";
import {
    Tooltip as UITooltip,
    TooltipContent as UITooltipContent,
    TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function OwnerDashboard() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadShops = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await getMyShops();
            setShops(data.shops || []);
        } catch (err) {
            toast.error("Failed to load your shops.");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        loadShops();
    }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !address.trim()) return;

        setActionLoading(true);
        toast.promise(createShop({ name, address, image }), {
            loading: "Registering new shop...",
            success: () => {
                setName("");
                setAddress("");
                setImage("");
                loadShops(true);
                return "Shop registered successfully!";
            },
            error: "Failed to create shop.",
            finally: () => setActionLoading(false)
        });
    };

    return (
        <DashboardShell
            title="My Shops"
            description="Manage your shops and monitor their individual performance."
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Shops"
                        value={loading ? "..." : shops.length.toString()}
                        icon={Building2}
                        color="primary"
                    />
                    <StatsCard
                        title="Occupancy Rate"
                        value="85%"
                        icon={ShoppingBag}
                        trend="up"
                        trendValue={4}
                        color="accent"
                    />
                    <StatsCard
                        title="Pending Actions"
                        value="3"
                        icon={MoreVertical}
                        color="secondary"
                    />
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Shop List</h2>
                            <div className="relative group w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary transition-colors" />
                                <input type="text" placeholder="Filter shops..." className="w-full input-field input-with-icon py-1.5 text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <Card key={i} className="bg-background/50 border-white/5 overflow-hidden">
                                        <Skeleton className="h-24 w-full rounded-none" />
                                        <CardContent className="p-5 space-y-3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>
                                    </Card>
                                ))
                            ) : shops.length > 0 ? (
                                shops.map((shop) => (
                                    <motion.div variants={item} key={shop._id}>
                                        <Link href={`/dashboard/shops/${shop._id}`} className="block">
                                            <Card className="bg-background/50 border-white/10 group cursor-pointer hover:border-primary/50 transition-all overflow-hidden">
                                                <div className="h-24 w-full relative overflow-hidden bg-white/5">
                                                    {shop.image ? (
                                                        <img src={shop.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={shop.name} />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Building2 className="w-8 h-8 text-white/10" />
                                                        </div>
                                                    )}
                                                </div>
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{shop.name}</h3>
                                                        <UITooltip>
                                                            <UITooltipTrigger>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className="text-text-secondary hover:text-text-primary p-1 hover:bg-white/5 rounded-lg"
                                                                >
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </UITooltipTrigger>
                                                            <UITooltipContent>More Options</UITooltipContent>
                                                        </UITooltip>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="truncate">{shop.address || "No address"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">Managed</span>
                                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-text-secondary text-[10px] font-bold uppercase tracking-wider">Active</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center glass-card border-dashed">
                                    <p className="text-text-secondary mb-4">No shops registered yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Quick Actions</h2>
                        <Card className="bg-primary/5 border-primary/20 overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" />
                                    Add New Shop
                                </CardTitle>
                                <CardDescription>Rapidly list a new property.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-tighter">Shop Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Skyline Plaza"
                                            className="w-full input-field py-2 text-sm"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-tighter">Shop Address</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 123 Main Street"
                                            className="w-full input-field py-2 text-sm"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-tighter">Image URL (Optional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            className="w-full input-field py-2 text-sm"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" disabled={actionLoading || !name.trim() || !address.trim()} className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Shop"}
                                    </button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </DashboardShell>
    );
}
