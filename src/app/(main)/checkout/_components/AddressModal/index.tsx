"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Plus, Info } from "lucide-react";
import { AddressModalProps } from "../../_types/address";
import { PortalModal } from "@/features/PortalModal";
import { AddressFormModal } from "@/app/(main)/profile/_components/AddressModal";
import { getStoredUserDetail } from "@/utils/jwt";
import { useCheckoutAddress } from "../../_hooks/useCheckoutAddress";
import { useToast } from "@/hooks/useToast";
import { FaCheckCircle } from "react-icons/fa";
import { CustomButtonActions } from "@/components";
import { cn } from "@/utils/cn";

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  currentAddressId,
  onConfirmSaved,
}) => {
  const user = getStoredUserDetail();
  const [activeTab, setActiveTab] = useState<"saved" | "new">("saved");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    currentAddressId,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const { updateAddressList } = useCheckoutAddress();
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
      setIsUpdating(true); // 🟢 Bật loading trên nút
      try {
        await onConfirmSaved(selectedId);
        onClose();
      } finally {
        setIsUpdating(false);
      }
    } else {
      alert("Vui lòng chọn một địa chỉ!");
    }
  };

  const handleAddressClick = (addrId: string) => {
    if (isUpdating) return;
    setSelectedId(addrId);
  };

  return (
    <>
      <PortalModal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <span className="uppercase font-bold italic">Địa chỉ giao hàng</span>
        }
        footer={
          <CustomButtonActions
            isLoading={isUpdating}
            isDisabled={!selectedId || isUpdating}
            cancelText="HỦY BỎ"
            submitText="XÁC NHẬN ĐỊA CHỈ"
            submitIcon={CheckCircle2}
            onCancel={onClose}
            onSubmit={handleConfirm}
            containerClassName="w-full flex gap-3 border-t-0"
            className="w-50! rounded-4xl"
          />
        }
        width="max-w-2xl"
      >
        <div className="flex flex-col gap-6 min-h-75">

          <div className="flex bg-gray-50 p-1.5 gap-2 rounded-2xl border border-gray-100">
            <button
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl",
                activeTab === "saved"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600",
              )}
              onClick={() => setActiveTab("saved")}
              disabled={isUpdating}
            >
              Đã lưu ({savedAddresses.length})
            </button>
            <button
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-orange-600 transition-all"
              onClick={() => setIsFormOpen(true)}
              disabled={isUpdating}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={14} /> Thêm địa chỉ mới
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-100 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {savedAddresses.length > 0 ? (
              savedAddresses.map((addr) => (
                <div
                  key={addr.addressId}
                  onClick={() => handleAddressClick(addr.addressId)}
                  className={cn(
                    "p-4 rounded-2xl border-2 cursor-pointer transition-all relative group",
                    selectedId === addr.addressId
                      ? "border-orange-500 bg-orange-50/30 ring-1 ring-orange-100"
                      : "border-gray-100 bg-white hover:border-gray-300",
                    isUpdating && "opacity-50 cursor-wait",
                  )}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="font-bold text-gray-900 text-sm uppercase italic flex items-center gap-2">
                      {addr.recipientName}
                      <span className="text-gray-400 text-xs">|</span>{" "}
                      {addr.phone}
                    </div>
                    {selectedId === addr.addressId && (
                      <FaCheckCircle className="text-orange-500 text-lg animate-in zoom-in duration-300" />
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mt-2 font-medium italic leading-relaxed">
                    {addr.detailAddress}, {addr.ward}, {addr.district},{" "}
                    {addr.province}
                  </p>

                  {addr.isDefault && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-wider">
                      Mặc định
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <Info size={40} className="mb-3 text-gray-300" />
                <p className="text-xs font-bold uppercase text-gray-400">
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
              if (latestAddress) {
                setSelectedId(latestAddress.addressId);
                await onConfirmSaved(latestAddress.addressId);
              }
            }
            success("Thêm địa chỉ và áp dụng thành công!");
            onClose();
          } catch (err) {
            console.error(err);
          } finally {
            setIsUpdating(false); 
          }
        }}
      />
    </>
  );
};
