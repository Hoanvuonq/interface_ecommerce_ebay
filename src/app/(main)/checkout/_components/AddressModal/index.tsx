"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Plus, Info } from "lucide-react";
import { AddressModalProps } from "../../_types/address";
import { Button } from "@/components/button/button";
import { PortalModal } from "@/features/PortalModal";
import { AddressFormModal } from "@/app/(main)/profile/_components/AddressModal";
import { getStoredUserDetail } from "@/utils/jwt";
import { useCheckoutAddress } from "../../_hooks/useCheckoutAddress";
import { useToast } from "@/hooks/useToast";
import { SectionLoading } from "@/components/loading";
import { FaCheckCircle } from "react-icons/fa";

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  currentAddressId,
  onConfirmSaved,
}) => {
  const user = getStoredUserDetail();
  const [activeTab, setActiveTab] = useState<"saved" | "new">("saved");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    currentAddressId
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateAddressList, updateAddress } = useCheckoutAddress();
  const { success } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentAddressId);
      setActiveTab(savedAddresses.length === 0 ? "new" : "saved");
      setIsUpdating(false);
    }
  }, [isOpen, currentAddressId, savedAddresses.length]);

  const handleConfirm = async () => {
    if (selectedId) {
      setIsUpdating(true);
      try {
        await onConfirmSaved(selectedId);
      } finally {
        setIsUpdating(false);
      }
    } else {
      alert("Vui lòng chọn một địa chỉ!");
    }
  };

  return (
    <>
      <PortalModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <span className="uppercase font- italic">Địa chỉ giao hàng</span>
        }
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="edit"
              onClick={onClose}
              className="flex-1 border-0 h-12"
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              variant="edit"
              onClick={handleConfirm}
              className="flex-1 shadow-orange-200"
              disabled={isUpdating || !selectedId}
            >
              {isUpdating ? (
                "Đang xử lý..."
              ) : (
                <span className="flex items-center justify-center">
                  <CheckCircle2 size={16} className="mr-2" /> Xác nhận địa chỉ
                </span>
              )}
            </Button>
          </div>
        }
        width="max-w-2xl"
      >
        <div className="flex flex-col gap-6 relative min-h-75">
          {isUpdating && (
            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
              <SectionLoading message="Đang cập nhật phí vận chuyển..." />
            </div>
          )}

          <div className="flex bg-slate-50 p-1.5 gap-2 rounded-2xl border border-slate-100">
            <button
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl ${
                activeTab === "saved"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-400"
              }`}
              onClick={() => setActiveTab("saved")}
              disabled={isUpdating}
            >
              Đã lưu ({savedAddresses.length})
            </button>
            <button
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-all"
              onClick={() => setIsFormOpen(true)}
              disabled={isUpdating}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={14} /> Thêm địa chỉ mới
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-100 overflow-y-auto custom-scrollbar pr-2">
            {savedAddresses.length > 0 ? (
              savedAddresses.map((addr) => (
                <div
                  key={addr.addressId}
                  onClick={() => !isUpdating && setSelectedId(addr.addressId)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedId === addr.addressId
                      ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-50"
                      : "border-slate-100 bg-white hover:border-orange-200"
                  } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="font-bold text-slate-900 text-sm uppercase italic">
                      {addr.recipientName}{" "}
                      <span className="mx-2 text-slate-300">|</span>{" "}
                      {addr.phone}
                    </div>
                    {addr.isDefault && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-(--color-mainColor) text-white text-[9px] font-bold uppercase tracking-widest shadow-sm animate-fade-in">
                        <FaCheckCircle size={10} />
                        <span>Mặc định</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium italic">
                    {addr.detailAddress}, {addr.ward}, {addr.district},{" "}
                    {addr.province}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-50">
                <Info className="mx-auto mb-2" />
                <p className="text-xs font-bold uppercase">
                  Chưa có địa chỉ nào
                </p>
              </div>
            )}
          </div>
        </div>
      </PortalModal>

      <AddressFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        buyerId={user?.buyerId!}
        onSuccess={async () => {
          setIsFormOpen(false);
          setIsUpdating(true);

          try {
            const newAddresses = await updateAddressList();

            if (newAddresses && newAddresses.length > 0) {
              const latestAddress = newAddresses[0];
              await updateAddress(latestAddress.addressId);
            }
            onClose();
            success("Đã áp dụng địa chỉ mới thành công!");
          } finally {
            setIsUpdating(false);
          }
        }}
      />
    </>
  );
};

export default AddressModal;
