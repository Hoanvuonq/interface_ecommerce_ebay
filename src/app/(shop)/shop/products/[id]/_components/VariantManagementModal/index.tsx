"use client";

import { Plus, Trash2, Package, ImageIcon, Loader2, Save, X, Edit3 } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { VariantRow } from "../../_types/variant";
import { cn } from "@/utils/cn";

interface VariantManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  manageRows: VariantRow[];
  optionNames: string[];
  productOptions: any[];
  isAddingNewOption: boolean;
  newOptionName: string;
  manageSaving: boolean;
  manageImageUploadingRow: string | null;
  onFieldChange: (rowKey: string, field: any) => (val: any) => void;
  onOptionChange: (rowKey: string, name: string, val: string) => void;
  onImageUpload: (rowKey: string, file: File | null) => void;
  onImageClear: (rowKey: string) => void;
  onAddRow: () => void;
  onRemoveRow: (rowKey: string, isNew?: boolean) => void;
  onSave: () => void;
  onStartAddOption: () => void;
  setNewOptionName: (val: string) => void;
  onBlurNewOption: () => void;
  getColorPreview: (name: string, val?: string) => string | null;
}

export const VariantManagementModal = (props: VariantManagementModalProps) => {
  const {
    isOpen, onClose, productName, manageRows, optionNames, productOptions,
    isAddingNewOption, newOptionName, manageSaving, manageImageUploadingRow,
    onFieldChange, onOptionChange, onImageUpload, onImageClear, onAddRow,
    onRemoveRow, onSave, onStartAddOption, setNewOptionName, onBlurNewOption, getColorPreview
  } = props;

  const footer = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onAddRow}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-all font-bold text-xs uppercase tracking-wider"
      >
        <Plus size={16} strokeWidth={3} /> Thêm dòng mới
      </button>
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-600">
          Đóng
        </button>
        <button
          onClick={onSave}
          disabled={manageSaving || !!manageImageUploadingRow}
          className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {manageSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[95vw]"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-xl text-white shadow-md">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 uppercase tracking-tight">Quản lý biến thể</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">{productName}</p>
          </div>
        </div>
      }
      footer={footer}
    >
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest w-12">#</th>
              <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest w-24">Media</th>
              <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest min-w-40">Thông tin SKU</th>
              <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest w-40">Giá bán (₫)</th>
              <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest w-28">Kho</th>
              <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest min-w-50">Phân loại</th>
              <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest w-20">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {manageRows.map((row, idx) => (
              <tr key={row.rowKey} className={cn("hover:bg-orange-50/30 transition-colors", row.isNew && "bg-orange-50/10")}>
                <td className="px-4 py-4 text-gray-500 font-bold text-xs">{idx + 1}</td>
                <td className="px-4 py-4 text-center">
                   <label className="relative block w-14 h-14 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden cursor-pointer group/img">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageUpload(row.rowKey, e.target.files?.[0] || null)} />
                      {row.imageUrl ? (
                        <img src={row.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-500 absolute inset-0 m-auto" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                         <Edit3 size={14} className="text-white" />
                      </div>
                   </label>
                </td>
                <td className="px-4 py-4">
                   <input
                    value={row.sku}
                    onChange={(e) => onFieldChange(row.rowKey, "sku")(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 outline-none font-bold text-gray-700 transition-all shadow-inner"
                    placeholder="Mã SKU..."
                   />
                </td>
                <td className="px-4 py-4">
                   <div className="relative">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => onFieldChange(row.rowKey, "price")(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-orange-50/30 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 outline-none font-bold text-orange-600 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-orange-400">₫</span>
                   </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <input
                    type="number"
                    value={row.stockQuantity}
                    onChange={(e) => onFieldChange(row.rowKey, "stockQuantity")(e.target.value)}
                    className="w-16 text-center py-2 border-b-2 border-gray-100 focus:border-gray-500 outline-none font-bold text-gray-700"
                  />
                </td>
                <td className="px-4 py-4">
                   <div className="flex flex-wrap gap-2">
                      {optionNames.map(name => (
                        <div key={name} className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-gray-500 uppercase ml-1">{name}</span>
                          <input 
                            value={row.optionValues[name] || ""}
                            onChange={(e) => onOptionChange(row.rowKey, name, e.target.value)}
                            className="px-2 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:border-gray-200 outline-none"
                            placeholder="..."
                          />
                        </div>
                      ))}
                   </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <button 
                    onClick={() => onRemoveRow(row.rowKey, row.isNew)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalModal>
  );
};