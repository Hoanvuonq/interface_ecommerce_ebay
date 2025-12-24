export interface IAddressInfo {
  recipientName: string;
  phone: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
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
