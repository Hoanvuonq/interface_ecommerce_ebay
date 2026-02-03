/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, Phone, User, Edit3 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useUpdateAddressShop } from "../../_hooks/useShop";
import { AddressEditModal } from "../AddressEditModal";

export const AddressInfo = ({ shop, setShop }: { shop: any; setShop: any }) => {
  const [openModal, setOpenModal] = useState(false);

  // Lấy đúng các lớp dữ liệu từ JSON mới
  const addressRecord = shop?.address; // Chứa recipientName, phone, defaultPickup...
  const addressDetailObj = addressRecord?.address; // Chứa province, district, ward, detail...

  const { handleUpdateAddressShop, loading: updating } = useUpdateAddressShop();
  const users = getStoredUserDetail();
  const { success: toastSuccess, error: toastError } = useToast();

  // 🟢 FIX 1: Mapping dữ liệu từ JSON vào Form chuẩn xác
  const handleEdit = () => {
    const initialData = {
      fullName: addressRecord?.recipientName || "", // JSON dùng recipientName
      phone: addressRecord?.phone || "",
      country: addressDetailObj?.country || "Việt Nam",
      province: addressDetailObj?.province || "",
      district: addressDetailObj?.district || "",
      ward: addressDetailObj?.ward || "",
      addressDetail: addressDetailObj?.detail || "",
    };
    setOpenModal(true);
  };

  // 🟢 FIX 2: Cấu trúc Payload gửi đi khớp 100% với Swagger và JSON
  const handleSave = async (updatedData: any) => {
    try {
      const payload = {
        address: {
          country: updatedData.country || "Việt Nam",
          countryCode: addressDetailObj?.countryCode || "",
          countryName: addressDetailObj?.countryName || updatedData.country || "Việt Nam",
          province: updatedData.province,
          provinceCode: addressDetailObj?.provinceCode || "",
          provinceName: addressDetailObj?.provinceName || updatedData.province || "",
          district: updatedData.district,
          districtCode: addressDetailObj?.districtCode || "",
          districtName: addressDetailObj?.districtName || updatedData.district || "",
          ward: updatedData.ward,
          wardCode: addressDetailObj?.wardCode || "",
          wardName: addressDetailObj?.wardName || updatedData.ward || "",
          detail: updatedData.addressDetail,
          zipCode: addressDetailObj?.zipCode || "10000",
          geoinfo: addressDetailObj?.geoinfo || {
            latitude: 1.0,
            longitude: 1.0,
            userVerified: true,
            userAdjusted: true,
            confirmed: true,
          },
          isInternational: false,
        },
        detail: updatedData.addressDetail, // Add this line to satisfy UpdateShopAddressRequest
        fullName: updatedData.fullName, // Trường này API thường map vào recipientName ở Backend
        phone: updatedData.phone,
        isDefault: addressRecord?.default ?? true,
        isDefaultPickup: addressRecord?.defaultPickup ?? true,
        isDefaultReturn: addressRecord?.defaultReturn ?? true,
      };

      const res = await handleUpdateAddressShop(
        users.shopId,
        addressRecord.addressId,
        payload,
      );

      if (res) {
        // Refresh lại data shop sau khi update thành công
        const shopRes = await getShopDetail(users.shopId);
        if (shopRes?.data) setShop(shopRes.data);

        toastSuccess("Cập nhật thông tin địa chỉ thành công!");
        setOpenModal(false);
      }
    } catch (err: any) {
      toastError(err?.message || "Cập nhật thất bại!");
    }
  };

  return (
    <>
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-100">
              <MapPin size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                Thông tin Địa chỉ
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Địa chỉ giao nhận mặc định
              </p>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Edit3 size={14} /> Chỉnh sửa
          </button>
        </div>

        {/* Display Content Section */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <User size={14} /> Người nhận
            </span>
            <span className="text-sm font-bold text-gray-800">
              {addressRecord?.recipientName || "Chưa cập nhật"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Phone size={14} /> Số điện thoại
            </span>
            <span className="text-sm font-bold text-gray-800">
              {addressRecord?.phone || "Chưa cập nhật"}
            </span>
          </div>

          <div className="border-t border-gray-50 pt-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <MapPin size={14} /> Chi tiết địa lý
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-1">
              {[
                {
                  label: "Tỉnh / Thành phố",
                  value: addressDetailObj?.province,
                },
                {
                  label: "Quận / Huyện",
                  value: addressDetailObj?.district || "---",
                },
                { label: "Phường / Xã", value: addressDetailObj?.ward },
                { label: "Quốc gia", value: addressDetailObj?.country },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.value || "Chưa cập nhật"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 mt-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                Địa chỉ cụ thể
              </p>
              <p className="text-sm font-medium text-gray-800 leading-relaxed italic">
                {addressDetailObj?.detail ||
                  "Chưa cập nhật chi tiết số nhà, tên đường..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 TRUYỀN PROPS CHUẨN VÀO MODAL TÁCH RIÊNG */}
      <AddressEditModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        isLoading={updating}
        initialData={{
          fullName: addressRecord?.recipientName,
          phone: addressRecord?.phone,
          province: addressDetailObj?.province,
          district: addressDetailObj?.district,
          ward: addressDetailObj?.ward,
          country: addressDetailObj?.country,
          addressDetail: addressDetailObj?.detail,
        }}
      />
    </>
  );
};
