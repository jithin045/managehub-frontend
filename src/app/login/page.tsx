"use client";

import React, { useState, FormEvent } from "react";
import { loginUser } from "../../services/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { Mail, Lock, Building2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginUser(form);
            if (data.token) {
                login(data);
                toast.success("Welcome back!");
                router.push("/dashboard");
            } else {
                toast.error(data.msg || "Login failed");
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
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mx-auto mb-8">
                        <Building2 className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">
                        Manage everything in <br />
                        <span className="text-gradient">one single hub.</span>
                    </h1>
                    <p className="text-text-secondary text-lg max-w-md mx-auto mb-10">
                        Streamline your shop management workflow with our next-generation SaaS workspace.
                    </p>

                    <div className="glass-card p-6 inline-flex items-center gap-4 text-left border-white/10">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-accent font-bold">99%</span>
                        </div>
                        <div>
                            <p className="font-semibold">Efficiency Increase</p>
                            <p className="text-xs text-text-secondary">Measured by our early adopters.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-text-secondary">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex items-center justify-between px-1">
                                <label className="text-sm font-medium text-text-secondary">Password</label>
                                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                            </div>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-primary font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
