/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ShieldCheck,
  User,
  CreditCard,
  MapPin,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Image from "next/image";

export const LegalInfo = ({ shop }: { shop: any; setShop: any }) => {
  const legal = shop?.legalInfo;

  const infoRows = [
    {
      label: "Họ và tên chủ sở hữu",
      value: legal?.fullName,
      icon: <User size={14} />,
    },
    {
      label: "Quốc tịch",
      value: legal?.nationality?.toUpperCase(),
      icon: <MapPin size={14} />,
    },
    {
      label: "Loại giấy tờ",
      value: legal?.identityType,
      icon: <CreditCard size={14} />,
    },
    {
      label: "Số định danh (CCCD/HC)",
      value: legal?.identityNumber,
      icon: <CreditCard size={14} />,
    },
  ];
  const images = [
    { label: "Mặt trước CCCD", url: legal?.frontImagePreviewUrl }, 
    { label: "Mặt sau CCCD", url: legal?.backImagePreviewUrl }, 
    { label: "Ảnh chân dung", url: legal?.faceImagePreviewUrl }, 
  ];

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-custom overflow-hidden mt-6 animate-in fade-in duration-500">
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-100">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                Thông tin Định Danh
              </h2>
              {legal?.verifiedStatus === "VERIFIED" && (
                <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                  <CheckCircle2 size={10} /> Đã xác minh
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Xác thực danh tính chủ cửa hàng
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-100 rounded-4xl overflow-hidden bg-gray-50/20 shadow-inner">
          {infoRows.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 flex flex-col gap-2 border-b border-r last:border-0 border-gray-50 group hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-blue-400 transition-colors">
                {item.icon} {item.label}
              </div>
              <div className="text-sm font-bold text-gray-800 tracking-tight">
                {item.value || "Đang chờ cập nhật"}
              </div>
            </div>
          ))}
        </div>

        {/* Section Hình ảnh CCCD */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <ImageIcon size={16} className="text-gray-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Giấy tờ đính kèm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div key={i} className="space-y-3 group">
                <div className="aspect-video relative bg-gray-100 rounded-4xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center transition-all group-hover:border-blue-200 group-hover:bg-blue-50/30">
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ShieldCheck size={24} strokeWidth={1} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        Bản sao bảo mật
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-center text-[10px] font-bold uppercase text-gray-500 group-hover:text-blue-500 transition-colors">
                  {img.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
