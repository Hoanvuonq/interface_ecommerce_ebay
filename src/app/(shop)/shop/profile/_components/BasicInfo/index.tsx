/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { ButtonField } from "@/components";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import { UploadContext } from "@/types/storage/storage.types";
import { getStoredUserDetail } from "@/utils/jwt";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import { Store } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useUpdateShop } from "../../_hooks/useShop";
import { EditShopModal } from "../EditShopModal";
import { BasicInfoProps } from "./type";

export const BasicInfo = ({ shop, setShop }: BasicInfoProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: [] as any[],
    banner: [] as any[],
  });

  const { handleUpdateShop, loading: updating } = useUpdateShop();
  const { uploadFile: uploadPresigned, uploading: uploadingImage } =
    usePresignedUpload();
  const users = getStoredUserDetail();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleEdit = () => {
    setFormData({
      name: shop?.shopName || "",
      description: shop?.description || "",
      logo: shop?.logoPath
        ? [{ uid: "-1", url: toPublicUrl(shop.logoPath), status: "done" }]
        : [],
      banner: shop?.bannerPath
        ? [{ uid: "-1", url: toPublicUrl(shop.bannerPath), status: "done" }]
        : [],
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim().split(/\s+/).length < 2) {
      toastError("Tên shop phải có ít nhất 2 từ");
      return;
    }

    try {
      // 1. Kiểm tra xem người dùng có chọn file mới hay không
      const fileToUpload = formData.logo?.[0]?.originFileObj || null;
      const bannerToUpload = formData.banner?.[0]?.originFileObj || null;

      // 2. Mặc định lấy AssetId hiện tại của shop
      let currentLogoAssetId = shop?.logoAssetId || "";
      let currentBannerAssetId = shop?.bannerAssetId || "";

      // 3. Nếu có file logo mới, upload và lấy assetId mới
      if (fileToUpload) {
        const res = await uploadPresigned(
          fileToUpload,
          UploadContext.SHOP_LOGO,
        );
        currentLogoAssetId = res.assetId; // Lấy AssetId từ response upload
      }

      // 4. Nếu có file banner mới, upload và lấy assetId mới
      if (bannerToUpload) {
        const res = await uploadPresigned(
          bannerToUpload,
          UploadContext.SHOP_BANNER,
        );
        currentBannerAssetId = res.assetId; // Lấy AssetId từ response upload
      }

      // 5. Tạo payload gửi lên API Update
      const payload = {
        shopName: formData.name,
        description: formData.description,
        logoAssetId: currentLogoAssetId, // Sử dụng ID thay vì URL
        bannerAssetId: currentBannerAssetId, // Sử dụng ID thay vì URL
      };

      const res = await handleUpdateShop(payload);

      if (res) {
        // Reload lại dữ liệu shop từ Server sau khi cập nhật thành công
        const shopRes = await getShopDetail(users.shopId);
        if (shopRes) setShop(shopRes.data);
        toastSuccess("Cập nhật thông tin shop thành công!");
        setOpen(false);
      }
    } catch (err: any) {
      toastError(err?.message || "Cập nhật thất bại!");
    }
  };

  const isProcessing = updating || uploadingImage;

  // Render phần hiển thị sử dụng path (vì UI cần URL để hiển thị ảnh)
  return (
    <>
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden ">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
              <Store size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              Thông tin cơ bản
            </h2>
          </div>
          <ButtonField
            type="login"
            onClick={handleEdit}
            className="px-8 w-40 rounded-xl text-xs font-bold uppercase"
          >
            Chỉnh sửa
          </ButtonField>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
            <span className="text-[11px] font-bold uppercase text-gray-700">
              Tên Shop
            </span>
            <span className="text-sm font-bold uppercase text-gray-800">
              {shop?.shopName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-start">
            <span className="text-[11px] font-bold uppercase text-gray-700 mt-2">
              Logo Shop
            </span>
            <div className="flex items-center gap-6">
              {shop?.logoPath ? (
                <div className="relative w-24 h-24 border-4 border-white shadow-custom ring-1 ring-gray-100 rounded-2xl overflow-hidden">
                  <Image
                    src={toPublicUrl(toSizedVariant(shop.logoPath, "_orig"))}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Store />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-start">
            <span className="text-[11px] font-bold uppercase text-gray-700 mt-2">
              Banner Shop
            </span>
            <div className="flex items-center gap-6">
              {shop?.bannerUrl ? (
                <div className="relative w-48 h-24 border-4 border-white shadow-custom ring-1 ring-gray-100 rounded-2xl overflow-hidden">
                  <Image
                    src={toPublicUrl(toSizedVariant(shop.bannerUrl, "_orig"))}
                    alt="Banner"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
              ) : (
                 <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Store />
                </div>
              )}
              <div className="text-[10px] font-bold text-gray-700 leading-relaxed uppercase space-y-1">
                <p>• Tỷ lệ chuẩn: 16:9 hoặc 3:1</p>
                <p>• Chất lượng cao (Full HD)</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-start border-t border-gray-50 pt-8">
            <span className="text-[11px] font-bold uppercase text-gray-700">
              Mô tả Shop
            </span>
            <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
              {shop?.description || "Chưa có mô tả..."}
            </p>
          </div>
        </div>
      </div>

      <EditShopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        isProcessing={isProcessing}
      />
    </>
  );
};
