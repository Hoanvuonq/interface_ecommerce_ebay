"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHomepageData } from "../_hooks/useHomePageData";
import { batchCheckVariantsInWishlist } from "../../wishlist/_hooks/batchCheckVariantsInWishlist";
import { useWishlist } from "../../wishlist/_hooks/useWishlist";

type HomepageContextType = ReturnType<typeof useHomepageData> & {
  wishlistMap: Map<string, boolean>;
};
const HomepageContext = createContext<HomepageContextType | undefined>(
  undefined
);

export const HomepageProvider = ({
  children,
  locale = "vi",
}: {
  children: ReactNode;
  locale?: string;
  device?: string;
}) => {
  const homepageData = useHomepageData(locale);
  const { checkVariantsInWishlist } = useWishlist();
  const [wishlistMap, setWishlistMap] = useState<Map<string, boolean>>(new Map());
  const hasCheckedRef = useRef(false);

  const variantIds = useMemo(() => {
    const allProducts = [
      ...(homepageData.flashSale || []),
      ...(homepageData.featured || []),
      ...(homepageData.saleProducts || []),
      ...(homepageData.newProducts || []),
    ];
    return allProducts
      .map((p) => p.variants?.[0]?.id)
      .filter((id): id is string => !!id);
  }, [
    homepageData.flashSale,
    homepageData.featured,
    homepageData.saleProducts,
    homepageData.newProducts,
  ]);

  useEffect(() => {
    if (variantIds.length > 0 && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      batchCheckVariantsInWishlist(
        checkVariantsInWishlist,
        variantIds,
        20
      ).then(setWishlistMap);
    }
  }, [variantIds, checkVariantsInWishlist]);

  return (
    <HomepageContext.Provider value={{ ...homepageData, wishlistMap }}>
      {children}
    </HomepageContext.Provider>
  );
};

export const useHomepageContext = () => {
  const context = useContext(HomepageContext);
  if (!context) {
    throw new Error("useHomepageContext must be used within HomepageProvider");
  }
  return context;
};