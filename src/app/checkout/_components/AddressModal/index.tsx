import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Plus } from "lucide-react";
import { AddressModalProps, NewAddressForm } from "../../_types/address";
import { createPortal } from "react-dom";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  currentAddressId,
  onConfirmSaved,
  onConfirmNew,
}) => {
  const [activeTab, setActiveTab] = useState<"saved" | "new">("saved");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    currentAddressId
  );

  const [newAddress, setNewAddress] = useState<NewAddressForm>({
    recipientName: "",
    phoneNumber: "",
    detailAddress: "",
    ward: "",
    district: "",
    province: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentAddressId);
      if (savedAddresses.length === 0) setActiveTab("new");
      else setActiveTab("saved");
    }
  }, [isOpen, currentAddressId, savedAddresses.length]);

  if (!isOpen) return null;

  const handleConfirm = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-800">Địa chỉ giao hàng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "saved"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Địa chỉ đã lưu ({savedAddresses.length})
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "new"
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("new")}
          >
            Thêm địa chỉ mới
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === "saved" ? (
            <div className="space-y-3">
              {savedAddresses.length > 0 ? (
                savedAddresses.map((addr, index) => {
                  const isSelected = selectedId === addr.addressId;
                  return (
                    <div
                      key={addr.addressId}
                      onClick={() => setSelectedId(addr.addressId)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-100 hover:border-orange-200 bg-white"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected ? "border-orange-500" : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">
                              {addr.recipientName}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600">{addr.phone}</span>
                            {index === 0 && (
                              <span className="ml-auto text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Mới nhất
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-snug">
                            {addr.detailAddress}, {addr.ward}, {addr.district},{" "}
                            {addr.province}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Chưa có địa chỉ nào được lưu.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2 mb-4">
                <div className="mt-0.5">ℹ️</div>
                Thông tin sẽ được dùng để giao hàng cho đơn này.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Người nhận" required>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    value={newAddress.recipientName}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        recipientName: e.target.value,
                      })
                    }
                  />
                </InputGroup>
                <InputGroup label="Số điện thoại" required>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    value={newAddress.phoneNumber}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </InputGroup>
              </div>

              <InputGroup label="Địa chỉ chi tiết (Số nhà, đường)" required>
                <input
                  type="text"
                  placeholder="VD: 123 Đường ABC"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  value={newAddress.detailAddress}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      detailAddress: e.target.value,
                    })
                  }
                />
              </InputGroup>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputGroup label="Tỉnh/Thành phố" required>
                  <input
                    type="text"
                    placeholder="TP. HCM"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    value={newAddress.province}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, province: e.target.value })
                    }
                  />
                </InputGroup>
                <InputGroup label="Quận/Huyện" required>
                  <input
                    type="text"
                    placeholder="Quận 1"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    value={newAddress.district}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, district: e.target.value })
                    }
                  />
                </InputGroup>
                <InputGroup label="Phường/Xã" required>
                  <input
                    type="text"
                    placeholder="Phường Bến Nghé"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    value={newAddress.ward}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, ward: e.target.value })
                    }
                  />
                </InputGroup>
              </div>

              <InputGroup label="Email (Tùy chọn)">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  value={newAddress.email}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, email: e.target.value })
                  }
                />
              </InputGroup>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <Button variant="edit" onClick={onClose}>
            Hủy bỏ
          </Button>
          <ButtonField
            form="profile-form"
            htmlType="submit"
            onClick={handleConfirm}
            
            type="login"
            className="flex w-32 items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 "
          >
            <span className="flex items-center gap-2">
              {activeTab === "new" ? (
                <Plus size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              Xác nhận
            </span>
          </ButtonField>
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

const InputGroup = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default AddressModal;
