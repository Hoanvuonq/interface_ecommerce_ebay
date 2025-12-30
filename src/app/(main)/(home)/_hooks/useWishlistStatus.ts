"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "@/app/(main)/wishlist/_hooks/useWishlist";
import { isAuthenticated } from "@/utils/local.storage";

export const useWishlistStatus = (products: any[]) => {
  const [wishlistMap, setWishlistMap] = useState<Map<string, boolean>>(new Map());
  const { checkVariantsInWishlist } = useWishlist();

  useEffect(() => {
    if (isAuthenticated() && products.length > 0) {
      const variantIds = products
        .map((p) => p.variants?.[0]?.id)
        .filter((id): id is string => !!id);

      if (variantIds.length > 0) {
        checkVariantsInWishlist(variantIds).then((statusMap) => {
          setWishlistMap(statusMap);
        });
      }
    }
  }, [products, checkVariantsInWishlist]);

  return { wishlistMap };
};

export default useWishlistStatus;