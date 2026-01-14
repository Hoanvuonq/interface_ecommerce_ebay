"use client";
import { Clock, Heart, LayoutGrid, MessageCircle, Star, Verified } from "lucide-react";

export const ShopHeader = ({ shop, isFollowing, onFollow, onChat, totalProducts }: any) => {
  const fallbackBanner = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80";
  
  return (
    <div className="relative w-full  group">
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-3xl shadow-lg">
        <img 
          src={shop.bannerUrl || fallbackBanner}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="shop-banner"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-end md:items-center">
            
            <div className="relative shrink-0">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                  <img 
                    src={shop.logoUrl || "/placeholder-avatar.jpg"} 
                    className="w-full h-full object-cover" 
                    alt="logo"
                  />
               </div>
               <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm" title="Online">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
               </div>
            </div>

            <div className="flex-1 mb-2">
               <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-bold drop-shadow-md tracking-tight">{shop.shopName}</h1>
                  <span className="bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gray-400 flex items-center gap-1 backdrop-blur-sm">
                     <Verified size={12} fill="currentColor" /> Official
                  </span>
               </div>
               
               <div className="flex flex-wrap gap-4 text-xs md:text-sm text-white/90 font-medium">
                  <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.9 (2.1k đánh giá)
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <LayoutGrid size={14} /> {totalProducts} Sản phẩm
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                     <Clock size={14} /> Tham gia: {shop.createdDate ? new Date(shop.createdDate).getFullYear() : '2024'}
                  </div>
               </div>
            </div>

            <div className="flex w-full md:w-auto gap-3">
               <button 
                  onClick={onFollow}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md ${
                     isFollowing 
                     ? "bg-white text-orange-600 shadow-lg" 
                     : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  }`}
               >
                  <Heart size={18} fill={isFollowing ? "currentColor" : "none"} />
                  {isFollowing ? "Đã theo dõi" : "Theo dõi"}
               </button>

               <button 
                  onClick={onChat}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
               >
                  <MessageCircle size={18} />
                  Chat ngay
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};