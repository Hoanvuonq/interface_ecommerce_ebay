import { BankAccountType } from "@/types/bank/bank-account.types";

export interface BankAccountManagementProps {
  accountType: BankAccountType;
}

export interface FormDataState {
  bankAccountNumber: string;
  bankName: string; // Lưu shortName
  bankAccountHolder: string;
  branch: string;
  isDefault: boolean;
}

export const INITIAL_FORM_DATA: FormDataState = {
  bankAccountNumber: "",
  bankName: "",
  bankAccountHolder: "",
  branch: "",
  isDefault: false,
};