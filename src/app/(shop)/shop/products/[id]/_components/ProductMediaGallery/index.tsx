"use client";

import { ImageIcon, Star, Video, Edit3, Play } from "lucide-react"; // Thêm Play icon
import { resolveMediaUrl } from "@/utils/products/media.helpers";

export const ProductMediaGallery = ({
  media = [],
  onManage,
  onPreview,
}: {
  media: any[];
  onManage: () => void;
  onPreview: (item: any) => void;
}) => (
  <div className="bg-white rounded-[2.5rem] shadow-custom border border-gray-50 overflow-hidden">
    <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
          <ImageIcon size={20} />
        </div>
        <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">
          Media Gallery
        </h2>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {media.length} items
        </span>
      </div>
      <button
        onClick={onManage}
        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-gray-200 transition-all shadow-sm"
      >
        <Edit3 size={18} />
      </button>
    </div>
    <div className="p-8">
      {media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {[...media]
            .sort((a, b) => (a.isPrimary ? -1 : 1))
            .map((item, idx) => { // Bỏ tham số mediaItem thừa ở đây
              const isVideo =
                item.type === "VIDEO" || item.url?.includes("/videos/");
              
              return (
                <div
                  key={item.id || idx}
                  // FIX QUAN TRỌNG: Truyền chính xác 'item' hiện tại
                  onClick={() => onPreview(item)} 
                  className="relative aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  {item.isPrimary && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-orange-500 text-[9px] font-bold text-white rounded-lg flex items-center gap-1 shadow-md">
                      <Star size={8} fill="currentColor" /> CHÍNH
                    </div>
                  )}

                  {isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 relative">
                      {/* Thêm icon Play lớn ở giữa cho rõ ràng */}
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                      <span className="text-[10px] font-bold text-white/50 mt-2 uppercase tracking-widest">Video</span>
                    </div>
                  ) : (
                    <img
                      src={resolveMediaUrl(item, "_medium")}
                      className="w-full h-full object-cover"
                      alt="product"
                    />
                  )}
                  
                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold text-orange-600 uppercase tracking-tighter scale-90 group-hover:scale-100 transition-transform">
                        Xem {isVideo ? 'Video' : 'Ảnh'}
                     </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
          <ImageIcon size={40} className="text-gray-200 mb-3" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Chưa có hình ảnh
          </p>
        </div>
      )}
    </div>
  </div>
);