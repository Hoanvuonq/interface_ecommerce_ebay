/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useCreateShopAddress,
  useGetAllShopAddresses,
  useUpdateShopAddress,
} from "@/app/(shop)/shop/marketing/vouchers/_hooks/useShopAddress";
import { ButtonField } from "@/components";
import { useToast } from "@/hooks/useToast";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { getStoredUserDetail } from "@/utils/jwt";
import {
  Loader2,
  MapPin,
  Plus
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import addressData, { Province, Ward } from "vietnam-address-database";
import { AddressFormModal } from "../AddressFormModal";
import { ShopAddressCard } from "../ShopAddressCard";
import { ShopAddress } from "./type";

export const ShopAddressForm = () => {
  const [addresses, setAddresses] = useState<ShopAddress[]>([]);
  const { handleGetAllShopAddresses, loading } = useGetAllShopAddresses();
  const users = useMemo(() => getStoredUserDetail(), []);
  const shopId = users?.shopId;
  const { success, error } = useToast();

  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShopAddress | null>(
    null,
  );

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");

  const { handleCreateShopAddress, loading: creating } = useCreateShopAddress();
  const { handleUpdateShopAddress, loading: updating } = useUpdateShopAddress();

  useEffect(() => {
    try {
      let provincesData: Province[] = [];
      let wardsData: Ward[] = [];
      addressData.forEach((item: any) => {
        if (item.type === "table") {
          if (item.name === "provinces") provincesData = item.data;
          else if (item.name === "wards") wardsData = item.data;
        }
      });
      setProvinces(provincesData);
      setAllWards(wardsData);
    } catch (e) {
      console.error("❌ Error parsing addressData:", e);
    }
  }, []);

  useEffect(() => {
    if (selectedProvinceCode) {
      setWards(
        allWards.filter((w) => w.province_code === selectedProvinceCode),
      );
    }
  }, [selectedProvinceCode, allWards]);

  const fetchAddresses = async () => {
    if (!shopId) return;
    try {
      const res = await handleGetAllShopAddresses(shopId);
      if (res?.data) setAddresses(res.data);
    } catch (err) {
      error("Không thể tải danh sách địa chỉ");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [shopId]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setSelectedProvinceCode("");
    setOpen(true);
  };

  const handleOpenEdit = (address: ShopAddress) => {
    setEditingAddress(address);
    setSelectedProvinceCode(address.address.provinceCode || "");
    setOpen(true);
  };

  const onSave = async (formData: any) => {
    try {
      const oldAddress = mapAddressToOldFormat(
        formData.wardName,
        formData.provinceName,
      );

      const payload: any = {
        address: {
          countryCode: "VN",
          countryName: "Vietnam",
          provinceCode: formData.provinceCode,
          provinceName: formData.provinceName,
          wardCode: formData.wardCode,
          wardName: formData.wardName,
          detail: formData.addressDetail,
          ...(oldAddress.old_ward_name && {
            districtNameOld: oldAddress.old_district_name,
            provinceNameOld: oldAddress.old_province_name,
            wardNameOld: oldAddress.old_ward_name,
          }),
        },
        detail: formData.addressDetail,
        fullName: formData.fullName,
        phone: formData.phone,
        isDefault: formData.default,
        isDefaultPickup: formData.defaultPickup,
        isDefaultReturn: formData.defaultReturn,
      };

      if (editingAddress) {
        await handleUpdateShopAddress(
          shopId,
          editingAddress.addressId,
          payload,
        );
        success("Cập nhật địa chỉ thành công!");
      } else {
        await handleCreateShopAddress(shopId, payload);
        success("Thêm địa chỉ mới thành công!");
      }
      fetchAddresses();
      setOpen(false);
    } catch (err: any) {
      error(err?.message || "Lỗi xử lý địa chỉ");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
            Địa chỉ Shop
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Quản lý các điểm lấy hàng và trả hàng chính thức
          </p>
        </div>
        <ButtonField
          type="login"
          onClick={handleOpenAdd}
          className="rounded-2xl! w-50 shadow-lg shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          <div className="flex items-center gap-2 px-1">
            <Plus size={18} strokeWidth={3} />
            <span className="font-bold text-[13px] uppercase">
              Thêm địa chỉ
            </span>
          </div>
        </ButtonField>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-orange-500 animate-spin" />
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Đang đồng bộ dữ liệu...
          </span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
          <div className="bg-white w-16 h-16 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <MapPin size={28} className="text-slate-300" />
          </div>
          <h3 className="text-slate-800 font-bold uppercase text-sm">
            Kho hàng chưa có tọa độ
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Hãy thiết lập địa chỉ để bắt đầu kinh doanh ngay
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-5">
          {addresses.map((item, index) => (
            <ShopAddressCard
              key={item.addressId}
              item={item}
              index={index}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                setAddresses((prev) => prev.filter((a) => a.addressId !== id));
                success("Đã ngắt kết nối Node địa chỉ!");
              }}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        open={open}
        onClose={() => setOpen(false)}
        editingAddress={editingAddress}
        onSave={onSave}
        loading={creating || updating}
        provinces={provinces}
        wards={wards}
        onProvinceChange={setSelectedProvinceCode}
      />
    </div>
  );
};
