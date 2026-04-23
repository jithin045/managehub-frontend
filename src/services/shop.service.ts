import { fetchWithAuth } from "../utils/api";
import { ShopsResponse, ManagerShopResponse, Shop } from "../types";

export const getMyShops = (): Promise<ShopsResponse> =>
    fetchWithAuth<ShopsResponse>("/shops/my-shops");

export const getAllShops = (): Promise<ShopsResponse> =>
    fetchWithAuth<ShopsResponse>("/shops/all");

export const createShop = (data: Partial<Shop>): Promise<Shop> =>
    fetchWithAuth<Shop>("/shops", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateShop = (id: string, data: Partial<Shop>): Promise<Shop> =>
    fetchWithAuth<Shop>(`/shops/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteShop = (id: string): Promise<{ msg: string }> =>
    fetchWithAuth<{ msg: string }>(`/shops/${id}`, {
        method: "DELETE",
    });

export const getShopById = (id: string): Promise<{ msg: string, shop: Shop }> =>
    fetchWithAuth<{ msg: string, shop: Shop }>(`/shops/${id}`);

export const getManagerShop = (): Promise<ManagerShopResponse> =>
    fetchWithAuth<ManagerShopResponse>("/shops/my-shop");
