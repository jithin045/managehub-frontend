"use client";

import React, { useState, FormEvent } from "react";
import { registerUser } from "../../services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Building2, ArrowRight, Loader2, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "../../types";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "manager" as UserRole });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await registerUser(form);
            if (data.msg === "User registered successfully") {
                toast.success("Account created! Please sign in.");
                router.push("/login");
            } else {
                toast.error(data.msg || "Registration failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Side: Visual Branding */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 bg-primary/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mx-auto mb-8">
                        <Building2 className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-gradient">
                        Join the future of shop management.
                    </h1>
                    <p className="text-text-secondary text-lg max-w-md mx-auto mb-10">
                        Create your account and start managing your shops with unprecedented ease and beauty.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <div className="glass-card px-4 py-2 text-xs font-semibold text-text-secondary">#SmartManagement</div>
                        <div className="glass-card px-4 py-2 text-xs font-semibold text-text-secondary">#SaaSPremium</div>
                        <div className="glass-card px-4 py-2 text-xs font-semibold text-text-secondary">#PropertyHub</div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-text-secondary">Get started with your free 14-day trial.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full input-field input-with-icon"
                                    required
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full input-field input-with-icon"
                                    required
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full input-field input-with-icon"
                                    required
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, role: 'owner' })}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${form.role === 'owner'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'border-white/10 text-text-secondary hover:border-white/20'
                                        }`}
                                >
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Owner</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, role: 'manager' })}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${form.role === 'manager'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'border-white/10 text-text-secondary hover:border-white/20'
                                        }`}
                                >
                                    <UserCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Manager</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
