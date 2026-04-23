import { fetchWithAuth } from "../utils/api";
import { Staff } from "../types";

export const getShopStaff = (shopId: string): Promise<{ staff: Staff[] }> =>
    fetchWithAuth<{ staff: Staff[] }>(`/staff/shop/${shopId}`);

export const addStaff = (data: { name: string; email?: string; phone?: string; role: string; shopId: string }): Promise<{ staff: Staff }> =>
    fetchWithAuth<{ staff: Staff }>("/staff", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateStaff = (id: string, data: Partial<Staff>): Promise<{ staff: Staff }> =>
    fetchWithAuth<{ staff: Staff }>(`/staff/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteStaff = (id: string): Promise<{ msg: string }> =>
    fetchWithAuth<{ msg: string }>(`/staff/${id}`, {
        method: "DELETE",
    });
