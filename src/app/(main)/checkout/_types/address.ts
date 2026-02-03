export interface IAddressDetail {
  detail: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  zipCode?: string;
  geoinfo?: {
    latitude: number;
    longitude: number;
    userVerified?: boolean;
    confirmed?: boolean;
  };
}

export interface IAddressInfo {
  addressId: string;
  recipientName: string;
  phone: string;
  type: "HOME" | "OFFICE" | "OTHER";
  isDefault: boolean;
  address: IAddressDetail;
}
export interface ShippingAddressCardProps {
  selectedAddress: IAddressInfo | null;
  onOpenModal: () => void;
  hasAddress: boolean;
}

export interface SavedAddress {
  addressId: string;
  recipientName: string;
  phone: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
  isDefault?: boolean;
}

export interface NewAddressForm {
  recipientName: string;
  phoneNumber: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
  email?: string;
}

export interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddresses: SavedAddress[];
  currentAddressId?: string;
  onConfirmSaved: (addressId: string) => void;
  onConfirmNew: (data: NewAddressForm) => void;
}
