import React from "react";
import Image from "next/image";
import {
  Camera,
  Trash2,
  PackageSearch,
  Building2,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/hooks/useFormatPrice";
import { SelectComponent } from "@/components";
import { ReturnOrderDetailsFormProps } from "./type";

export const ReturnOrderDetailsForm: React.FC<ReturnOrderDetailsFormProps> = ({
  order,
  productName,
  productImage,
  bankAccounts,
  selectedBankId,
  setSelectedBankId,
  reason,
  setReason,
  reasonsList,
  description,
  setDescription,
  selectedImages,
  handleImageChange,
  removeImage,
}) => {
  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4  duration-500 pb-4">
      <div className="bg-gray-50/80 backdrop-blur-md border border-white rounded-[2rem] p-4 flex items-center gap-4 shadow-sm group">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden  shadow-inner bg-white shrink-0 ring-1 ring-black/5">
          {productImage ? (
            <Image
              src={productImage}
              alt="Product"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <PackageSearch size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-semibold text-gray-800 line-clamp-1">
            {productName || "Sản phẩm yêu cầu hoàn tiền"}
          </h4>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">
              Số tiền hoàn:
            </span>
            <span className="text-sm font-bold text-orange-600">
              {formatPrice(order.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Lý do (Dạng Minimalist) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
            Lý do hoàn trả <span className="text-red-400">*</span>
          </label>
        </div>
        <SelectComponent
          options={reasonsList.map((r) => ({ label: r, value: r }))}
          value={reason}
          onChange={(val) => setReason(val)}
          placeholder="Vui lòng chọn lý do cụ thể..."
          className="w-full h-12 rounded-2xl border-gray-100 bg-white shadow-sm hover:border-orange-300 transition-colors"
        />
      </div>

      {/* 3. Ngân hàng (Dạng Modern Selection) */}
      <div className="space-y-3">
        <label className="px-1 text-[11px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
          Nhận tiền về tài khoản
        </label>
        <div className="space-y-2">
          {bankAccounts.map((bank) => {
            const isSelected = selectedBankId === bank.bankAccountId;
            return (
              <div
                key={bank.bankAccountId}
                onClick={() => setSelectedBankId(bank.bankAccountId)}
                className={cn(
                  "cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                  isSelected
                    ? "border-orange-500 bg-orange-50/30 shadow-md"
                    : "border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    isSelected
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-400"
                  )}
                >
                  <Building2 size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">
                      {bank.bankName}
                    </span>
                    {bank.default && (
                      <span className="text-[8px] bg-gray-800 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 truncate uppercase">
                    {bank.bankAccountNumber} • {bank.bankAccountHolder}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Hình ảnh (Dạng Instagram Style Grid) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
            Minh chứng thực tế ({selectedImages.length}/6)
          </label>
          <div className="group relative">
            <Info size={14} className="text-gray-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
              Cung cấp ảnh rõ nét để được xử lý nhanh hơn (Tối đa 6 ảnh)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <label className="aspect-square border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-orange-400 hover:text-orange-500 transition-all text-gray-400">
            <Camera size={22} strokeWidth={1.5} />
            <span className="text-[9px] font-bold mt-1.5 uppercase">
              Tải ảnh
            </span>
            <input
              type="file"
              multiple
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>

          {selectedImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm ring-1 ring-black/5"
            >
              <Image
                src={src}
                alt="preview"
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all scale-75 group-hover:scale-100"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="px-1 text-[11px] font-bold uppercase text-gray-500 tracking-wider">
          Mô tả chi tiết
        </label>
        <textarea
          className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-xs font-medium text-gray-700 placeholder:text-gray-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-50/50 outline-none transition-all min-h-[100px] shadow-sm"
          placeholder="Vui lòng cho chúng tôi biết thêm chi tiết về vấn đề này..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 flex gap-3 items-start">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
          Sau khi gửi yêu cầu, người bán sẽ có 24h để phản hồi. Nếu không thống
          nhất, hệ thống sẽ tự động can thiệp xử lý.
        </p>
      </div>
    </div>
  );
};
