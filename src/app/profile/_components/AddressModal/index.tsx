"use client";

import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { cn } from "@/utils/cn";
import { menuAddressItems } from "../../_types/menu";
import { PortalModal } from "@/features/PortalModal";
import { SelectComponent } from "@/components/SelectComponent";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId: string;
  initialValues?: any;
  onSuccess: () => void;
}

export const AddressFormModal = ({
  isOpen,
  onClose,
  buyerId,
  initialValues,
  onSuccess,
}: AddressFormModalProps) => {
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    detailAddress: "",
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    type: "HOME",
    country: "Vietnam",
    isDefault: false,
  });

  useEffect(() => {
    if (!isOpen) return;

    let pData: Province[] = [];
    let wData: Ward[] = [];
    addressData.forEach((item) => {
      if (item.type === "table") {
        if (item.name === "provinces") pData = item.data as Province[];
        if (item.name === "wards") wData = item.data as Ward[];
      }
    });
    setProvinces(pData);
    setAllWards(wData);

    if (initialValues) {
      const foundP = pData.find(
        (p) =>
          p.name === initialValues.province ||
          p.name.includes(initialValues.province)
      );

      let currentWards: Ward[] = [];
      let foundWCode = "";

      if (foundP) {
        currentWards = wData.filter(
          (w) => w.province_code === foundP.province_code
        );
        if (initialValues.ward) {
          const foundW = currentWards.find(
            (w) =>
              w.name === initialValues.ward ||
              w.name.includes(initialValues.ward)
          );
          if (foundW) foundWCode = foundW.ward_code;
        }
      }

      setWards(currentWards);
      setFormData({
        recipientName: initialValues.recipientName || "",
        phone: initialValues.phone || "",
        detailAddress: initialValues.detailAddress || "",
        provinceCode: foundP?.province_code || "",
        provinceName: initialValues.province || "",
        wardCode: foundWCode,
        wardName: initialValues.ward || "",
        type: initialValues.type || "HOME",
        country: "Vietnam",
        isDefault: initialValues.isDefault || false,
      });
    } else {
      setFormData({
        recipientName: "",
        phone: "",
        detailAddress: "",
        provinceCode: "",
        provinceName: "",
        wardCode: "",
        wardName: "",
        type: "HOME",
        country: "Vietnam",
        isDefault: false,
      });
      setWards([]);
    }
  }, [isOpen, initialValues]);

  // --- Handlers ---
  const handleProvinceChange = (code: string) => {
    const province = provinces.find((p) => p.province_code === code);
    const filteredWards = allWards.filter((w) => w.province_code === code);
    setWards(filteredWards);
    setFormData((prev) => ({
      ...prev,
      provinceCode: code,
      provinceName: province?.name || "",
      wardCode: "",
      wardName: "",
    }));
  };

  const handleWardChange = (code: string) => {
    const ward = wards.find((w) => w.ward_code === code);
    setFormData((prev) => ({
      ...prev,
      wardCode: code,
      wardName: ward?.name || "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.recipientName ||
      !formData.phone ||
      !formData.provinceName ||
      !formData.wardName ||
      !formData.detailAddress
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const oldAddress = mapAddressToOldFormat(
        formData.wardName,
        formData.provinceName
      );

      const payload: any = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        detailAddress: formData.detailAddress,
        ward: formData.wardName,
        province: formData.provinceName,
        country: "Vietnam",
        type: formData.type,
        district: "",
        isDefault: formData.isDefault,
        ...(oldAddress.old_ward_name && {
          districtNameOld: oldAddress.old_district_name,
          provinceNameOld: oldAddress.old_province_name,
          wardNameOld: oldAddress.old_ward_name,
        }),
      };

      if (initialValues) {
        await buyerAddressService.updateAddress(
          buyerId,
          initialValues.addressId,
          payload
        );
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await buyerAddressService.createAddress(buyerId, payload);
        toast.success("Thêm địa chỉ mới thành công");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-orange-100 rounded-full text-orange-600">
        <MapPin size={20} />
      </div>
      <h3 className="text-xl font-bold text-gray-800">
        {initialValues ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      </h3>
    </div>
  );

  const footerContent = (
    <>
      <div className="flex items-center gap-3">
        <Button variant="edit" onClick={onClose}>
          Hủy bỏ
        </Button>
        <ButtonField
          form="address-form"
          htmlType="submit"
          type="login"
          loading={loading}
          className="flex w-40 items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
        >
          <span className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <FaSave />
            )}
            {initialValues ? "Lưu thay đổi" : "Hoàn thành"}
          </span>
        </ButtonField>
      </div>
    </>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={headerContent}
      footer={footerContent}
      width="max-w-3xl"
    >
      <form
        id="address-form"
        onSubmit={handleSubmit}
        className="space-y-6 py-2"
      >
        {/* 1. Tên & SĐT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Tên người nhận <span className="text-red-500">*</span>
            </label>
            <input
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              placeholder="VD: Nguyễn Văn A"
              className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Địa chỉ chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleInputChange}
            rows={2}
            placeholder="Số nhà, tên đường, tòa nhà..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Quốc gia
            </label>
            <div className="w-full h-11 px-4 flex items-center bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed font-medium">
              Việt Nam
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <SelectComponent
              placeholder="Chọn Tỉnh/Thành"
              options={provinces.map((p) => ({
                value: p.province_code,
                label: p.name,
              }))}
              value={formData.provinceCode}
              onChange={handleProvinceChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <SelectComponent
              placeholder="Chọn Phường/Xã"
              options={wards.map((w) => ({
                value: w.ward_code,
                label: w.name,
              }))}
              value={formData.wardCode}
              onChange={handleWardChange}
              disabled={!formData.provinceCode}
            />
          </div>
        </div>

        <div className="space-y-2 py-2">
          <label className="text-sm font-semibold text-gray-700">
            Loại địa chỉ
          </label>
          <div className="flex gap-4 py-1 overflow-x-auto">
            {menuAddressItems.map((type) => (
              <label
                key={type.val}
                className={cn(
                  "flex-1 min-w-30 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all text-sm font-medium select-none",
                  formData.type === type.val
                    ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <input
                  type="radio"
                  name="type"
                  value={type.val}
                  checked={formData.type === type.val}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <type.icon
                  className={
                    formData.type === type.val
                      ? "text-orange-500"
                      : "text-gray-400"
                  }
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 py-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="isDefault-toggle">
            Đặt làm địa chỉ mặc định
          </label>
          <input
            id="isDefault-toggle"
            type="checkbox"
            checked={formData.isDefault}
            onChange={e => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
            className="w-5 h-5 accent-orange-500 border-gray-300 rounded focus:ring-orange-200"
          />
        </div>
      </form>
    </PortalModal>
  );
};
