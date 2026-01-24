"use client";
import { CustomButtonActions, FormInput, SelectComponent } from "@/components";
import { Filter, SearchIcon } from "lucide-react";
import { FilterBarProps } from "./type";

export const FilterBar = ({
  keyword,
  setKeyword,
  categoryId,
  setCategoryId,
  shopId,
  setShopId,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApply,
  onClear,
}: FilterBarProps) => {
  // Giả sử bạn truyền danh sách options từ Props hoặc Fetch
  // Đây là ví dụ format dữ liệu cho SelectComponent
  const categoryOptions = [
    { label: "Điện tử", value: "1" },
    { label: "Thời trang", value: "2" },
    { label: "Gia dụng", value: "3" },
  ];

  const shopOptions = [
    { label: "Apple Store", value: "s1" },
    { label: "Samsung Official", value: "s2" },
    { label: "Nike Global", value: "s3" },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 mb-8 shadow-custom animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 shadow-inner">
          <Filter size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tighter  text-gray-800 italic leading-none">
            Bộ lọc thông minh
          </h3>
          <p className="text-[10px] font-bold  text-gray-400 uppercase  mt-1">
            Search & Filter Protocol
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-6">
          <FormInput
            label="Từ khóa sản phẩm"
            placeholder="Tên sản phẩm, mã SKU, thương hiệu..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-12 shadow-custom bg-white"
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <label className="block text-[12px] font-bold text-gray-700 ml-1 mb-2 uppercase tracking-widest">
            Danh mục
          </label>
          <SelectComponent
            options={categoryOptions}
            value={categoryId}
            onChange={(val) => setCategoryId(val)}
            placeholder="Tất cả danh mục"
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <label className="block text-[12px] font-bold text-gray-700 ml-1 mb-2 uppercase tracking-widest">
            Cửa hàng
          </label>
          <SelectComponent
            options={shopOptions}
            value={shopId}
            onChange={(val) => setShopId(val)}
            placeholder="Tất cả các shop"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-8  border-t border-slate-100">
        <div className="w-full md:w-auto">
          <label className="block text-[10px] font-bold uppercase   text-gray-400 mb-4 ml-1">
            Phân khúc giá (VND)
          </label>
          <div className="flex items-center gap-4">
            <FormInput
              type="number"
              placeholder="Từ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              maxLengthNumber={12}
              containerClassName="w-full md:w-40 space-y-0"
              className="h-10 text-center shadow-custom font-bold text-orange-600 bg-white"
            />
            <div className="w-4 h-0.5 bg-slate-200 rounded-full shrink-0" />
            <FormInput
              type="number"
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              maxLengthNumber={12}
              containerClassName="w-full md:w-40 space-y-0"
              className="h-10 text-center shadow-custom font-bold text-orange-600 bg-white"
            />
          </div>
        </div>

        {/* Actions Button */}
        <div className="w-full md:w-auto pt-4 md:pt-0">
          <CustomButtonActions
            onCancel={onClear}
            onSubmit={onApply}
            cancelText="Xóa bộ lọc"
            submitText="Áp dụng bộ lọc"
            submitIcon={SearchIcon}
            className="w-full md:w-56! h-12! rounded-2xl shadow-orange-500/20 bg-orange-500 border-b-4 border-orange-700 hover:bg-orange-600 transition-all shadow-xl"
            containerClassName="border-t-0 p-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
