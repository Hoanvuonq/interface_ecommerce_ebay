import { WalletType, WalletWithdrawalResponse } from "@/types/wallet/wallet.types";

export interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  walletType: WalletType;
}



export interface WithdrawalRequestModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: (withdrawal: WalletWithdrawalResponse) => void;
    availableBalance: number;
    walletType: WalletType; 
}

export interface WalletPageProps {
  userId?: string;
  autoCreate?: boolean;
  type: WalletType; 
}