"use client";

import { Plus, Trash2, X, Layers, Sparkles, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { FormInput } from "@/components";
import { ProductClassificationSectionProps } from "./type";

export const ProductClassificationSection = ({
  optionGroups,
  onAddGroup,
  onRemoveGroup,
  onUpdateGroupName,
  onAddValue,
  onRemoveValue,
  onUpdateValue,
  maxGroups = 2,
}: ProductClassificationSectionProps) => {
  return (
    <div className="p-8 bg-white rounded-4xl border border-gray-100/50 shadow-custom space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200/50 shadow-inner">
            <Layers className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
              Phân loại sản phẩm
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase  mt-1.5">
              Quản lý thuộc tính và biến thể sản phẩm
            </p>
          </div>
        </div>

        {optionGroups.length < maxGroups && (
          <button
            type="button"
            onClick={onAddGroup}
            className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-600 rounded-2xl text-[10px] font-bold uppercase  hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Thêm nhóm mới
          </button>
        )}
      </div>

      {optionGroups.length === 0 ? (
        <div className="p-16 text-center bg-gray-50/50 rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center group transition-all hover:bg-white hover:border-orange-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Layers className="w-10 h-10 text-orange-200 group-hover:text-orange-500" />
          </div>
          <div className="max-w-xs space-y-2">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight">
              Chưa có phân loại
            </h4>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
              Sản phẩm của bạn có nhiều kích thước hay màu sắc không? Hãy thêm
              chúng ngay.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddGroup}
            className="mt-6 px-8 py-3 bg-white border border-gray-200 text-orange-600 rounded-2xl text-[10px] font-extrabold uppercase  hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm active:scale-95"
          >
            + Bắt đầu thiết lập
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {optionGroups.map((group, groupIdx) => (
            <div
              key={group.id}
              className="p-8 bg-gray-50/30 rounded-4xl border border-gray-100 relative group/panel transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5 hover:border-orange-100"
            >
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => onRemoveGroup(groupIdx)}
                className="absolute top-6 right-6 p-2.5 bg-white text-gray-300 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm border border-gray-50 opacity-0 group-hover/panel:opacity-100"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex flex-col lg:flex-row gap-10">
                {/* Group Name Section */}
                <div className="lg:w-1/3">
                  <FormInput
                    label={`Tên nhóm ${groupIdx + 1}`}
                    value={group.name}
                    onChange={(e) =>
                      onUpdateGroupName(groupIdx, e.target.value)
                    }
                    placeholder="VD: Màu sắc, Size..."
                    className="font-bold text-gray-800 h-12"
                    containerClassName="space-y-3"
                  />
                </div>

                <div className="lg:w-2/3 space-y-3">
                  <label className="text-[10px] font-bold text-gray-600 uppercase  ml-1 flex items-center gap-2">
                    Các giá trị phân loại
                    <Sparkles size={12} className="text-orange-400" />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {group.values.map((val, valIdx) => (
                      <div
                        key={valIdx}
                        className="relative group/tag min-w-3.5"
                      >
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            onUpdateValue(groupIdx, valIdx, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && val.trim()) {
                              e.preventDefault();
                              onAddValue(groupIdx);
                            }
                          }}
                          placeholder="Vd: Đỏ, XL, 42...  "
                          className={cn(
                            "w-full pl-4 pr-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold",
                            "text-gray-700 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 hover:border-gray-300 shadow-custom"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveValue(groupIdx, valIdx)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-50 text-gray-300 rounded-lg p-1 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/tag:opacity-100"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => onAddValue(groupIdx)}
                      className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-95"
                    >
                      <Plus size={14} strokeWidth={3} /> THÊM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative group overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 to-pink-500/5" />
        <div className="relative flex gap-5 p-6 border border-orange-100/50 rounded-4xl items-center">
          <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-500 ring-4 ring-orange-50/50">
            <Info size={22} />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold text-orange-700 uppercase tracking-[0.2em]">
              Mẹo nhỏ thiết lập
            </h4>
            <p className="text-xs text-orange-900/60 leading-relaxed font-semibold">
              Sử dụng tối đa 2 nhóm thuộc tính để đảm bảo trải nghiệm khách hàng
              tốt nhất. Các biến thể sẽ tự động được tạo ra bên dưới sau khi bạn
              nhập giá trị.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
