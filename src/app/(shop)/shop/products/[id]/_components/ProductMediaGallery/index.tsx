"use client";

import Image from "next/image";
import { ImageIcon, Star, Edit3, Play } from "lucide-react";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { cn } from "@/utils/cn";

export const ProductMediaGallery = ({
  media = [],
  onManage,
  onPreview,
}: {
  media: any[];
  onManage: () => void;
  onPreview: (item: any) => void;
}) => (
  <div className="bg-white rounded-4xl shadow-custom border border-gray-50 overflow-hidden transition-all hover:shadow-orange-100/50">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-600 shadow-sm shadow-orange-100">
          <ImageIcon size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-[14px] font-bold text-gray-800 tracking-tight uppercase italic">
            Media Gallery
          </h2>
          <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest leading-none">
            {media.length} items trong kho
          </span>
        </div>
      </div>
      <button
        onClick={onManage}
        className="p-2 bg-white border border-orange-100 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-90"
      >
        <Edit3 size={16} strokeWidth={2.5} />
      </button>
    </div>

    <div className="p-6">
      {media.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[...media]
            .sort((a, b) => (a.isPrimary ? -1 : 1))
            .map((item, idx) => {
              const isVideo =
                item.type === "VIDEO" || item.url?.includes("/videos/");

              return (
                <div
                  key={item.id || idx}
                  onClick={() => onPreview(item)}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group cursor-pointer transition-all hover:border-orange-400 hover:shadow-md active:scale-95"
                >
                  {item.isPrimary && (
                    <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-orange-500 text-[8px] font-bold text-white rounded-md flex items-center gap-1 shadow-lg uppercase tracking-tighter">
                      <Star size={8} fill="currentColor" /> Chính
                    </div>
                  )}

                  {isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 relative">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-white/30">
                        <Play
                          size={14}
                          fill="currentColor"
                          className="ml-0.5"
                        />
                      </div>
                      <span className="text-[8px] font-bold text-white/50 mt-1.5 uppercase tracking-widest italic">
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          resolveMediaUrl(item, "_medium") || "/placeholder.png"
                        }
                        alt={`Product media ${idx}`}
                        fill
                        sizes="(max-width: 768px) 33vw, 150px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white px-2 py-1 rounded-lg shadow-xl text-[8px] font-bold text-orange-600 uppercase tracking-tight scale-75 group-hover:scale-100 transition-transform italic border border-orange-100">
                      View {isVideo ? "Video" : "Image"}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center bg-orange-50/20 rounded-2xl border-2 border-dashed border-orange-100/50">
          <ImageIcon
            size={32}
            className="text-orange-200 mb-2"
            strokeWidth={1.5}
          />
          <p className="text-[10px] font-bold text-orange-300 uppercase tracking-[0.2em] italic">
            Chưa có phương tiện hiển thị
          </p>
        </div>
      )}
    </div>
  </div>
);
