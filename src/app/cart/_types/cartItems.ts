import { CartItemDto } from "@/types/cart/cart.types";

export interface CartItemProps {
  item: CartItemDto;
  etag: string;
  selected?: boolean;
  onToggleSelection?: (itemId: string) => void;
  isMobile?: boolean;
}