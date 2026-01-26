/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ImageUploadField } from "@/app/(main)/profile/_components/ImageUploadField";
import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { ButtonField, FormInput } from "@/components";
import { Button } from "@/components/button/button";
import { PortalModal } from "@/features/PortalModal";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import { UploadContext } from "@/types/storage/storage.types";
import { getStoredUserDetail } from "@/utils/jwt";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import {
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Store,
  Layout,
} from "lucide-react";
import { useState } from "react";
import { useUpdateShop } from "../../_hooks/useShop";
import Image from "next/image";
import { cn } from "@/utils/cn";
interface BasicInfoProps {
  shop?: any;
  setShop?: any;
  parentForm?: any;
  formData?: any;
  setFormData?: (values: any) => void;
}
export const BasicInfo = ({
  shop,
  setShop,
  parentForm,
}: BasicInfoProps) => {
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
      logo: shop?.logoUrl
        ? [{ uid: "-1", url: shop.logoUrl, status: "done" }]
        : [],
      banner: shop?.bannerUrl
        ? [{ uid: "-1", url: shop.bannerUrl, status: "done" }]
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
      const fileToUpload = formData.logo?.[0]?.originFileObj || null;
      const bannerToUpload = formData.banner?.[0]?.originFileObj || null;

      let logoPath = shop?.logoUrl || "";
      let bannerPath = shop?.bannerUrl || "";

      if (fileToUpload) {
        const res = await uploadPresigned(
          fileToUpload,
          UploadContext.SHOP_LOGO,
        );
        logoPath =
          res.finalUrl ||
          toPublicUrl(
            res.path.replace(/^pending\//, "public/") +
              "_orig." +
              (fileToUpload.name.split(".").pop() || "jpg"),
          );
      }

      if (bannerToUpload) {
        const res = await uploadPresigned(
          bannerToUpload,
          UploadContext.SHOP_BANNER,
        );
        bannerPath =
          res.finalUrl ||
          toPublicUrl(
            res.path.replace(/^pending\//, "public/") +
              "_orig." +
              (bannerToUpload.name.split(".").pop() || "jpg"),
          );
      }

      const payload = {
        shopName: formData.name,
        description: formData.description,
        logo: logoPath,
        banner: bannerPath,
      };

      const res = await handleUpdateShop(payload);

      if (res) {
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

  const ImagePlaceholder = ({ type }: { type: "logo" | "banner" }) => (
    <div
      className={cn(
        "flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-3xl text-gray-500",
        type === "logo" ? "w-24 h-24" : "w-48 h-24",
      )}
    >
      {type === "logo" ? (
        <Store size={32} strokeWidth={1.5} />
      ) : (
        <Layout size={32} strokeWidth={1.5} />
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
              <Store size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              Thông tin cơ bản
            </h2>
          </div>
          <div className="flex gap-3 ">
            <Button
              variant="edit"
              className="flex items-center gap-2 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={14} /> Xem Shop
              </span>
            </Button>
            <ButtonField
              htmlType="submit"
              type="login"
              onClick={handleEdit}
              className="px-8 w-40 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-orange-500/20 border-0 transition-all active:scale-95"
            >
              Chỉnh sửa
            </ButtonField>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Tên Shop
            </span>
            <span className="text-sm font-bold uppercase text-gray-800">
              {shop?.shopName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-start">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-2">
              Logo Shop
            </span>
            <div className="flex items-center gap-6">
              {shop?.logoUrl ? (
                <div className="relative w-24 h-24 border-4 border-white shadow-md ring-1 ring-gray-100 rounded-3xl overflow-hidden">
                  <Image
                    src={toPublicUrl(toSizedVariant(shop.logoUrl, "_orig"))}
                    alt="Logo"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <ImagePlaceholder type="logo" />
              )}
              <div className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase space-y-1">
                <p>• Kích thước: 300x300px</p>
                <p>• Dung lượng: Tối đa 2MB</p>
                <p>• Định dạng: JPG, JPEG, PNG</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-start">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-2">
              Banner Shop
            </span>
            <div className="flex items-center gap-6">
              {shop?.bannerUrl ? (
                <div className="relative w-48 h-24 border-4 border-white shadow-md ring-1 ring-gray-100 rounded-3xl overflow-hidden">
                  <Image
                    src={toPublicUrl(toSizedVariant(shop.bannerUrl, "_orig"))}
                    alt="Banner"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
              ) : (
                <ImagePlaceholder type="banner" />
              )}
              <div className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase space-y-1">
                <p>• Tỷ lệ chuẩn: 16:9 hoặc 3:1</p>
                <p>• Chất lượng cao (Full HD)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 items-start border-t border-gray-50 pt-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Mô tả Shop
            </span>
            <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
              {shop?.description || "Chưa có mô tả..."}
            </p>
          </div>
        </div>
      </div>

      <PortalModal
        isOpen={open}
        onClose={() => !isProcessing && setOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
              <Store size={18} />
            </div>
            <span className="font-bold text-gray-800">Cập nhật Cửa hàng</span>
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="edit"
              type="button"
              disabled={isProcessing}
              onClick={() => setOpen(false)}
              className="px-8 rounded-xl font-bold uppercase text-[11px] tracking-widest"
            >
              Hủy bỏ
            </Button>
            <ButtonField
              htmlType="submit"
              onClick={handleSave}
              type="login"
              disabled={isProcessing}
              className="w-40 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-orange-500/20 border-0 flex items-center gap-2"
            >
              <span className="flex gap-2 items-center">
                {isProcessing && <Loader2 size={14} className="animate-spin" />}
                Lưu thay đổi
              </span>
            </ButtonField>
          </div>
        }
        width="max-w-2xl"
        className="rounded-[2.5rem]"
      >
        <form onSubmit={handleSave} className="space-y-6 py-2 px-1">
          <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            <FormInput
              label="Tên Shop hiển thị"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên shop của bạn"
              maxLength={30}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                  <ImageIcon size={14} /> Logo Shop{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                  <ImageUploadField
                    value={formData.logo}
                    onChange={(val) => setFormData({ ...formData, logo: val })}
                    maxCount={1}
                    allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                    maxSizeMB={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                  <ImageIcon size={14} /> Banner Shop
                </label>
                <div className="p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                  <ImageUploadField
                    value={formData.banner}
                    onChange={(val) =>
                      setFormData({ ...formData, banner: val })
                    }
                    maxCount={1}
                    allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                    maxSizeMB={2}
                  />
                </div>
              </div>
            </div>

            <FormInput
              label="Giới thiệu về Shop"
              isTextArea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Viết vài dòng giới thiệu về cửa hàng của bạn..."
              maxLength={300}
              className="rounded-3xl!"
            />
          </div>
        </form>
      </PortalModal>
    </>
  );
};
