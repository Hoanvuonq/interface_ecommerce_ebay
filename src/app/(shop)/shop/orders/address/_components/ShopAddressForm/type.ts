export type AddressType = "PICKUP" | "RETURN" | "BOTH" | "OTHER";

export interface ShopAddress {
  addressId: string;
  address: any;
  type: AddressType;
  fullName: string;
  phone: string;
  default: boolean;
  defaultPickup: boolean;
  defaultReturn: boolean;
}
