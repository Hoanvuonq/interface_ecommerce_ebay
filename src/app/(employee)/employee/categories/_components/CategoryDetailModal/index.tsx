"use client";

import { useGetAllChildren } from "@/app/manager/_hooks/useCategoryController";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import {
  Activity,
  Box,
  Calendar,
  ChevronDown,
  Edit3,
  ImageIcon,
  Layers,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DetailModalProps {
  category: CategoryResponse;
  onClose: () => void;
  onEdit?: (category: CategoryResponse) => void;
  onDelete?: (categoryId: string) => void;
}

export const CategoryDetailModal: React.FC<DetailModalProps> = ({
  category,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [mounted, setMounted] = useState(false);
  const [children, setChildren] = useState<CategoryResponse[]>([]);
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(
    new Set(),
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const { handleGetAllChildren, loading: loadingChildren } =
    useGetAllChildren();

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    if (category.id) loadChildren();

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [category.id]);

  const getImageUrl = (path: string, size: string = "orig") => {
    if (!path) return "/placeholder-image.png"; // Tránh lỗi nếu path bị null
    const formattedPath = path.replace("*", size);
    return toPublicUrl(formattedPath);
  };

  const loadChildren = async () => {
    const data = await handleGetAllChildren(category.id);
    if (data) {
      const content = Array.isArray(data) ? data : (data as any).data || [];
      setChildren(content);
    }
  };

  const toggleChildExpansion = (childId: string) => {
    setExpandedChildren((prev) => {
      const newSet = new Set(prev);
      newSet.has(childId) ? newSet.delete(childId) : newSet.add(childId);
      return newSet;
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-999 flex justify-end">
      <div
        className="absolute inset-0 bg-orange-950/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-orange-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Chi Tiết <span className="text-orange-600">Danh Mục</span>
              </h2>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">
                ID: {category.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-2xl transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Preview */}
            <div className="relative group shrink-0 mx-auto md:mx-0">
              <div className="absolute inset-0 bg-orange-400 rounded-[40px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div
                className="relative w-48 h-48 rounded-[44px] border-4 border-white overflow-hidden shadow-xl bg-orange-50 flex items-center justify-center cursor-zoom-in"
                onClick={() => setPreviewVisible(true)}
              >
                {category.imagePath ? (
                  <Image
                    src={getImageUrl(category.imagePath)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="192px"
                  />
                ) : (
                  <ImageIcon size={64} className="text-orange-100" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                {category.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <span
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm",
                    category.active
                      ? "bg-orange-50 text-orange-600 border-orange-100"
                      : "bg-gray-50 text-gray-400 border-gray-100",
                  )}
                >
                  {category.active ? "● Đang hoạt động" : "○ Đang khóa"}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-widest">
                  Version {category.version || 1}.0
                </span>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 italic text-gray-600 text-sm leading-relaxed">
                {category.description ||
                  "Không có mô tả chi tiết cho danh mục này."}
              </div>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={<Activity size={18} />}
              label="Đường dẫn (Slug)"
              value={`/${category.slug}`}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
            <InfoCard
              icon={<Layers size={18} />}
              label="Cấp bậc cha"
              value={category.parent?.name || "Danh mục gốc"}
              color="text-amber-600"
              bgColor="bg-amber-50"
            />
            <InfoCard
              icon={<User size={18} />}
              label="Người tạo"
              value={category.createdBy || "Hệ thống"}
              color="text-orange-700"
              bgColor="bg-orange-100/50"
            />
            <InfoCard
              icon={<Calendar size={18} />}
              label="Ngày khởi tạo"
              value={new Date(category.createdDate).toLocaleDateString("vi-VN")}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>

          {/* Subcategories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4 py-1">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                Danh mục trực thuộc
              </h4>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                {children.length} mục
              </span>
            </div>

            <div className="space-y-3">
              {loadingChildren ? (
                <div className="flex items-center gap-2 text-xs text-orange-300 animate-pulse pl-5">
                  Đang tải dữ liệu con...
                </div>
              ) : children.length === 0 ? (
                <p className="text-xs text-gray-400 italic pl-5">
                  Không có danh mục con.
                </p>
              ) : (
                children.map((child) => (
                  <div
                    key={child.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:border-orange-200 transition-all"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-orange-50/30 transition-colors"
                      onClick={() => toggleChildExpansion(child.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-300 group-hover:text-orange-500 group-hover:bg-white transition-all shadow-inner">
                          <Box size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-700 uppercase">
                          {child.name}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "text-gray-400 transition-transform duration-300",
                          expandedChildren.has(child.id) &&
                            "rotate-180 text-orange-500",
                        )}
                        size={20}
                      />
                    </div>
                    {expandedChildren.has(child.id) && (
                      <div className="px-6 pb-6 pt-2 bg-orange-50/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-2 gap-4 border-t border-orange-100 pt-4">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                              Slug
                            </p>
                            <p className="text-xs font-mono font-semibold text-gray-600">
                              /{child.slug}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                              Cập nhật
                            </p>
                            <p className="text-xs font-semibold text-gray-600">
                              {new Date(
                                child.lastModifiedDate,
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(child);
                            }}
                            className="flex-1 py-2.5 bg-white border border-orange-100 rounded-xl text-[10px] font-bold uppercase text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Edit3 size={12} /> Chỉnh sửa
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(child.id);
                            }}
                            className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-bold uppercase text-gray-400 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 size={12} /> Xóa bỏ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-orange-50/30 border-t border-orange-100 flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onEdit?.(category);
              onClose();
            }}
            className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <Edit3 size={16} /> Lưu thay đổi
          </button>
          <button
            onClick={() => {
              onDelete?.(category.id);
              onClose();
            }}
            className="p-4 bg-white text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shadow-sm border border-gray-100 hover:border-red-100"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Fullscreen Preview */}
        {previewVisible && getImageUrl && (
          <div className="fixed inset-0 z-1000 bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-10 animate-in fade-in duration-300">
            <button
              onClick={() => setPreviewVisible(false)}
              className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-orange-500 text-white rounded-full transition-all"
            >
              <X size={32} />
            </button>
            <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
              <Image
                src={getImageUrl(category.imagePath ?? "")}
                alt="Preview"
                fill
                className="object-contain animate-in zoom-in-95 duration-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

function InfoCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
  color?: string;
  bgColor?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm group hover:border-orange-100 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
            bgColor,
            color,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {label}
          </p>
          <p className="text-sm font-bold text-gray-800 tracking-tight truncate leading-none">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
