/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Image from "next/image";
import { Column } from "@/components/DataTable/type";
import {
  BannerResponseDTO,
  DeviceTarget,
} from "@/app/(main)/(home)/_types/banner.dto";
import { toPublicUrl } from "@/utils/storage/url";
import {
  Monitor,
  Smartphone,
  Globe,
  Edit3,
  Trash2,
  Link2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import { ActionBtn } from "@/components";

interface BannerColumnProps {
  onEdit: (banner: BannerResponseDTO) => void;
  onDelete: (banner: BannerResponseDTO) => void;
  onToggleActive: (banner: BannerResponseDTO, active: boolean) => void;
}

export const getBannerColumns = ({
  onEdit,
  onDelete,
  onToggleActive,
}: BannerColumnProps): Column<BannerResponseDTO>[] => [
  {
    header: "Thông tin Banner",
    render: (record) => {
      const imageUrl = record.imagePath
        ? toPublicUrl(record.imagePath.replace("*", "orig"))
        : null;
      return (
        <div className="flex items-center gap-5 py-3 min-w-[320px]">
          <div className="relative w-28 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-orange-100/50 shadow-md bg-white group">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={record.title || "Banner"}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                <Globe size={16} className="mb-1 opacity-20" />
                No Media
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex flex-col min-w-0">
            <h4 className="font-bold text-slate-800 truncate text-sm uppercase italic tracking-tighter leading-none mb-1.5 flex items-center gap-1.5">
              {record.title || "Unnamed Asset"}
              {record.active && (
                <ShieldCheck size={12} className="text-emerald-500" />
              )}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold truncate max-w-50 leading-relaxed">
              {record.subtitle || "No description provided for this resource."}
            </p>
            {record.href && (
              <div className="flex items-center gap-1.5 mt-2 text-orange-500 hover:underline cursor-pointer">
                <Link2 size={11} strokeWidth={3} />
                <span className="text-[9px] font-bold uppercase truncate tracking-widest italic opacity-80">
                  {record.href}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: "Phân loại & Vị trí",
    render: (record) => {
      const isDesktop = record.deviceTarget === DeviceTarget.DESKTOP;
      const isMobile = record.deviceTarget === DeviceTarget.MOBILE;

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "px-3 py-1 rounded-xl border-2 text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-sm transition-all",
                isDesktop
                  ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                  : isMobile
                    ? "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
              )}
            >
              {isDesktop ? (
                <Monitor size={12} />
              ) : isMobile ? (
                <Smartphone size={12} />
              ) : (
                <Globe size={12} />
              )}
              {record.deviceTarget || "GLOBAL"}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] italic opacity-80">
              {record.displayLocation?.split("_").pop()}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Thời hạn hiển thị",
    render: (record) => {
      if (!record.scheduleEnd)
        return (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" />
            <span className="text-[10px] font-bold uppercase italic tracking-widest">
              Permanent
            </span>
          </div>
        );

      const diffDays = dayjs(record.scheduleEnd).diff(dayjs(), "day", true);
      const isExpired = diffDays < 0;

      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tabular-nums">
            <Clock size={14} className="text-orange-400" />
            {dayjs(record.scheduleEnd).format("DD MMM YYYY")}
          </div>
          <div
            className={cn(
              "w-fit px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase italic tracking-widest border-2 shadow-sm",
              isExpired
                ? "bg-rose-50 text-rose-500 border-rose-100"
                : "bg-indigo-50 text-indigo-600 border-indigo-100",
            )}
          >
            {isExpired ? "Terminated" : `Active for ${Math.ceil(diffDays)}d`}
          </div>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (record) => (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => onToggleActive(record, !record.active)}
          className={cn(
            "w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner group",
            record.active
              ? "bg-orange-500 shadow-orange-200"
              : "bg-slate-200 shadow-slate-100",
          )}
        >
          <div
            className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md",
              record.active ? "left-7 rotate-12" : "left-1 -rotate-12",
            )}
          />
        </button>
        <span
          className={cn(
            "text-[9px] font-bold uppercase italic tracking-[0.2em]",
            record.active ? "text-emerald-500" : "text-slate-400",
          )}
        >
          {record.active ? "On Live" : "Draft"}
        </span>
      </div>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (record) => (
      <div className="flex items-center justify-end gap-2.5">
        <ActionBtn
          onClick={() => onEdit(record)}
          icon={<Edit3 size={14} />}
          color="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100"
          tooltip="Chỉnh sửa"
        />
        <ActionBtn
          onClick={() => onEdit(record)}
          icon={<Trash2 size={14} />}
          color="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100"
          tooltip="Xóa Banner"
        />
      </div>
    ),
  },
];
