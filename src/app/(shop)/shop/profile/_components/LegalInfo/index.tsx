/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";
import { PortalModal } from "@/features/PortalModal";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import { getStoredUserDetail } from "@/utils/jwt";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import {
    Camera,
    Eye,
    EyeOff,
    FileCheck,
    History,
    Loader2,
    Lock,
    ShieldAlert,
    UserCheck
} from "lucide-react";
import { useState } from "react";
import { statusTagMap } from "../../../_utils/status";
import { useUpdateShopLegal } from "../../_hooks/useShop";
import { StepLegalInfo } from "../StepLegalInfo";

export default function LegalInfo({
  shop,
  setShop,
}: {
  shop: any;
  setShop: any;
}) {
  const [showSensitive, setShowSensitive] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const legal = shop?.legalInfo;
  const users = getStoredUserDetail();
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleUpdateShopLegal, loading: updating } = useUpdateShopLegal();
  const { uploadFile: uploadPresigned } = usePresignedUpload();

  const nationalityMap: Record<string, string> = {
    vn: "Việt Nam",
    us: "Hoa Kỳ",
    jp: "Nhật Bản",
    kr: "Hàn Quốc",
    uk: "Anh",
    fr: "Pháp",
    de: "Đức",
    au: "Úc",
    ca: "Canada",
    sg: "Singapore",
  };

  const identityMap: Record<string, string> = {
    cccd: "Căn Cước Công Dân (CCCD)",
    cmnd: "Chứng Minh Nhân Dân (CMND)",
    passport: "Hộ chiếu",
  };

  const handleEdit = () => {
    setFormData({
      nationality: legal?.nationality || "vn",
      fullName: legal?.fullName || "",
      idNumber: legal?.identityNumber || "",
      idType: legal?.identityType?.toLowerCase() || "cccd",
      idImages: [], // ImageUploadField sẽ quản lý việc thêm mới
      faceImages: [],
    });
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idImages = formData.idImages || [];
      const faceImages = formData.faceImages || [];

      // Logic Upload Image (Giữ nguyên logic presigned của bạn)
      let frontUrl = legal?.frontImageUrl;
      let backUrl = legal?.backImageUrl;
      let faceUrl = legal?.faceImageUrl;

      if (idImages[0]?.originFileObj) {
        const res = await uploadPresigned(
          idImages[0].originFileObj,
          UploadContext.DOCUMENT
        );
        frontUrl =
          res.finalUrl ||
          toPublicUrl(res.path.replace(/^pending\//, "public/") + "_orig.jpg");
      }
      if (idImages[1]?.originFileObj) {
        const res = await uploadPresigned(
          idImages[1].originFileObj,
          UploadContext.DOCUMENT
        );
        backUrl =
          res.finalUrl ||
          toPublicUrl(res.path.replace(/^pending\//, "public/") + "_orig.jpg");
      }
      if (faceImages[0]?.originFileObj) {
        const res = await uploadPresigned(
          faceImages[0].originFileObj,
          UploadContext.DOCUMENT
        );
        faceUrl =
          res.finalUrl ||
          toPublicUrl(res.path.replace(/^pending\//, "public/") + "_orig.jpg");
      }

      const payload = {
        nationality: formData.nationality,
        fullName: formData.fullName,
        identityNumber: formData.idNumber,
        identityType: formData.idType?.toUpperCase(),
        frontImageUrl: frontUrl,
        backImageUrl: backUrl,
        faceImageUrl: faceUrl,
      };

      const res = await handleUpdateShopLegal(
        users.shopId,
        legal.legalId,
        payload
      );
      if (res) {
        const shopRes = await getShopDetail(users.shopId);
        if (shopRes) setShop(shopRes.data);
        toastSuccess("Cập nhật định danh thành công!");
        setOpenModal(false);
      }
    } catch (err: any) {
      toastError(err?.message || "Cập nhật thất bại!");
    }
  };

  if (!legal) return null;

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
              <UserCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                  Thông tin Định Danh
                </h2>
                {
                  statusTagMap[
                    (legal?.verifiedStatus as keyof typeof statusTagMap) ||
                      "PENDING"
                  ]
                }
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Xác minh danh tính chủ sở hữu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="edit"
              onClick={() => setShowHistory(!showHistory)}
              className="px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest"
            >
              <History size={14} className="mr-2" />{" "}
              {showHistory ? "Ẩn lịch sử" : "Lịch sử"}
            </Button>
            <ButtonField
              htmlType="submit"
              type="login"
              onClick={handleEdit}
              className="px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-orange-500/20 border-0"
            >
              Chỉnh sửa
            </ButtonField>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Warning Banner */}
          <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-3xl flex items-start gap-4">
            <ShieldAlert className="text-orange-500 shrink-0 mt-1" size={20} />
            <p className="text-[11px] font-medium text-orange-800 leading-relaxed uppercase tracking-tight">
              Thông tin định danh chỉ được cập nhật cách nhau 30 ngày. Vui lòng
              đảm bảo hình ảnh rõ nét và khớp với thông tin đã nhập.
            </p>
          </div>

          {showHistory && legal?.lastModifiedDate && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl w-fit text-[11px] font-bold text-gray-500 italic animate-in fade-in slide-in-from-top-2">
              Chỉnh sửa lần cuối:{" "}
              {dayjs(legal.lastModifiedDate).format("DD/MM/YYYY HH:mm")}
            </div>
          )}

          {/* Info Grid */}
          <div className="relative pt-4">
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className="absolute -top-4 right-0 flex items-center gap-2 text-[10px] font-bold uppercase text-orange-600 hover:text-orange-700"
            >
              {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
              {showSensitive ? "Ẩn dữ liệu nhạy cảm" : "Xem dữ liệu nhạy cảm"}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
              {[
                {
                  label: "Quốc tịch",
                  value: nationalityMap[legal.nationality],
                },
                {
                  label: "Loại định danh",
                  value: identityMap[legal.identityType?.toLowerCase()],
                },
                {
                  label: "Số định danh",
                  value: legal.identityNumber,
                  isSensitive: true,
                },
                {
                  label: "Họ và Tên",
                  value: legal.fullName,
                  isSensitive: true,
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold text-gray-800",
                      item.isSensitive &&
                        !showSensitive &&
                        "blur-sm select-none"
                    )}
                  >
                    {item.isSensitive && !showSensitive
                      ? "SHP888888888"
                      : item.value || "---"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2">
              <Camera size={14} /> Hình ảnh xác thực
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Mặt trước", url: legal.frontImageUrl },
                { label: "Mặt sau", url: legal.backImageUrl },
                { label: "Sinh trắc học", url: legal.faceImageUrl },
              ].map((img, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 group">
                    {img.url && showSensitive ? (
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                        <Lock size={32} strokeWidth={1.5} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          Bị khóa
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                    {img.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PortalModal
        isOpen={openModal}
        onClose={() => !updating && setOpenModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
              <FileCheck size={18} />
            </div>
            <span className="font-bold text-gray-800">Cập nhật Định Danh</span>
          </div>
        }
        width="max-w-3xl"
        className="rounded-[3rem]"
      >
        <form onSubmit={handleSave} className="space-y-8 py-2">
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-1">
            <StepLegalInfo formData={formData} setFormData={setFormData} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              variant="edit"
              type="button"
              disabled={updating}
              onClick={() => setOpenModal(false)}
              className="px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest"
            >
              Hủy bỏ
            </Button>
            <ButtonField
              htmlType="submit"
              type="login"
              disabled={updating}
              className="px-10 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 border-0 flex items-center gap-2"
            >
              {updating && <Loader2 size={14} className="animate-spin" />}
              Lưu thay đổi
            </ButtonField>
          </div>
        </form>
      </PortalModal>
    </>
  );
}
