export type AddressRole = "isDefault" | "isDefaultPickup" | "isDefaultReturn";


export interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  modalData: any;
  setModalData: React.Dispatch<React.SetStateAction<any>>;
  modalErrors: any;
  setModalErrors: React.Dispatch<React.SetStateAction<any>>;
  provinceOptions: any[];
  wardOptions: any[];
  provinces: any[];
  wards: any[];
  isEdit?: boolean;
}
