"use client";

import { cn } from "@/utils/cn";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SelectComponent } from "@/components";

interface SortBarProps {
  currentSort: string;
  currentPage: number;
  totalPages: number;
}

export default function SortBar({ currentSort, currentPage, totalPages }: SortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.set("page", "0"); // Reset về trang 1 khi đổi sắp xếp
    return params.toString();
  };

  const handleSortChange = (value: string) => {
    const queryString = createQueryString("sort", value);
    router.push(`${pathname}?${queryString}`);
  };

  const sortOptions = [
    { label: "Liên quan", value: "" },
    { label: "Mới nhất", value: "createdDate,desc" },
    { label: "Bán chạy", value: "sold,desc" },
  ];

  // Options cho Dropdown giá
  const priceOptions = [
    { label: "Giá: Mặc định", value: "" },
    { label: "Giá: Thấp đến Cao", value: "basePrice,asc" },
    { label: "Giá: Cao đến Thấp", value: "basePrice,desc" },
  ];

  // Xác định giá trị hiện tại cho dropdown giá
  const currentPriceValue = currentSort.includes("basePrice") ? currentSort : "";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-5">
        <span className="text-sm font-medium text-gray-500">Sắp xếp theo</span>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {sortOptions.map((btn) => (
            <Link
              key={btn.label}
              href={`${pathname}?${createQueryString("sort", btn.value)}`}
              className={cn(
                "px-5 py-2 text-[13px] rounded-xl border transition-all duration-200 font-medium",
                currentSort === btn.value
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100"
                  : "bg-white border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600"
              )}
            >
              {btn.label}
            </Link>
          ))}

          {/* <div className="w-[180px]">
            <SelectComponent
              options={priceOptions}
              value={currentPriceValue}
              onChange={handleSortChange}
              placeholder="Giá"
              className="h-10" 
            />
          </div> */}
          </div>
          
      </div>
      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
        <p className="text-sm font-medium text-gray-600">
          Trang <span className="text-orange-600">{currentPage + 1}</span>
          <span className="mx-1 text-gray-600">/</span>
          <span className="text-gray-500">{totalPages}</span>
        </p>
      </div>
    </div>
  );
}