import { ButtonField, InputField } from "@/components";
import { buyerAddressService } from "@/services/buyer/buyer-address.service";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { toast } from "sonner";
import addressData, { Province, Ward } from "vietnam-address-database";
import { menuAddressItems } from "../../_types/menu";
import { SearchableSelect } from "../SearchableSelect";

export const AddressForm = ({ buyerId, initialValues, onCancel, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    recipientName: initialValues?.recipientName || "",
    phone: initialValues?.phone || "",
    detailAddress: initialValues?.detailAddress || "",
    provinceCode: "",
    provinceName: initialValues?.province || "",
    wardCode: "",
    wardName: initialValues?.ward || "",
    type: initialValues?.type || "HOME",
    country: "Vietnam"
  });

  useEffect(() => {
    let pData: Province[] = [];
    let wData: Ward[] = [];
    addressData.forEach((item) => {
      if (item.type === 'table') {
        if (item.name === 'provinces') pData = item.data as Province[];
        if (item.name === 'wards') wData = item.data as Ward[];
      }
    });
    setProvinces(pData);
    setAllWards(wData);

    if (initialValues?.province) {
      const foundP = pData.find(p => p.name === initialValues.province || p.name.includes(initialValues.province));
      if (foundP) {
        setFormData(prev => ({ ...prev, provinceCode: foundP.province_code, provinceName: foundP.name }));
        const filteredWards = wData.filter(w => w.province_code === foundP.province_code);
        setWards(filteredWards);
        
        if (initialValues?.ward) {
            const foundW = filteredWards.find(w => w.name === initialValues.ward || w.name.includes(initialValues.ward));
            if (foundW) {
                setFormData(prev => ({ ...prev, wardCode: foundW.ward_code, wardName: foundW.name }));
            }
        }
      }
    }
  }, [initialValues]);

  const handleProvinceChange = (code: string) => {
    const province = provinces.find(p => p.province_code === code);
    const filteredWards = allWards.filter(w => w.province_code === code);
    setWards(filteredWards);
    setFormData(prev => ({
      ...prev,
      provinceCode: code,
      provinceName: province?.name || "",
      wardCode: "", 
      wardName: ""
    }));
  };

  const handleWardChange = (code: string) => {
    const ward = wards.find(w => w.ward_code === code);
    setFormData(prev => ({ ...prev, wardCode: code, wardName: ward?.name || "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.phone || !formData.provinceName || !formData.wardName || !formData.detailAddress) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const oldAddress = mapAddressToOldFormat(formData.wardName, formData.provinceName);
      
      const payload: any = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        detailAddress: formData.detailAddress,
        ward: formData.wardName,
        province: formData.provinceName,
        country: "Vietnam",
        type: formData.type,
        district: "",
        ...(oldAddress.old_ward_name && {
            districtNameOld: oldAddress.old_district_name,
            provinceNameOld: oldAddress.old_province_name,
            wardNameOld: oldAddress.old_ward_name,
        }),
      };

      if (initialValues) {
        await buyerAddressService.updateAddress(buyerId, initialValues.addressId, payload);
        toast.success("Cập nhật thành công");
      } else {
        await buyerAddressService.createAddress(buyerId, payload);
        toast.success("Thêm mới thành công");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-2xl animate-fade-in-up">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <button 
                onClick={onCancel}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                title="Quay lại"
            >
                <FaArrowLeft />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {initialValues ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Thông tin giao hàng chính xác giúp bạn nhận hàng nhanh hơn</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                    label="Tên người nhận"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="VD: Nguyễn Văn A"
                    inputClassName="h-12 text-base"
                />
                <InputField
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    inputClassName="h-12 text-base"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ chi tiết</label>
                <textarea
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Số nhà, tên đường, tòa nhà..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all resize-none text-base"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quốc gia</label>
                  <div className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-sm font-medium flex items-center">
                    Việt Nam
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tỉnh/Thành phố</label>
                  <SearchableSelect 
                    placeholder="Chọn Tỉnh/Thành"
                    options={provinces.map(p => ({ value: p.province_code, label: p.name }))}
                    value={formData.provinceCode}
                    onChange={handleProvinceChange}
                  />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phường/Xã</label>
                  <SearchableSelect 
                    placeholder="Chọn Phường/Xã"
                    options={wards.map(w => ({ value: w.ward_code, label: w.name }))}
                    value={formData.wardCode}
                    onChange={handleWardChange}
                    disabled={!formData.provinceCode}
                  />
               </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Loại địa chỉ</label>
                <div className="flex gap-4">
                    {menuAddressItems.map((type) => (
                        <label key={type.val} className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border cursor-pointer transition-all text-sm font-medium hover:bg-gray-50",
                            formData.type === type.val 
                                ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500 shadow-sm" 
                                : "border-gray-200 text-gray-600"
                        )}>
                            <input 
                                type="radio" 
                                name="type" 
                                value={type.val} 
                                checked={formData.type === type.val} 
                                onChange={handleInputChange} 
                                className="hidden" 
                            />
                            <type.icon /> {type.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-8">
                <ButtonField
                    htmlType="submit"
                    type="login"
                    loading={loading}
                    className="px-8 h-12 w-50 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 min-w-40"
                >
                    <span className="flex items-center gap-2">
                        <FaSave /> {initialValues ? "Lưu thay đổi" : "Hoàn thành"}
                    </span>
                </ButtonField>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-6 h-12 w-50 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors"
                >
                    Hủy bỏ
                </button>
            </div>
        </form>
    </div>
  );
};