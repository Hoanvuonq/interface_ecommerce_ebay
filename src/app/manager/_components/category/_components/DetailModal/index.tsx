"use client";

import { useGetAllChildren } from "@/app/manager/_hooks/useCategory";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import {
    Activity,
    Box,
    Calendar,
    ChevronDown,
    Edit3,
    Image as ImageIcon,
    Layers,
    ShieldCheck,
    Trash2,
    User,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface DetailModalProps {
  category: CategoryResponse;
  onClose: () => void;
  onEdit?: (category: CategoryResponse) => void;
  onDelete?: (categoryId: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  category,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [children, setChildren] = useState<CategoryResponse[]>([]);
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(
    new Set()
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const { handleGetAllChildren, loading: loadingChildren } =
    useGetAllChildren();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (category.id) loadChildren();
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [category.id]);

  const getImageUrl = (cat: CategoryResponse) => {
    if (cat.imageBasePath && cat.imageExtension) {
      return toPublicUrl(`${cat.imageBasePath}_orig${cat.imageExtension}`);
    }
    return null;
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

  const imageUrl = getImageUrl(category);

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop Layer */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Main Side Drawer */}
      <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* Protocol Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-tighter italic leading-none">
                Entity <span className="text-orange-500">Explorer</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                ID: {category.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 text-gray-600 rounded-2xl transition-all active:scale-90"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Explorer Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {/* Visual Asset Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group shrink-0 mx-auto md:mx-0">
              <div className="absolute inset-0 bg-orange-500 rounded-[40px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div
                className="relative w-48 h-48 rounded-[44px] border-4 border-white overflow-hidden shadow-2xl bg-gray-50 flex items-center justify-center cursor-zoom-in"
                onClick={() => setPreviewVisible(true)}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    alt=""
                  />
                ) : (
                  <ImageIcon size={64} className="text-gray-200" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <h3 className="text-3xl font-semibold text-gray-900 tracking-tight leading-none uppercase">
                {category.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <span
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border shadow-sm",
                    category.active
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-rose-50 text-rose-600 border-rose-100"
                  )}
                >
                  {category.active ? "● Operational" : "○ Offline"}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-semibold uppercase tracking-widest shadow-sm">
                  v{category.version}.0
                </span>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed italic bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {category.description ||
                  "No encrypted metadata provided for this asset."}
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={<Activity />}
              label="Slug Identifier"
              value={`/${category.slug}`}
              color="text-indigo-600"
            />
            <InfoCard
              icon={<Layers />}
              label="Node Hierarchy"
              value={category.parent?.name || "Root Entity"}
              color="text-blue-600"
            />
            <InfoCard
              icon={<User />}
              label="Genesis Creator"
              value={category.createdBy}
              color="text-orange-600"
            />
            <InfoCard
              icon={<Calendar />}
              label="Sync Date"
              value={new Date(category.createdDate).toLocaleDateString("vi-VN")}
              color="text-emerald-600"
            />
          </div>

          {/* Children Entities Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-l-4 border-gray-500 pl-4 py-1">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-[0.2em]">
                Nested Entities
              </h4>
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-semibold">
                {children.length}
              </span>
            </div>

            <div className="space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onClick={() => toggleChildExpansion(child.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:text-blue-500 transition-colors">
                        <Box size={20} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                        {child.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "text-gray-500 transition-transform duration-300",
                        expandedChildren.has(child.id) && "rotate-180"
                      )}
                      size={20}
                    />
                  </div>
                  {expandedChildren.has(child.id) && (
                    <div className="px-6 pb-6 pt-2 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest leading-none">
                            Slug
                          </p>
                          <p className="text-xs font-bold text-gray-600">
                            /{child.slug}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest leading-none">
                            Modified
                          </p>
                          <p className="text-xs font-bold text-gray-600">
                            {new Date(
                              child.lastModifiedDate
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => onEdit?.(child)}
                          className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold uppercase text-gray-600 hover:text-orange-500 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => onDelete?.(child.id)}
                          className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-semibold uppercase text-gray-600 hover:text-rose-500 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={12} /> Purge
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Protocol Footer Actions */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onEdit?.(category);
              onClose();
            }}
            className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-semibold uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <Edit3 size={16} /> Modify Hierarchy
          </button>
          <button
            onClick={() => {
              onDelete?.(category.id);
              onClose();
            }}
            className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Custom Image Preview Overlay */}
      {previewVisible && imageUrl && (
        <div className="fixed inset-0 z-[200] bg-gray-900/90 backdrop-blur-xl flex items-center justify-center p-10 animate-in fade-in duration-300">
          <button
            onClick={() => setPreviewVisible(false)}
            className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            <X size={32} />
          </button>
          <img
            src={imageUrl}
            className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500"
            alt=""
          />
        </div>
      )}
    </div>
  );
};

// Helper Sub-component
interface InfoCardProps {
  icon: React.ReactElement<any>;
  label: string;
  value: string;
  color?: string;
}

function InfoCard({ icon, label, value, color }: InfoCardProps) {
  return (
    <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm group hover:border-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors",
            color
          )}
        >
          {React.cloneElement(icon, {
            size: 18,
            strokeWidth: 2.5,
          })}
        </div>
        <div>
          <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest leading-none mb-1.5">
            {label}
          </p>
          <p className="text-sm font-semibold text-gray-800 tracking-tight uppercase leading-none">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
