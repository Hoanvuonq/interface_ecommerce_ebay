"use client";

import WalletPage from "@/app/(main)/profile/_pages/Wallet";
import { WalletType } from "@/types/wallet/wallet.types";

export default function ShopWalletScreen() {
    return <WalletPage type={WalletType.SHOP} />;
}

