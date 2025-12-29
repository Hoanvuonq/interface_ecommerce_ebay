"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FaBriefcase,
  FaEdit,
  FaHome,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button/button";
import { ButtonField, SectionLoading } from "@/components";

import { AddressFormModal } from "../../_components/AddressModal";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";

interface AddressManagementProps {
  buyerId: string;
}

type ViewMode = "LIST" | "FORM";

export default function AddressManagement({ buyerId }: AddressManagementProps) {
  const [addresses, setAddresses] = useState<BuyerAddressResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // State điều khiển hiển thị
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");
  const [editingAddress, setEditingAddress] = useState<
    BuyerAddressResponse | undefined
  >(undefined);

  useEffect(() => {
    if (buyerId) loadAddresses();
  }, [buyerId]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await buyerAddressService.getAllAddresses(buyerId);
      setAddresses(data);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tải địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingAddress(undefined); // Reset data để tạo mới
    setViewMode("FORM"); // Mở modal
  };

  const handleEdit = (address: BuyerAddressResponse) => {
    setEditingAddress(address); // Set data cần sửa
    setViewMode("FORM"); // Mở modal
  };

  const handleBackToList = () => {
    setEditingAddress(undefined);
    setViewMode("LIST"); // Đóng modal
  };

  const handleSaveSuccess = () => {
    handleBackToList(); // Đóng modal
    loadAddresses(); // Load lại danh sách
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await buyerAddressService.deleteAddress(buyerId, addressId);
      toast.success("Đã xóa địa chỉ");
      loadAddresses();
    } catch (error: any) {
      toast.error("Lỗi xóa địa chỉ");
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "HOME":
        return <FaHome className="text-blue-500" />;
      case "OFFICE":
        return <FaBriefcase className="text-purple-500" />;
      default:
        return <FaMapMarkerAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="h-full w-full animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Địa chỉ giao hàng
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý danh sách địa chỉ nhận hàng của bạn
          </p>
        </div>

        <Button variant="edit" onClick={handleCreateNew} icon={<FaPlus />}>
          Thêm địa chỉ mới
        </Button>
      </div>

      {loading && addresses.length === 0 ? (
        <div className="py-12 flex justify-center">
          <SectionLoading />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="p-4 bg-white rounded-full mb-3 shadow-sm">
            <FaMapMarkerAlt className="text-3xl text-gray-300" />
          </div>
          <p className="text-gray-500 mb-4 font-medium">
            Bạn chưa lưu địa chỉ nào
          </p>
          <ButtonField
            htmlType="submit"
            type="login"
            onClick={handleCreateNew}
            className="h-10 px-6 rounded-full text-sm w-auto "
          >
            <span className="flex items-center gap-2">
              <FaPlus size={16} />
              Thêm ngay
            </span>
          </ButtonField>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.addressId}
              className="group bg-white border border-gray-200 rounded-2xl py-4 px-6 hover:shadow-md hover:border-orange-200 transition-all duration-300 relative"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-lg">
                      {addr.recipientName}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600 font-medium">
                      {addr.phone}
                    </span>

                    <span
                      className={cn(
                        "ml-2 text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1.5 uppercase tracking-wide",
                        addr.type === "HOME"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : addr.type === "OFFICE"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      )}
                    >
                      {renderIcon(addr.type || "OTHER")}
                      {addr.type === "HOME"
                        ? "Nhà riêng"
                        : addr.type === "OFFICE"
                        ? "Văn phòng"
                        : "Khác"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-100">
                    <p>{addr.detailAddress}</p>
                    <p className="text-gray-500">
                      {[addr.ward, addr.district, addr.province]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="edit"
                    onClick={() => handleEdit(addr)}
                    icon={<FaEdit size={16} />}
                  >
                    Chỉnh Sửa
                  </Button>
                  <Button
                    variant="edit"
                    onClick={() => handleDelete(addr.addressId)}
                    icon={<FaTrash size={16} />}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={viewMode === "FORM"}
        onClose={handleBackToList}
        buyerId={buyerId}
        initialValues={editingAddress}
        onSuccess={handleSaveSuccess}
      />
    </div>
  );
}
