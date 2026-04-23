"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { getAllShops, getMyShops, createShop, updateShop, deleteShop, getManagerShop } from "../../../services/shop.service";
import { getManagers } from "../../../services/auth.service";
import { useAuth } from "../../../context/AuthContext";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import { toast } from "sonner";
import { Shop, User } from "../../../types";
import {
    Building2,
    Search,
    Plus,
    MapPin,
    ArrowUpRight,
    Loader2,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip as UITooltip,
    TooltipContent as UITooltipContent,
    TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";

type ModalMode = 'create' | 'edit' | 'delete' | null;

export default function ShopsPage() {
    const { user } = useAuth();
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [availableManagers, setAvailableManagers] = useState<User[]>([]);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

    const [shopName, setShopName] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [shopImage, setShopImage] = useState("");
    const [assignedManager, setAssignedManager] = useState("");

    const loadShops = async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            let data: { shops: Shop[], msg?: string } = { shops: [] };
            if (user?.role === 'superadmin') {
                data = await getAllShops();
            } else if (user?.role === 'owner') {
                data = await getMyShops();
            } else if (user?.role === 'manager') {
                const res = await getManagerShop();
                data = { shops: res.shop ? [res.shop] : [] };
            }

            if (data && data.shops) {
                setShops(data.shops);
            } else {
                setError(data?.msg || "Failed to load shops data structure.");
                setShops([]);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while fetching shops.");
            toast.error("Network error: Could not fetch shops.");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const loadManagers = async () => {
        if (user?.role !== 'owner' && user?.role !== 'superadmin') return;
        try {
            const data = await getManagers();
            setAvailableManagers(data.managers || []);
        } catch (err) {
            console.error("Error loading managers:", err);
        }
    };

    useEffect(() => {
        if (user) {
            loadShops();
            loadManagers();
        }
    }, [user]);

    const openCreateModal = () => {
        if (user?.role === 'manager') return;
        setModalMode('create');
        setShopName("");
        setShopAddress("");
        setShopImage("");
        setAssignedManager("");
        setSelectedShop(null);
    };

    const openEditModal = (shop: Shop) => {
        setModalMode('edit');
        setShopName(shop.name);
        setShopAddress(shop.address || "");
        setShopImage(shop.image || "");
        setAssignedManager(typeof shop.manager === 'object' ? shop.manager?._id || "" : shop.manager || "");
        setSelectedShop(shop);
    };

    const openDeleteModal = (shop: Shop) => {
        if (user?.role === 'manager') return;
        setModalMode('delete');
        setSelectedShop(shop);
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedShop(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        if (e) e.preventDefault();
        if (!shopName.trim() || !shopAddress.trim()) return;

        setActionLoading(true);
        const promise = modalMode === 'create'
            ? createShop({ name: shopName, address: shopAddress, image: shopImage, manager: assignedManager || undefined })
            : updateShop(selectedShop!._id, { name: shopName, address: shopAddress, image: shopImage, manager: assignedManager || undefined });

        toast.promise(promise, {
            loading: `${modalMode === 'create' ? 'Creating' : 'Updating'} shop...`,
            success: () => {
                closeModal();
                loadShops(true);
                return `Shop ${modalMode === 'create' ? 'created' : 'updated'} successfully!`;
            },
            error: (err: any) => `Failed to ${modalMode} shop: ${err.message || 'Unknown error'}`,
            finally: () => setActionLoading(false)
        });
    };

    const handleDelete = async () => {
        if (!selectedShop) return;
        setActionLoading(true);

        toast.promise(deleteShop(selectedShop._id), {
            loading: "Deleting shop...",
            success: () => {
                closeModal();
                loadShops(true);
                return "Shop deleted successfully.";
            },
            error: "Failed to delete shop.",
            finally: () => setActionLoading(false)
        });
    };

    const filteredShops = shops.filter(shop => {
        const nameMatch = shop.name.toLowerCase().includes(search.toLowerCase());
        const addressMatch = (shop.address || "").toLowerCase().includes(search.toLowerCase());
        return nameMatch || addressMatch;
    });

    return (
        <DashboardShell
            title="Shops Management"
            description={
                user?.role === 'superadmin' ? "Full system oversight of all registered shops." :
                    user?.role === 'owner' ? "Manage your personal shop portfolio and assign staff." :
                        "Overview of your assigned shop and daily operations."
            }
            actions={user?.role !== 'manager' && (
                <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Shop</span>
                </button>
            )}
        >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search shops..."
                        className="w-full input-field input-with-icon py-2 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['all', 'active', 'pending'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="glass-card flex flex-col overflow-hidden border-white/5">
                            <Skeleton className="h-44 w-full rounded-none" />
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="pt-4 border-t border-white/5 flex justify-between">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredShops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map((shop, i) => (
                        <motion.div
                            key={shop._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="group"
                        >
                            <Link href={`/dashboard/shops/${shop._id}`} className="block h-full">
                                <div className="glass-card group hover:border-primary/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                                        {shop.image ? (
                                            <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                                <Building2 className="w-16 h-16 text-white/10" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300 z-30">
                                            <div className="flex items-center gap-3">
                                                <UITooltip>
                                                    <UITooltipTrigger>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                openEditModal(shop);
                                                            }}
                                                            className="w-10 h-10 rounded-full bg-white text-background flex items-center justify-center hover:bg-primary hover:text-white transition-all transform scale-90 group-hover:scale-100 duration-300"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                    </UITooltipTrigger>
                                                    <UITooltipContent>Edit Shop</UITooltipContent>
                                                </UITooltip>
                                                {user?.role !== 'manager' && (
                                                    <UITooltip>
                                                        <UITooltipTrigger>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    openDeleteModal(shop);
                                                                }}
                                                                className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100 duration-300 delay-75"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </UITooltipTrigger>
                                                        <UITooltipContent>Delete Shop</UITooltipContent>
                                                    </UITooltip>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-2 truncate group-hover:text-primary transition-colors">{shop.name}</h3>
                                        <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{shop.address || "No address"}</span>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-text-secondary">
                                            <span>{shop.manager ? "Manager Assigned" : "Staff Unassigned"}</span>
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-card py-32 text-center">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                    <h3 className="text-xl font-bold mb-2">No shops available</h3>
                    <p className="text-text-secondary mb-8">Start by adding your first shop to the platform.</p>
                    {user?.role !== 'manager' && <button onClick={openCreateModal} className="btn-primary">Add Shop</button>}
                </div>
            )}

            <Dialog open={!!(modalMode && modalMode !== 'delete')} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{modalMode === 'create' ? 'Add Shop' : 'Edit Shop'}</DialogTitle>
                        <DialogDescription className="text-text-secondary">Provide shop details and manager assignment.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-secondary">Name</label>
                            <input type="text" className="w-full input-field" required value={shopName} onChange={(e) => setShopName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-secondary">Address</label>
                            <input type="text" className="w-full input-field" required value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-secondary">Image URL</label>
                            <input type="url" className="w-full input-field" value={shopImage} onChange={(e) => setShopImage(e.target.value)} />
                        </div>
                        {user?.role !== 'manager' && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text-secondary">Assign Manager</label>
                                <select className="w-full input-field bg-background border-white/10" value={assignedManager} onChange={(e) => setAssignedManager(e.target.value)}>
                                    <option value="">Unassigned</option>
                                    {availableManagers.map(mgr => <option key={mgr._id} value={mgr._id}>{mgr.name} ({mgr.email})</option>)}
                                </select>
                            </div>
                        )}
                        <DialogFooter className="pt-4 flex gap-3">
                            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-xl border border-white/10">Cancel</button>
                            <button type="submit" disabled={actionLoading} className="flex-1 btn-primary">{actionLoading ? <Loader2 className="animate-spin" /> : (modalMode === 'create' ? 'Create' : 'Save')}</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={modalMode === 'delete'} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-xl border-white/10 text-white p-8 text-center">
                    <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Delete Shop?</DialogTitle>
                        <DialogDescription className="text-text-secondary pt-2">Are you sure you want to delete <b>{selectedShop?.name}</b>? This action is permanent.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-row gap-4 pt-8">
                        <button onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-medium hover:bg-white/5 transition-all text-sm">Cancel</button>
                        <button onClick={handleDelete} disabled={actionLoading} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20">{actionLoading ? <Loader2 className="animate-spin mx-auto" /> : "Delete"}</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
