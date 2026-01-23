/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

/**
 * Hook: Lấy danh sách khách hàng đã mua hàng từ shop
 * TODO: Implement khi có API
 */
export function useGetShopCustomers() {
  const [customers] = useState<any[]>([]);
  const [loading] = useState(false);

  // TODO: Implement API call khi backend ready
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await request<any>({
  //         url: "/v1/shops/current/customers",
  //         method: "GET",
  //         params: { page: 0, size: 1000 },
  //       });
  //       if (response?.code === 1000) {
  //         setCustomers(response.data?.content || []);
  //       }
  //     } catch (error: any) {
  //       console.warn("Failed to fetch customers:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchCustomers();
  // }, []);

  return { customers, loading };
}