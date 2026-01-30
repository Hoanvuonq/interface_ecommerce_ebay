/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, Phone, User, Edit3, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { PortalModal } from "@/features/PortalModal";
import { FormInput } from "@/components";
import { useUpdateAddressShop } from "../../_hooks/useShop";

export const AddressInfo = ({ shop, setShop }: { shop: any; setShop: any }) => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const addressRecord = shop?.address; // Đây là object bọc ngoài
  const addressData = addressRecord?.address; // Đây mới là object chứa provinceName, districtName...
  const { handleUpdateAddressShop, loading: updating } = useUpdateAddressShop();
  const users = getStoredUserDetail();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleEdit = () => {
    setFormData({
      fullName: addressRecord?.fullName || "",
      phone: addressRecord?.phone || "",
      country: addressRecord?.address?.countryName || "",
      province: addressRecord?.address?.provinceName || "",
      district: addressRecord?.address?.districtName || "",
      ward: addressRecord?.address?.wardName || "",
      addressDetail: addressRecord?.address?.detail || "",
    });
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        address: {
          countryCode: "VN",
          countryName: formData.country ||addressRecord?.address?.countryName,
          provinceCode: formData.provinceCode ||addressRecord?.address?.provinceCode,
          provinceName: formData.province ||addressRecord?.address?.provinceName,
          provinceNameOld:
            formData.province ||addressRecord?.address?.provinceNameOld,
          districtCode: formData.districtCode ||addressRecord?.address?.districtCode,
          districtName: formData.district ||addressRecord?.address?.districtName,
          districtNameOld:
            formData.districtNameOld ||addressRecord?.address?.districtNameOld,
          wardCode: formData.wardCode ||addressRecord?.address?.wardCode,
          wardName: formData.ward ||addressRecord?.address?.wardName,
          wardNameOld: formData.wardNameOld ||addressRecord?.address?.wardNameOld,
        },
        detail: formData.addressDetail,
        fullName: formData.fullName,
        phone: formData.phone,
      };

      const res = await handleUpdateAddressShop(
        users.shopId,
        addressRecord.addressId,
        payload,
      );
      if (res) {
        const shopRes = await getShopDetail(users.shopId);
        if (shopRes) setShop(shopRes.data);
        toastSuccess("Cập nhật thông tin địa chỉ thành công!");
        setOpenModal(false);
      }
    } catch (err: any) {
      toastError(err?.message || "Cập nhật thất bại!");
    }
  };

  const addressDisplay = addressRecord?.address;

  return (
    <>
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        {/* Header */}
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
                Địa chỉ giao hàng và nhận hàng mặc định
              </p>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
          >
            <Edit3 size={14} />
            Chỉnh sửa
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Người nhận */}
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <User size={14} /> Người nhận
            </span>
            <span className="text-sm font-bold text-gray-800">
              {addressRecord?.fullName || "Chưa cập nhật"}
            </span>
          </div>

          {/* Số điện thoại */}
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Phone size={14} /> Số điện thoại
            </span>
            <span className="text-sm font-bold text-gray-800">
              {addressRecord?.phone || "Chưa cập nhật"}
            </span>
          </div>

          {/* Địa chỉ */}
          <div className="border-t border-gray-50 pt-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <MapPin size={14} /> Địa chỉ
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-1">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  Tỉnh / Thành phố
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {addressDisplay?.provinceName || "Chưa cập nhật"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  Quận / Huyện
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {addressDisplay?.districtName || "Chưa cập nhật"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  Phường / Xã
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {addressDisplay?.wardName || "Chưa cập nhật"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  Quốc gia
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {addressDisplay?.countryName || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                Địa chỉ chi tiết
              </p>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                {addressDisplay?.detail || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <PortalModal
        isOpen={openModal}
        onClose={() => !updating && setOpenModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl text-green-600">
              <MapPin size={18} />
            </div>
            <span className="font-bold text-gray-800 uppercase text-sm tracking-tight">
              Cập nhật Địa chỉ
            </span>
          </div>
        }
        width="max-w-2xl"
        className="rounded-[3rem]"
      >
        <form onSubmit={handleSave} className="space-y-8 py-2">
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-1 space-y-6">
            <FormInput
              label="Người nhận hàng"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Nhập tên người nhận"
              maxLength={50}
            />

            <FormInput
              label="Số điện thoại"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Nhập số điện thoại"
              maxLength={20}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Tỉnh / Thành phố"
                required
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                placeholder="Nhập tỉnh / thành phố"
              />

              <FormInput
                label="Quận / Huyện"
                required
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                placeholder="Nhập quận / huyện"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Phường / Xã"
                value={formData.ward}
                onChange={(e) =>
                  setFormData({ ...formData, ward: e.target.value })
                }
                placeholder="Nhập phường / xã"
              />

              <FormInput
                label="Quốc gia"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Nhập quốc gia"
              />
            </div>

            <FormInput
              label="Địa chỉ chi tiết"
              required
              isTextArea
              rows={3}
              value={formData.addressDetail}
              onChange={(e) =>
                setFormData({ ...formData, addressDetail: e.target.value })
              }
              placeholder="Ví dụ: 123 Đường ABC, Tòa nhà XYZ"
              maxLength={300}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              disabled={updating}
              onClick={() => setOpenModal(false)}
              className="px-8 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:text-gray-600 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-10 py-3 bg-green-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20 flex items-center gap-2 hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {updating && <Loader2 size={14} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </PortalModal>
    </>
  );
};
