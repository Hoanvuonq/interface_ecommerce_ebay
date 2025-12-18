import { ShopDto } from "@/types/cart/cart.types";

export interface ShopCartSectionProps {
    shop: ShopDto;
    etag: string;
    onToggleShopSelection?: (shopId: string) => void;
}
