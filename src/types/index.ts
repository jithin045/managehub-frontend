export type UserRole = 'superadmin' | 'owner' | 'manager' | 'user';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface Shop {
    _id: string;
    name: string;
    address: string;
    image?: string;
    owner: string | User;
    manager?: string | User;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    msg?: string;
}

export interface ShopsResponse {
    shops: Shop[];
    msg?: string;
}

export interface ManagerShopResponse {
    shop: Shop | null;
    msg?: string;
}

export interface ManagersResponse {
    managers: User[];
    msg?: string;
}

export interface Staff {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    role: "sales" | "support" | "technical" | "other";
    shop: string | Shop;
    status: "active" | "inactive";
    joinedAt: string;
}
