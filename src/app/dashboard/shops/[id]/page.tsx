"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getShopById } from "@/src/services/shop.service";
import { getShopStaff, addStaff, updateStaff, deleteStaff } from "@/src/services/staff.service";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import StatsCard from "@/src/components/dashboard/StatsCard";
import {
    Building2,
    MapPin,
    User,
    Calendar,
    TrendingUp,
    ArrowLeft,
    MoreVertical,
    ShieldCheck,
    Mail,
    Phone,
    Clock,
    ShoppingBag,
    Pencil,
    Plus,
    Trash2,
    MoreHorizontal,
    Loader2
} from "lucide-react";
import { Shop, Staff } from "@/src/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ShopDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [shop, setShop] = useState<Shop | null>(null);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [staffLoading, setStaffLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal state
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

    // Form state
    const [staffName, setStaffName] = useState("");
    const [staffEmail, setStaffEmail] = useState("");
    const [staffPhone, setStaffPhone] = useState("");
    const [staffRole, setStaffRole] = useState<any>("sales");

    useEffect(() => {
        const load = async () => {
            try {
                const [shopData, staffData] = await Promise.all([
                    getShopById(id as string),
                    getShopStaff(id as string)
                ]);
                setShop(shopData.shop);
                setStaff(staffData.staff);
            } catch (err) {
                toast.error("Failed to load shop details.");
                router.push("/dashboard/shops");
            } finally {
                setLoading(false);
                setStaffLoading(false);
            }
        };
        load();
    }, [id, router]);

    const handleStaffAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (editingStaff) {
                await updateStaff(editingStaff._id, { name: staffName, email: staffEmail, phone: staffPhone, role: staffRole });
                toast.success("Staff updated successfully");
            } else {
                await addStaff({ name: staffName, email: staffEmail, phone: staffPhone, role: staffRole, shopId: id as string });
                toast.success("Staff added successfully");
            }
            const data = await getShopStaff(id as string);
            setStaff(data.staff);
            setIsStaffModalOpen(false);
            resetForm();
        } catch (err: any) {
            toast.error(err.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteStaff = async () => {
        if (!staffToDelete) return;
        setActionLoading(true);
        try {
            await deleteStaff(staffToDelete._id);
            toast.success("Staff removed");
            setStaff(staff.filter(s => s._id !== staffToDelete._id));
            setIsDeleteModalOpen(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to remove staff");
        } finally {
            setActionLoading(false);
        }
    };

    const resetForm = () => {
        setStaffName("");
        setStaffEmail("");
        setStaffPhone("");
        setStaffRole("sales");
        setEditingStaff(null);
    };

    const openEdit = (s: Staff) => {
        setEditingStaff(s);
        setStaffName(s.name);
        setStaffEmail(s.email || "");
        setStaffPhone(s.phone || "");
        setStaffRole(s.role);
        setIsStaffModalOpen(true);
    };

    if (loading) {
        return (
            <DashboardShell title="Loading..." description="Fetching shop profile...">
                <div className="space-y-8 animate-pulse">
                    <div className="h-64 bg-white/5 rounded-3xl w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                    </div>
                </div>
            </DashboardShell>
        );
    }

    if (!shop) return null;

    const manager = typeof shop.manager === 'object' ? shop.manager : null;
    const owner = typeof shop.owner === 'object' ? shop.owner : null;

    return (
        <DashboardShell
            title={shop.name}
            description={`Property UID: ${shop._id.substring(0, 8).toUpperCase()}`}
            actions={
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            }
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Hero Banner Component */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/10 group">
                    {shop.image ? (
                        <img src={shop.image} className="w-full h-full object-cover" alt={shop.name} />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-sky-500/20 flex items-center justify-center">
                            <Building2 className="w-24 h-24 text-white/10" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col md:flex-row md:items-end justify-between right-6 md:right-10 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20">Active Listing</span>
                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10">Premium</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{shop.name}</h1>
                            <div className="flex items-center gap-2 text-white/70 font-medium">
                                <MapPin className="w-4 h-4" /> {shop.address}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/40 hover:translate-y-[-2px] transition-all">Edit Property</button>
                            <button className="p-3 rounded-2xl bg-white text-background hover:bg-white/90 transition-all shadow-xl"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* Analytical Brief */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatsCard title="Total Revenue" value="$42,850" icon={TrendingUp} trend="up" trendValue={12} color="primary" />
                    <StatsCard title="Active Units" value="12/14" icon={ShoppingBag} color="accent" />
                    <StatsCard title="Maintenance" value="2 Open" icon={ShieldCheck} color="red" />
                    <StatsCard title="Last Inspection" value="2d ago" icon={Clock} color="secondary" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (2/3 columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Staff Registry Section */}
                        <Card className="bg-background/50 border-white/5 overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-white/2 pb-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Staff Registry
                                </CardTitle>
                                <button
                                    onClick={() => { resetForm(); setIsStaffModalOpen(true); }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
                                >
                                    <Plus className="w-3 h-3" /> Add Staff
                                </button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/1">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Name</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Role</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Contact</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Status</th>
                                                <th className="px-6 py-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {staff.length > 0 ? staff.map((s) => (
                                                <tr key={s._id} className="group hover:bg-white/2 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-sm text-text-primary">{s.name}</p>
                                                        <p className="text-[10px] text-text-secondary">Joined {new Date(s.joinedAt).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-text-secondary border border-white/10 capitalize">
                                                            {s.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                                <Mail className="w-3 h-3" /> {s.email || "N/A"}
                                                            </div>
                                                            {s.phone && (
                                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                                    <Phone className="w-3 h-3" /> {s.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-accent animate-pulse' : 'bg-text-secondary'}`}></span>
                                                            <span className={`text-[10px] font-black uppercase ${s.status === 'active' ? 'text-accent' : 'text-text-secondary'}`}>
                                                                {s.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all">
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { setStaffToDelete(s); setIsDeleteModalOpen(true); }}
                                                                className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center">
                                                        <User className="w-10 h-10 text-white/5 mx-auto mb-3" />
                                                        <p className="text-sm text-text-secondary font-medium">No staff members registered for this shop.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Operational Overview (Restored) */}
                        <Card className="bg-background/50 border-white/5 overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-white/2 pb-4">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    Operational Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <p className="text-text-secondary leading-relaxed mb-8">
                                    This property is presently operating at high efficiency. All safety protocols have been recently audited and cleared.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Occupancy', val: '92%' },
                                        { label: 'Safety Score', val: '98/100' },
                                        { label: 'Staff Count', val: staff.length },
                                        { label: 'Avg Stay', val: '8.4 mo' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                            <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">{stat.label}</p>
                                            <p className="text-xl font-black text-text-primary">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Area (1/3 columns) */}
                    <div className="space-y-6">
                        {/* ... existing manager/owner cards ... */}
                        <Card className="bg-background/50 border-white/10 overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5 bg-white/2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-text-secondary">Assigned Manager</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {manager ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/10 border border-accent/20">
                                                <User className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight">{manager.name}</p>
                                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-text-secondary font-bold border border-white/10">Active Manager</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                                <Mail className="w-4 h-4 text-primary" />
                                                <span className="truncate">{manager.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>Joined March 2024</span>
                                            </div>
                                        </div>
                                        <button className="w-full mt-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all text-text-secondary hover:text-text-primary">Contact Manager</button>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-dashed border-white/20">
                                            <User className="w-6 h-6 text-text-secondary" />
                                        </div>
                                        <p className="text-sm text-text-secondary font-medium italic">No manager assigned yet.</p>
                                        <button className="mt-6 w-full py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all">Assign Personnel</button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-background/50 border-white/10 overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5 bg-white/2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-text-secondary">Property Owner</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{owner?.name || 'Loading...'}</p>
                                        <p className="text-[10px] text-text-secondary">{owner?.email || '...'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Staff Modals */}
                <Dialog open={isStaffModalOpen} onOpenChange={(open) => !open && setIsStaffModalOpen(false)}>
                    <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</DialogTitle>
                            <DialogDescription className="text-text-secondary">
                                {editingStaff ? 'Update employee details and system permissions.' : 'Register a new employee for this shop location.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleStaffAction} className="space-y-4 py-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full input-field"
                                    required
                                    value={staffName}
                                    onChange={(e) => setStaffName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-text-secondary">Email</label>
                                    <input
                                        type="email"
                                        className="w-full input-field"
                                        value={staffEmail}
                                        onChange={(e) => setStaffEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-text-secondary">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full input-field"
                                        value={staffPhone}
                                        onChange={(e) => setStaffPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text-secondary">Operational Role</label>
                                <select
                                    className="w-full input-field bg-background border-white/10"
                                    value={staffRole}
                                    onChange={(e) => setStaffRole(e.target.value)}
                                >
                                    <option value="sales">Sales Associate</option>
                                    <option value="support">Customer Support</option>
                                    <option value="technical">Technical Staff</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <DialogFooter className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-white/10">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex-1 btn-primary">
                                    {actionLoading ? <Loader2 className="animate-spin" /> : (editingStaff ? 'Save Changes' : 'Register Staff')}
                                </button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && setIsDeleteModalOpen(false)}>
                    <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-xl border-white/10 text-white p-8 text-center">
                        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Remove Staff?</DialogTitle>
                            <DialogDescription className="text-text-secondary pt-2">
                                Are you sure you want to remove <b>{staffToDelete?.name}</b> from this shop? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-row gap-4 pt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-medium hover:bg-white/5 transition-all text-sm">Cancel</button>
                            <button onClick={handleDeleteStaff} disabled={actionLoading} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20">
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" /> : "Remove"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </DashboardShell >
    );
}

const shieldCheck = ShieldCheck;
const shoppingBag = ShoppingBag;
