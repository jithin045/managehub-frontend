"use client";

import React, { useEffect, useState } from "react";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import {
    getAllUsers,
    updateUser,
    deleteUser
} from "@/src/services/user.service";
import { User, Shop } from "@/src/types";
import {
    Users,
    Shield,
    MoreVertical,
    Trash2,
    Pencil,
    Check,
    X,
    Loader2,
    ShieldCheck,
    UserCircle,
    Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form state
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState<any>("user");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data.users);
        } catch (err) {
            toast.error("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            await updateUser(selectedUser._id, {
                name: editName,
                email: editEmail,
                role: editRole
            });
            toast.success("User updated successfully");
            setIsEditModalOpen(false);
            loadUsers();
        } catch (err: any) {
            toast.error(err.message || "Failed to update user");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            await deleteUser(selectedUser._id);
            toast.success("User deleted successfully");
            setIsDeleteModalOpen(false);
            loadUsers();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setActionLoading(false);
        }
    };

    const openEdit = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditRole(user.role);
        setIsEditModalOpen(true);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "superadmin":
                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Superadmin</Badge>;
            case "owner":
                return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Owner</Badge>;
            case "manager":
                return <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">Manager</Badge>;
            default:
                return <Badge variant="outline">User</Badge>;
        }
    };

    return (
        <DashboardShell
            title="User Management"
            description="Administrate platform users, roles, and access credentials."
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-background/50 border-white/5">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Total Users</CardDescription>
                            <CardTitle className="text-3xl font-black">{loading ? "..." : users.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-background/50 border-white/5">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Active Owners</CardDescription>
                            <CardTitle className="text-3xl font-black text-primary">{loading ? "..." : users.filter(u => u.role === 'owner').length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-background/50 border-white/5">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-text-secondary">System Admins</CardDescription>
                            <CardTitle className="text-3xl font-black text-red-500">{loading ? "..." : users.filter(u => u.role === 'superadmin').length}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* User Registry */}
                <Card className="bg-background/50 border-white/5 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/2 pb-6">
                        <div>
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Master Registry
                            </CardTitle>
                            <CardDescription>Comprehensive list of all registered platform personnel.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white/1">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">User Info</TableHead>
                                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">System Role</TableHead>
                                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Associated Shop</TableHead>
                                        <TableHead className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-secondary">Joined Date</TableHead>
                                        <TableHead className="px-6 py-4 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i} className="border-white/5">
                                                <TableCell className="px-6 py-4"><Skeleton className="h-10 w-40 rounded-lg" /></TableCell>
                                                <TableCell className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                                <TableCell className="px-6 py-4"><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
                                                <TableCell className="px-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : users.length > 0 ? users.map((user) => (
                                        <TableRow key={user._id} className="border-white/5 hover:bg-white/2 group transition-colors">
                                            <TableCell className="px-6 py-4 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-background border border-white/10 flex items-center justify-center text-text-secondary transition-all group-hover:border-primary/50 group-hover:text-primary">
                                                        <UserCircle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm tracking-tight">{user.name}</p>
                                                        <p className="text-[10px] text-text-secondary">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {user.role === 'manager' && (user as any).shop ? (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                                                        <Building2 className="w-3 h-3" />
                                                        {(user as any).shop.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-text-secondary/40 text-[10px] font-medium">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-xs text-text-secondary font-medium">
                                                {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    <button
                                                        onClick={() => openEdit(user)}
                                                        className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center gap-4 text-text-secondary">
                                                    <Users className="w-12 h-12 text-white/5" />
                                                    <p className="text-sm font-medium">No users found in the system.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit User Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit User Permissions</DialogTitle>
                            <DialogDescription className="text-text-secondary">
                                Modify user identity and platform access levels.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4 py-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full input-field"
                                    required
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full input-field"
                                    required
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">System Role</label>
                                <select
                                    className="w-full input-field bg-background border-white/10"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                >
                                    <option value="user">Regular User</option>
                                    <option value="owner">Shop Owner</option>
                                    <option value="manager">Store Manager</option>
                                    <option value="superadmin">Super Administrator</option>
                                </select>
                            </div>
                            <DialogFooter className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 font-bold text-xs hover:bg-white/5 transition-all">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex-1 btn-primary text-xs flex items-center justify-center gap-2">
                                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save Changes</>}
                                </button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-xl border-white/10 text-white p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Terminate Account?</DialogTitle>
                            <DialogDescription className="text-text-secondary pt-2">
                                You are about to remove <b>{selectedUser?.name}</b> from the platform. This will sever all access and cannot be reversed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-row gap-4 pt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold text-xs hover:bg-white/5 transition-all">Cancel</button>
                            <button onClick={handleDelete} disabled={actionLoading} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-xl shadow-red-500/20 text-xs">
                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Terminate Access"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </motion.div>
        </DashboardShell>
    );
}
