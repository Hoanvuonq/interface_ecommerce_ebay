"use client";

import { Plus, Trash2, X } from "lucide-react";
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
  onUpdateValue: (groupIndex: number, valueIndex: number, value: string) => void;
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
    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Phân loại sản phẩm</h3>
          <p className="text-xs text-gray-500 mt-1">
            Tạo các biến thể như Màu sắc, Kích thước...
          </p>
        </div>
        {optionGroups.length < maxGroups && (
          <button
            type="button"
            onClick={onAddGroup}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase hover:bg-blue-100 transition-colors"
          >
            <Plus size={14} /> Thêm nhóm
          </button>
        )}
      </div>

      {optionGroups.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Chưa có nhóm phân loại nào.</p>
          <button
             type="button"
             onClick={onAddGroup}
             className="text-sm font-bold text-blue-600 hover:underline"
          >
            + Thêm nhóm phân loại ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {optionGroups.map((group, groupIdx) => (
            <div
              key={group.id}
              className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 relative group/panel transition-all hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5"
            >
              <button
                type="button"
                onClick={() => onRemoveGroup(groupIdx)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa nhóm này"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Tên nhóm {groupIdx + 1}
                  </label>
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => onUpdateGroupName(groupIdx, e.target.value)}
                    placeholder="VD: Màu sắc"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                {/* Cột 2: Các giá trị (Đỏ, Xanh, S, M...) */}
                <div className="md:col-span-8 space-y-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Giá trị tùy chọn
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((val, valIdx) => (
                      <div key={valIdx} className="relative group/tag">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => onUpdateValue(groupIdx, valIdx, e.target.value)}
                          // Logic: Enter ở input cuối thì thêm input mới
                          onKeyDown={(e) => {
                             if(e.key === 'Enter' && valIdx === group.values.length - 1 && val.trim()) {
                                 e.preventDefault();
                                 onAddValue(groupIdx);
                             }
                          }}
                          placeholder="Giá trị..."
                          className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveValue(groupIdx, valIdx)}
                          className="absolute -top-1.5 -right-1.5 bg-gray-200 text-gray-500 rounded-full p-0.5 opacity-0 group-hover/tag:opacity-100 hover:bg-red-500 hover:text-white transition-all scale-75 hover:scale-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Nút thêm giá trị */}
                    <button
                      type="button"
                      onClick={() => onAddValue(groupIdx)}
                      className="flex items-center gap-1 px-3 py-2 bg-white border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <Plus size={14} /> Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};