"use client";

import {
  Button,
  FormInput,
  MediaUploadField,
  SelectComponent,
  SectionHeader,
} from "@/components";
import { CustomFile } from "@/components/mediaUploadField/type";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import notificationService from "@/layouts/header/_service/notification.service";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import {
  Bell,
  SendHorizontal,
  Users,
  Settings,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";
import { BroadcastFormData } from "./type";

export const BroadcastNotificationForm = () => {
  const [loading, setLoading] = useState(false);
  const { uploadFile } = usePresignedUpload();
  const { success, error: toastError, warning } = useToast();

  const [formData, setFormData] = useState<BroadcastFormData>({
    targetAudience: "ALL_USERS",
    type: "SYSTEM",
    priority: "NORMAL",
    title: "",
    content: "",
    category: "SYSTEM",
    imageUrl: "",
    redirectUrl: "",
  });

  const [mediaFiles, setMediaFiles] = useState<CustomFile[]>([]);

  const handleInputChange = (key: keyof BroadcastFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadApi = async (
    file: File,
    onProgress: (p: number) => void,
  ) => {
    const result = await uploadFile(file, UploadContext.PRODUCT_IMAGE);
    if (result?.finalUrl) {
      handleInputChange("imageUrl", result.finalUrl);
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      warning("Vui lòng nhập tiêu đề");
      return;
    }

    setLoading(true);
    try {
      const recipientCount = await notificationService.sendBroadcast(formData);
      success(`Thông báo đã được gửi đến ${recipientCount} người dùng`);

      setFormData({
        targetAudience: "ALL_USERS",
        type: "SYSTEM",
        priority: "NORMAL",
        title: "",
        content: "",
        category: "SYSTEM",
        imageUrl: "",
        redirectUrl: "",
      });
      setMediaFiles([]);
    } catch (err) {
      toastError("Gửi thông báo thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="bg-orange-500 p-6 flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <Bell className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">
              Broadcast Notification
            </h2>
            <p className="text-orange-100 text-xs font-medium">
              Gửi thông báo hệ thống đến người dùng
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* 1. Đối tượng nhận tin */}
          <div className="space-y-4">
            <SectionHeader
              icon={Users}
              title="Đối tượng nhận tin"
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Tất cả Buyers", value: "ALL_BUYERS" },
                { label: "Tất cả Shops", value: "ALL_SHOPS" },
                { label: "Tất cả Users", value: "ALL_USERS" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    handleInputChange("targetAudience", item.value)
                  }
                  className={cn(
                    "py-3 px-4 rounded-xl border transition-all duration-200 font-semibold text-sm",
                    formData.targetAudience === item.value
                      ? "border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-100"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Cấu hình thông báo */}
          <div className="space-y-4">
            <SectionHeader
              icon={Settings}
              title="Cấu hình thông báo"
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500 ml-1">
                  LOẠI TIN
                </span>
                <SelectComponent
                  options={[
                    { label: "Hệ thống", value: "SYSTEM" },
                    { label: "Đơn hàng", value: "ORDER" },
                    { label: "Sản phẩm", value: "PRODUCT" },
                  ]}
                  value={formData.type}
                  onChange={(val) => handleInputChange("type", val)}
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500 ml-1">
                  ĐỘ ƯU TIÊN
                </span>
                <SelectComponent
                  options={[
                    { label: "Bình thường", value: "NORMAL" },
                    { label: "Cao", value: "HIGH" },
                    { label: "Khẩn cấp", value: "URGENT" },
                  ]}
                  value={formData.priority}
                  onChange={(val) => handleInputChange("priority", val)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeader
              icon={FileText}
              title="Nội dung chi tiết"
              colorClass="text-orange-600"
              bgClass="bg-orange-50"
            />
            <div className="space-y-4">
              <FormInput
                label="TIÊU ĐỀ"
                required
                placeholder="Nhập tiêu đề thông báo..."
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="rounded-xl"
              />
              <FormInput
                label="NỘI DUNG"
                isTextArea
                placeholder="Mô tả chi tiết nội dung muốn gửi..."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="rounded-xl min-h-25"
              />
            </div>
          </div>

          {/* 4. Truyền thông & Liên kết */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <SectionHeader
                icon={ImageIcon}
                title="Hình ảnh"
                colorClass="text-emerald-600"
                bgClass="bg-emerald-50"
              />
              <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex justify-center">
                <MediaUploadField
                  value={mediaFiles}
                  onChange={(files) => {
                    setMediaFiles(files);
                    if (files.length === 0) handleInputChange("imageUrl", "");
                  }}
                  maxCount={1}
                  size="sm"
                  onUploadApi={handleUploadApi}
                  allowedTypes={["image/png", "image/jpeg", "image/webp"]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader
                icon={LinkIcon}
                title="Điều hướng"
                colorClass="text-blue-600"
                bgClass="bg-blue-50"
              />
              <FormInput
                label="URL CHUYỂN HƯỚNG"
                placeholder="/category/sale-tet"
                value={formData.redirectUrl}
                onChange={(e) =>
                  handleInputChange("redirectUrl", e.target.value)
                }
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              variant="dark"
              type="submit"
              loading={loading}
              className="w-full h-14 text-base bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg transition-all flex justify-center items-center"
              icon={<SendHorizontal className="w-4 h-4" />}
            >
              Gửi thông báo ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
