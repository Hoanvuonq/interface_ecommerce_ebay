export interface CreateBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}