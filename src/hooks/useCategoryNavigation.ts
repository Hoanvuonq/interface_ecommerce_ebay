"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useProductNavigation = () => {
  const router = useRouter();

  const goToProduct = useCallback((id: string, slug: string) => {
    const targetPath = `/products/${slug}`;
    
    sessionStorage.setItem(`product_id_${slug}`, id);

    router.push(targetPath);
  }, [router]);

  return { goToProduct };
};