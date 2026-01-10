"use client";

import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { Loader2, MapPin } from "lucide-react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { cn } from "@/utils/cn";
import { menuAddressItems } from "../../_types/menu";
import { PortalModal } from "@/features/PortalModal";
import { SelectComponent } from "@/components/selectComponent";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";
import { useToast } from "@/hooks/useToast";
import { FormInput } from "@/components/formInput";
import { Checkbox } from "@/components/checkbox";

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
  const { success, error } = useToast();

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

  // State quản lý lỗi hiển thị trên FormInput
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({});
  }, [isOpen, initialValues]);

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
    if (errors.provinceCode) setErrors(prev => ({...prev, provinceCode: ""}));
  };

  const handleWardChange = (code: string) => {
    const ward = wards.find((w) => w.ward_code === code);
    setFormData((prev) => ({
      ...prev,
      wardCode: code,
      wardName: ward?.name || "",
    }));
    if (errors.wardCode) setErrors(prev => ({...prev, wardCode: ""}));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.recipientName) newErrors.recipientName = "Vui lòng nhập tên người nhận";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.provinceName) newErrors.provinceCode = "Vui lòng chọn tỉnh thành";
    if (!formData.wardName) newErrors.wardCode = "Vui lòng chọn phường xã";
    if (!formData.detailAddress) newErrors.detailAddress = "Vui lòng nhập địa chỉ chi tiết";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      error("Vui lòng điền đầy đủ thông tin bắt buộc");
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
        success("Cập nhật địa chỉ thành công");
      } else {
        await buyerAddressService.createAddress(buyerId, payload);
        success("Thêm địa chỉ mới thành công");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-orange-100 rounded-full text-orange-600">
        <MapPin size={20} />
      </div>
      <h3 className="text-sm font-semibold text-gray-700">
        {initialValues ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      </h3>
    </div>
  );

  const footerContent = (
    <div className="flex items-center gap-3">
      <Button variant="edit" onClick={onClose}>
        Hủy bỏ
      </Button>
      <ButtonField
        form="address-form"
        htmlType="submit"
        type="login"
        loading={loading}
        className="flex w-40 items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-(--color-mainColor)/20 transition-all active:scale-95 border-0 h-auto"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Tên người nhận"
            required
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            placeholder="VD: Nguyễn Văn A"
            error={errors.recipientName}
          />
          <FormInput
            label="Số điện thoại"
            required
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            error={errors.phone}
          />
        </div>

        <FormInput
          isTextArea
          label="Địa chỉ chi tiết"
          required
          name="detailAddress"
          value={formData.detailAddress}
          onChange={handleInputChange}
          rows={2}
          placeholder="Số nhà, tên đường, tòa nhà..."
          error={errors.detailAddress}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-[0.15em] text-gray-600 ml-1">
              Quốc gia
            </label>
            <div className="w-full h-12 px-5 flex items-center bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-600 cursor-not-allowed font-semibold text-sm shadow-inner">
              Việt Nam
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-[0.15em] text-gray-600 ml-1">
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
              className={errors.provinceCode ? "border-red-400" : ""}
            />
            {errors.provinceCode && <p className="text-[10px] font-medium text-red-500 ml-1">{errors.provinceCode}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-[0.15em] text-gray-600 ml-1">
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
              className={errors.wardCode ? "border-red-400" : ""}
            />
            {errors.wardCode && <p className="text-[10px] font-medium text-red-500 ml-1">{errors.wardCode}</p>}
          </div>
        </div>

        <div className="space-y-2 py-2">
          <label className="text-[11px] font-bold tracking-[0.15em] text-gray-600 ml-1">
            Loại địa chỉ
          </label>
          <div className="flex gap-4 py-1 px-2 overflow-x-auto custom-scrollbar">
            {menuAddressItems.map((type) => (
              <label
                key={type.val}
                className={cn(
                  "flex-1 min-w-30 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all text-sm font-semibold select-none",
                  formData.type === type.val
                    ? "border-(--color-mainColor) bg-orange-50 text-orange-700 shadow-sm ring-1 ring-(--color-mainColor)"
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
                  size={18}
                  className={
                    formData.type === type.val
                      ? "text-(--color-mainColor)"
                      : "text-gray-600"
                  }
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        <Checkbox
          label="Đặt làm địa chỉ mặc định"
          checked={formData.isDefault}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
          }
        />
      </form>
    </PortalModal>
  );
};