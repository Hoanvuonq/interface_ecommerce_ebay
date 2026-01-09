export interface ReturnOrderDetailsFormProps {
  order: any;
  productName?: string;
  productImage?: string;
  bankAccounts: any[];
  selectedBankId: string;
  setSelectedBankId: (id: string) => void;
  reason: string;
  setReason: (r: string) => void;
  reasonsList: string[];
  description: string;
  setDescription: (d: string) => void;
  selectedImages: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (idx: number) => void;
}
