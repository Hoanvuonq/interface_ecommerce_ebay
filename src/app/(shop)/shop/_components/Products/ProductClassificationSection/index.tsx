"use client";

import { Plus, Trash2, X, Layers } from "lucide-react";
import { cn } from "@/utils/cn";

export interface OptionGroup {
  id: string;
  name: string;
  values: string[];
}

interface ProductClassificationSectionProps {
  optionGroups: OptionGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (index: number) => void;
  onUpdateGroupName: (index: number, value: string) => void;
  onAddValue: (groupIndex: number) => void;
  onRemoveValue: (groupIndex: number, valueIndex: number) => void;
  onUpdateValue: (
    groupIndex: number,
    valueIndex: number,
    value: string
  ) => void;
  maxGroups?: number;
}

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
    <div className="p-8 bg-white rounded-4xl border border-gray-100/50 shadow-sm space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 rounded-2xl">
            <Layers className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">
              Phân loại sản phẩm
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-0.5">
              Tạo các biến thể linh hoạt như Màu sắc, Kích thước, Chất liệu...
            </p>
          </div>
        </div>

        {optionGroups.length < maxGroups && (
          <button
            type="button"
            onClick={onAddGroup}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            <Plus size={16} strokeWidth={3} /> Thêm nhóm
          </button>
        )}
      </div>

      {/* Content Area */}
      {optionGroups.length === 0 ? (
        <div className="p-12 text-center bg-orange-50/30 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Layers className="w-8 h-8 text-orange-200" />
          </div>
          <p className="text-sm font-bold text-gray-400 mb-4">
            Sản phẩm này chưa có các phiên bản phân loại.
          </p>
          <button
            type="button"
            onClick={onAddGroup}
            className="px-6 py-2.5 bg-white border border-gray-200 text-orange-600 rounded-2xl text-xs font-bold hover:bg-orange-50 hover:border-gray-500 transition-all shadow-sm"
          >
            + Bắt đầu thêm phân loại ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {optionGroups.map((group, groupIdx) => (
            <div
              key={group.id}
              className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group/panel transition-all duration-300 hover:border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5"
            >
              {/* Nút xóa nhóm */}
              <button
                type="button"
                onClick={() => onRemoveGroup(groupIdx)}
                className="absolute -top-3 -right-3 p-2 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-md opacity-0 group-hover/panel:opacity-100 scale-75 group-hover/panel:scale-100"
                title="Xóa nhóm này"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Tên nhóm */}
                <div className="md:col-span-4 space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Nhóm phân loại {groupIdx + 1}
                  </label>
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) =>
                      onUpdateGroupName(groupIdx, e.target.value)
                    }
                    placeholder="VD: Màu sắc"
                    className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                {/* Giá trị tùy chọn */}
                <div className="md:col-span-8 space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Các giá trị phân loại
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {group.values.map((val, valIdx) => (
                      <div key={valIdx} className="relative group/tag">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            onUpdateValue(groupIdx, valIdx, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              valIdx === group.values.length - 1 &&
                              val.trim()
                            ) {
                              e.preventDefault();
                              onAddValue(groupIdx);
                            }
                          }}
                          placeholder="Giá trị..."
                          className="w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 outline-none transition-all focus:border-gray-400 focus:ring-4 focus:ring-orange-400/5 hover:border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveValue(groupIdx, valIdx)}
                          className="absolute -top-2 -right-2 bg-white text-gray-400 rounded-lg p-1 shadow-md opacity-0 group-hover/tag:opacity-100 hover:bg-red-500 hover:text-white transition-all scale-90"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}

                    {/* Nút thêm giá trị con */}
                    <button
                      type="button"
                      onClick={() => onAddValue(groupIdx)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border-2 border-dashed border-gray-200 rounded-xl text-[11px] font-bold text-orange-600 hover:bg-orange-50 hover:border-gray-500 transition-all shadow-sm"
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

      <div className="flex gap-4 p-5 bg-orange-50/50 border border-gray-100 rounded-3xl">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-600">
          <Plus size={20} className="rotate-45" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">
            Lưu ý khi phân loại
          </h4>
          <p className="text-xs text-orange-900/70 leading-relaxed font-semibold">
            Kết hợp tối đa 2 nhóm (VD: Màu sắc & Kích thước) sẽ tạo ra các biến
            thể tương ứng bên dưới. Đảm bảo các giá trị không trùng lặp.
          </p>
        </div>
      </div>
    </div>
  );
};
