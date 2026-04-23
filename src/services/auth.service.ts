import { fetchWithAuth } from "../utils/api";
import { AuthResponse, ManagersResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const loginUser = async (data: any): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    return res.json();
};

export const registerUser = async (data: any): Promise<{ msg: string }> => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    return res.json();
};

export const getManagers = async (): Promise<ManagersResponse> => {
    return fetchWithAuth<ManagersResponse>("/auth/managers");
};

export const logoutUser = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
        } catch (e) {
            console.error("Logout API failed", e);
        }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
