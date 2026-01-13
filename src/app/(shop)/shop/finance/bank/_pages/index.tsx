"use client";

import BankAccountManagement from "@/app/(main)/profile/_pages/BankAccount";
import { BankAccountType } from "@/types/bank/bank-account.types";

export default function ShopBankAccountScreen() {
  return <BankAccountManagement accountType={BankAccountType.SHOP} />;
}
