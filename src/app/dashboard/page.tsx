"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import OwnerDashboard from "./OwnerDashboard";
import ManagerDashboard from "./ManagerDashboard";

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return <p className="p-8 text-text-secondary animate-pulse">Loading workspace...</p>;

    if (user.role === "superadmin") return <AdminDashboard />;
    if (user.role === "owner") return <OwnerDashboard />;
    if (user.role === "manager") return <ManagerDashboard />;

    return <p className="p-8 text-red-400">Unauthorized role detected.</p>;
}
