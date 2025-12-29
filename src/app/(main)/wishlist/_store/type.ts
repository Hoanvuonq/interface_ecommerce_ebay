import { WishlistResponse ,WishlistSummaryResponse} from "@/types/wishlist/wishlist.types";


export interface WishlistState {
    wishlists: WishlistSummaryResponse[];
    selectedWishlist: WishlistResponse | null;
    selectedWishlistId: string | null;
    loading: boolean; // Gộp loading chung
    loadingDetails: boolean;
    removingIds: Set<string>;
    priceTargetMap: Map<string, number>;

    // Actions (Chỉ setter data)
    setWishlists: (data: WishlistSummaryResponse[]) => void;
    setSelectedWishlist: (data: WishlistResponse | null) => void;
    setSelectedWishlistId: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
    setLoadingDetails: (loading: boolean) => void;
    setRemovingId: (id: string, isRemoving: boolean) => void;
    setPriceTargetMap: (map: Map<string, number>) => void;
}