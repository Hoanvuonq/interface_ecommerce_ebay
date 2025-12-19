"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import bankAccountService from "@/services/bank/bank-account.service";
import type { BankInfo } from "@/types/bank/bank-account.types";

// Định nghĩa Props (Loại bỏ SelectProps của Antd)
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
  // State
  const [banks, setBanks] = useState<BankInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Refs để xử lý click outside
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllBanks();

    // Event listener để đóng dropdown khi click ra ngoài
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus vào ô tìm kiếm khi mở dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const loadAllBanks = async () => {
    setLoading(true);
    try {
      const allBanks = await bankAccountService.getAllBanks();
      setBanks(allBanks);
    } catch (error) {
      console.error("Lỗi tải danh sách ngân hàng:", error);
      // Bạn có thể dùng toast của riêng bạn ở đây thay vì message.error
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc danh sách ngân hàng
  const filteredBanks = useMemo(() => {
    if (!searchTerm) return banks;
    const lowerSearch = searchTerm.toLowerCase();
    return banks.filter((bank) => {
      const content = `${bank.code} ${bank.shortName} ${bank.fullName}`.toLowerCase();
      return content.includes(lowerSearch);
    });
  }, [banks, searchTerm]);

  // Tìm ngân hàng đang được chọn để hiển thị label
  const selectedBankObj = banks.find((b) => b.shortName === value);

  // Xử lý chọn
  const handleSelect = (bankShortName: string) => {
    if (onChange) {
      onChange(bankShortName);
    }
    setIsOpen(false);
    setSearchTerm(""); // Reset tìm kiếm sau khi chọn
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* --- TRIGGER BUTTON (Phần hiển thị chính) --- */}
      <div
        onClick={() => !loading && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 bg-white border rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200
          ${isOpen ? "border-orange-500 ring-2 ring-orange-100" : "border-gray-300 hover:border-orange-400"}
          ${loading ? "opacity-70 cursor-wait" : ""}
        `}
      >
        <span className={`block truncate ${selectedBankObj ? "text-gray-900 font-medium" : "text-gray-400"}`}>
          {selectedBankObj
            ? `${selectedBankObj.shortName} - ${selectedBankObj.fullName}`
            : loading
            ? "Đang tải danh sách..."
            : placeholder}
        </span>

        {/* Mũi tên icon */}
        <div className="ml-2 flex-shrink-0 text-gray-400">
            {loading ? (
                 /* Loading Icon Spinner */
                <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                /* Arrow Down Icon */
                <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </div>
      </div>

      {/* --- DROPDOWN PANEL --- */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          
          {/* Thanh tìm kiếm sticky ở đầu */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="Tìm ngân hàng (VD: VCB, Vietcombank)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Danh sách options */}
          <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => {
                const isSelected = bank.shortName === value;
                return (
                  <li
                    key={bank.code} 
                    onClick={() => handleSelect(bank.shortName)}
                    className={`
                      cursor-pointer px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between group
                      ${isSelected ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"}
                    `}
                  >
                    <div className="flex flex-col">
                        <span className="font-semibold">{bank.shortName}</span>
                        <span className={`text-xs ${isSelected ? "text-orange-500" : "text-gray-500 group-hover:text-orange-400"}`}>
                            {bank.fullName}
                        </span>
                    </div>

                    {/* Icon check nếu được chọn */}
                    {isSelected && (
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-8 text-center text-gray-500 text-sm">
                Không tìm thấy ngân hàng nào.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}