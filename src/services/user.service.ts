import { fetchWithAuth } from "../utils/api";
import { User } from "../types";

export const getAllUsers = (): Promise<{ users: User[] }> =>
    fetchWithAuth<{ users: User[] }>("/user/all");

export const updateUser = (id: string, data: Partial<User> & { shop?: string | null }): Promise<{ user: User }> =>
    fetchWithAuth<{ user: User }>(`/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteUser = (id: string): Promise<{ msg: string }> =>
    fetchWithAuth<{ msg: string }>(`/user/${id}`, {
        method: "DELETE",
    });
