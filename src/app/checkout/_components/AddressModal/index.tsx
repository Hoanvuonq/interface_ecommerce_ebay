"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Plus, Info } from "lucide-react";
import { AddressModalProps, NewAddressForm } from "../../_types/address";
import { createPortal } from "react-dom";
import { Button } from "@/components/button/button";

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  currentAddressId,
  onConfirmSaved,
  onConfirmNew,
}) => {
  const [activeTab, setActiveTab] = useState<"saved" | "new">("saved");
  const [selectedId, setSelectedId] = useState<string | undefined>(currentAddressId);

  const [newAddress, setNewAddress] = useState<NewAddressForm>({
    recipientName: "",
    phoneNumber: "",
    detailAddress: "",
    ward: "",
    district: "",
    province: "",
    email: "",
  });

  // Đồng bộ tab và địa chỉ đã chọn khi mở modal
  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentAddressId);
      if (savedAddresses.length === 0) setActiveTab("new");
      else setActiveTab("saved");
    }
  }, [isOpen, currentAddressId, savedAddresses.length]);

  if (!isOpen) return null;

  const handleConfirm = (e: React.MouseEvent) => {
    // Ngăn chặn trigger submit form cha
    e.preventDefault();
    e.stopPropagation();

    if (activeTab === "saved") {
      if (selectedId) onConfirmSaved(selectedId);
    } else {
      if (
        !newAddress.recipientName ||
        !newAddress.phoneNumber ||
        !newAddress.detailAddress ||
        !newAddress.province
      ) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }
      onConfirmNew(newAddress);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
              Địa chỉ <span className="text-orange-500">giao hàng</span>
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {activeTab === 'saved' ? 'Chọn từ danh sách đã lưu' : 'Nhập thông tin nhận hàng mới'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex bg-slate-50 p-2 gap-2 mx-6 mt-4 rounded-2xl border border-slate-100">
          <button
            type="button"
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
              activeTab === "saved"
                ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Đã lưu ({savedAddresses.length})
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
              activeTab === "new"
                ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveTab("new")}
          >
            Thêm mới
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === "saved" ? (
            <div className="grid grid-cols-1 gap-3">
              {savedAddresses.length > 0 ? (
                savedAddresses.map((addr, index) => {
                  const isSelected = selectedId === addr.addressId;
                  return (
                    <div
                      key={addr.addressId}
                      onClick={() => setSelectedId(addr.addressId)}
                      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-50"
                          : "border-slate-100 hover:border-orange-200 bg-white"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-slate-900 uppercase text-sm italic">
                              {addr.recipientName}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-500 font-bold text-sm">{addr.phone}</span>
                            {index === 0 && (
                              <span className="ml-auto text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                Gần đây
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-2">
                            {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="text-slate-300" size={32} />
                   </div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Danh sách trống</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputGroup label="Người nhận" required>
                  <input
                    type="text"
                    placeholder="NGUYỄN VĂN A"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-bold text-sm uppercase italic tracking-tight"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({...newAddress, recipientName: e.target.value.toUpperCase()})}
                  />
                </InputGroup>
                <InputGroup label="Số điện thoại" required>
                  <input
                    type="tel"
                    placeholder="09xx xxx xxx"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-bold text-sm"
                    value={newAddress.phoneNumber}
                    onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Địa chỉ chi tiết" required>
                <input
                  type="text"
                  placeholder="SỐ NHÀ, TÊN ĐƯỜNG..."
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-bold text-sm"
                  value={newAddress.detailAddress}
                  onChange={(e) => setNewAddress({...newAddress, detailAddress: e.target.value})}
                />
              </InputGroup>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <InputGroup label="Tỉnh/Thành" required>
                  <input
                    type="text"
                    placeholder="TP. HCM"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-bold text-sm"
                    value={newAddress.province}
                    onChange={(e) => setNewAddress({...newAddress, province: e.target.value})}
                  />
                </InputGroup>
                <InputGroup label="Quận/Huyện" required>
                  <input
                    type="text"
                    placeholder="QUẬN 1"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-bold text-sm"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                  />
                </InputGroup>
                <InputGroup label="Phường/Xã" required>
                  <input
                    type="text"
                    placeholder="PHƯỜNG..."
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 outline-none transition-all font-bold text-sm"
                    value={newAddress.ward}
                    onChange={(e) => setNewAddress({...newAddress, ward: e.target.value})}
                  />
                </InputGroup>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/50">
          <Button 
            type="button" 
            variant="edit" 
            onClick={onClose} 
            className="border-0 bg-transparent "
          >
            Hủy bỏ
          </Button>
          
          <Button
            type="button"
            variant="edit"
            onClick={handleConfirm}
            className="min-w-[160px] shadow-orange-200"
          >
            <div className="flex items-center gap-2 uppercase tracking-widest text-[11px] font-black">
              {activeTab === "new" ? <Plus size={16} strokeWidth={3} /> : <CheckCircle2 size={16} strokeWidth={3} />}
              Xác nhận địa chỉ
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const InputGroup = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
  </div>
);

export default AddressModal;