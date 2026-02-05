"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  savedAddresses: initialAddresses,
  currentAddressId,
  onConfirmSaved,
}) => {
  const user = getStoredUserDetail();
  const { allAddresses: addresses, updateAddressList } = useCheckoutAddress();

  const displayAddresses = useMemo(() => {
    return addresses && addresses.length > 0 ? addresses : initialAddresses;
  }, [addresses, initialAddresses]);

  const [activeTab, setActiveTab] = useState<"saved" | "new">("saved");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    currentAddressId,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { success, error: toastError } = useToast();

  // Đồng bộ selectedId và Tab khi mở modal
  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentAddressId);
      setActiveTab(displayAddresses.length === 0 ? "new" : "saved");
      setIsUpdating(false);
    }
  }, [isOpen, currentAddressId, displayAddresses.length]);

  const handleConfirm = async () => {
    if (selectedId) {
      setIsUpdating(true);
      try {
        await onConfirmSaved(selectedId);
        onClose();
      } catch (err) {
        toastError("Không thể xác nhận địa chỉ này.");
      } finally {
        setIsUpdating(false);
      }
    } else {
      toastError("Vui lòng chọn một địa chỉ!");
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
          <span className="uppercase font-bold italic text-orange-600 tracking-tight">
            Địa chỉ giao hàng
          </span>
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
            containerClassName="w-full flex gap-3 border-t-0 p-4"
            className="w-full sm:w-50! rounded-4xl shadow-lg shadow-orange-500/20"
          />
        }
        width="max-w-2xl"
      >
        <div className="flex flex-col gap-6 min-h-75 p-2">
          <div className="flex bg-gray-100/50 p-1.5 gap-2 rounded-2xl border border-gray-100">
            <button
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl",
                activeTab === "saved"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
              onClick={() => setActiveTab("saved")}
              disabled={isUpdating}
            >
              Đã lưu ({displayAddresses.length}){" "}
            </button>
            <button
              className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-orange-600 transition-all rounded-xl border border-transparent hover:border-orange-100"
              onClick={() => setIsFormOpen(true)}
              disabled={isUpdating}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={14} /> Thêm địa chỉ mới
              </div>
            </button>
          </div>

          {/* LIST ADDRESSES */}
          <div className="grid grid-cols-1 gap-3 max-h-100 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {displayAddresses.length > 0 ? (
              displayAddresses.map((addr: any) => (
                <div
                  key={addr.addressId}
                  onClick={() => handleAddressClick(addr.addressId)}
                  className={cn(
                    "p-5 rounded-3xl border-2 cursor-pointer transition-all relative group",
                    selectedId === addr.addressId
                      ? "border-orange-500 bg-orange-50/40 ring-1 ring-orange-200"
                      : "border-gray-50 bg-white hover:border-orange-200 hover:bg-orange-50/10",
                    isUpdating && "opacity-50 cursor-wait",
                  )}
                >
                  <div className="w-full flex justify-between items-start">
                    <div className="font-bold text-gray-900 text-sm uppercase italic flex flex-wrap items-center gap-2">
                      {addr.recipientName}
                      <span className="text-gray-300 not-italic font-normal">
                        |
                      </span>{" "}
                      <span className="text-orange-600/80">{addr.phone}</span>
                    </div>
                    {selectedId === addr.addressId && (
                      <FaCheckCircle className="text-orange-500 text-lg animate-in zoom-in duration-300" />
                    )}
                  </div>

                  {/* 🟢 Hiển thị địa chỉ theo cấu trúc lồng nhau */}
                  <p className="text-xs text-gray-500 mt-2.5 font-medium italic leading-relaxed">
                    {addr.address?.detail}, {addr.address?.ward},
                    {addr.address?.district
                      ? ` ${addr.address.district}, `
                      : ""}
                    {addr.address?.province}
                  </p>

                  {addr.isDefault && (
                    <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[8px] font-bold uppercase tracking-widest border border-orange-200">
                      Mặc định
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <Info
                  size={48}
                  strokeWidth={1.5}
                  className="mb-4 text-gray-400"
                />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Hệ thống chưa ghi nhận địa chỉ
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
                success("Thiết lập địa chỉ thành công!");
                onClose();
              }
            }
          } catch (err) {
            console.error(err);
            toastError("Thêm thành công nhưng không thể tự động chọn.");
          } finally {
            setIsUpdating(false);
          }
        }}
      />
    </>
  );
};
