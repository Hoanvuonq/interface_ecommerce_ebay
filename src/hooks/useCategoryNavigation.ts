// hooks/useCategoryNavigation.ts
"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useCategoryNavigation = () => {
  const router = useRouter();

  const navigateToCategory = useCallback((id: string | number, slug: string) => {
    router.push(`/category/${slug}?id=${id}`); 
    
  
  }, [router]);

  return { navigateToCategory };
};