"use client";

import { useState, useEffect, useMemo } from "react";
import bankAccountService from "@/services/bank/bank-account.service";
import type { BankInfo } from "@/types/bank/bank-account.types";
import { SelectComponent } from "@/components";

interface BankSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function BankSelector({
  value,
  onChange,
  className = "",
  placeholder = "Chọn ngân hàng",
}: BankSelectorProps) {
  const [banks, setBanks] = useState<BankInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAllBanks = async () => {
      setLoading(true);
      try {
        const allBanks = await bankAccountService.getAllBanks();
        setBanks(allBanks);
      } catch (error) {
        console.error("Lỗi tải danh sách ngân hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllBanks();
  }, []);

  const bankOptions = useMemo(() => {
    return banks.map((bank) => ({
      value: bank.shortName,
      label: `${bank.shortName} - ${bank.fullName}`,
    }));
  }, [banks]);

  const handleChange = (val: string) => {
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <SelectComponent
        options={bankOptions}
        value={value || ""}
        onChange={handleChange}
        placeholder={loading ? "Đang tải danh sách..." : placeholder}
        disabled={loading}
        className="w-full"
      />
    </div>
  );
}
