"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import {
  FaBriefcase,
  FaEdit,
  FaHome,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button";
import {
  ButtonField,
  CustomEmptyState,
  SectionHeader,
  SectionLoading,
} from "@/components";
import { AddressFormModal } from "../../_components/AddressModal";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
import { MapIcon, MapPin, Plus } from "lucide-react";

interface AddressManagementProps {
  buyerId: string;
}

export default function AddressManagement({ buyerId }: AddressManagementProps) {
  const [addresses, setAddresses] = useState<BuyerAddressResponse[]>([]);
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    BuyerAddressResponse | undefined
  >(undefined);

  useEffect(() => {
    if (buyerId) loadAddresses();
  }, [buyerId]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = (await buyerAddressService.getAllAddresses(
        buyerId,
      )) as any;

      const addressList: BuyerAddressResponse[] = response?.data || [];

      const sortedData = [...addressList].sort(
        (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0),
      );
      setAddresses(sortedData);
    } catch (error: any) {
      toastError(error?.message || "Không thể tải địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingAddress(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (address: BuyerAddressResponse) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await buyerAddressService.deleteAddress(buyerId, addressId);
      toastSuccess("Đã xóa địa chỉ");
      loadAddresses();
    } catch (error: any) {
      toastError("Lỗi xóa địa chỉ");
    }
  };

  return (
    <div className="h-full w-full animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100 gap-4">
        <SectionHeader
          icon={MapIcon}
          title=" Địa chỉ giao hàng"
          description=" Shipping & Delivery points"
        />
        <ButtonField
          htmlType="submit"
          type="login"
          onClick={handleCreateNew}
          icon={<FaPlus />}
          className="w-46 text-[12px]"
        >
          Thêm địa chỉ mới
        </ButtonField>
      </div>

      {loading && addresses.length === 0 ? (
        <div className="py-12 flex justify-center">
          <SectionLoading />
        </div>
      ) : addresses.length === 0 ? (
        <CustomEmptyState
          icon={MapPin}
          subIcon={Plus}
          title="Chưa có địa chỉ"
          description="Vui lòng thêm địa chỉ để chúng tôi giao hàng nhanh nhất."
          buttonText="Thêm địa chỉ mới"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.addressId}
              className={cn(
                "group bg-white border rounded-[1.8rem] p-6 transition-all shadow-custom duration-300 relative",
                addr.isDefault
                  ? "border-orange-500 ring-4 ring-orange-500/5 shadow-xl shadow-orange-500/10"
                  : "border-gray-100 hover:border-orange-200 hover:shadow-lg",
              )}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-gray-900 text-lg uppercase italic tracking-tighter">
                      {addr.recipientName}
                    </span>

                    {addr.isDefault && (
                      <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-orange-500 text-white flex items-center gap-1 uppercase tracking-widest shadow-md">
                        <FaCheckCircle size={10} /> Mặc định
                      </span>
                    )}

                    <span
                      className={cn(
                        "text-[9px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 uppercase tracking-widest",
                        addr.type === "HOME"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-purple-50 text-purple-600 border-purple-100",
                      )}
                    >
                      {addr.type === "HOME" ? <FaHome /> : <FaBriefcase />}
                      {addr.type === "HOME" ? "Nhà riêng" : "Văn phòng"}
                    </span>
                  </div>

                  <div className="text-gray-500 font-bold text-sm flex items-center gap-2">
                    <span className="w-8 h-px bg-gray-200"></span>
                    {addr.phone}
                  </div>

                  <div className="space-y-1 pl-4 border-l-2 border-orange-500/20">
                    <p className="text-gray-800 font-bold text-sm uppercase tracking-tight">
                      {addr.address?.detail || "N/A"}
                    </p>
                    <p className="text-gray-500 text-xs font-medium">
                      {[
                        addr.address?.ward,
                        addr.address?.district,
                        addr.address?.province,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <div className="flex gap-4 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                        {addr.address?.country}
                      </span>
                      {addr.address?.zipCode && (
                        <span className="text-[10px] font-mono text-gray-400">
                          ZIP: {addr.address.zipCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    variant="edit"
                    onClick={() => handleEdit(addr)}
                    className="h-9 px-4 rounded-xl border-gray-200 hover:border-orange-500 hover:text-orange-500"
                  >
                    <span className="flex gap-2 items-center">
                      <FaEdit size={14} className="mr-2" /> Sửa
                    </span>
                  </Button>
                  {!addr.isDefault && (
                    <Button
                      variant="edit"
                      onClick={() => handleDelete(addr.addressId)}
                      className="h-9 px-4 rounded-xl text-red-500 border-red-100 hover:bg-red-50"
                    >
                      <span className="flex gap-2 items-center">
                        <FaTrash size={14} className="mr-2" /> Xóa
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buyerId={buyerId}
        initialValues={editingAddress}
        onSuccess={() => {
          setIsModalOpen(false);
          loadAddresses();
        }}
      />
    </div>
  );
}
