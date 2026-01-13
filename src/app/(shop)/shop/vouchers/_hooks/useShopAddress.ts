/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateShopAddressRequest, UpdateShopAddressRequest } from "@/app/(main)/shop/_types/dto/shop.dto";
import { createShopAddress, getAllShopAddresses, updateShopAddress } from "@/app/(main)/shop/_service/shop.service";
import { useState } from "react";

export function useGetAllShopAddresses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllShopAddresses = async (shopId: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllShopAddresses(shopId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin địa chỉ shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllShopAddresses, loading, error };
}

export function useCreateShopAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateShopAddress = async (shopId: string, address: CreateShopAddressRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await createShopAddress(shopId, address);
      return true;
    } catch (err: any) {
      setError(err?.message || "Tạo địa chỉ shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateShopAddress, loading, error };
}

export function useUpdateShopAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateShopAddress = async (shopId: string, addressId: string, address: UpdateShopAddressRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await updateShopAddress(shopId, addressId, address);
      return true;
    } catch (err: any) {
      setError(err?.message || "Cập nhật địa chỉ shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShopAddress, loading, error };
}