"use client";
import { Clock, Heart, LayoutGrid, MessageCircle, Star, Verified, Share2, MapPin } from "lucide-react";

export const ShopHeader = ({ shop, isFollowing, onFollow, onChat, totalProducts }: any) => {
  const fallbackBanner = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="relative w-full max-w-7xl mx-auto px-0 md:px-4 pt-4">
      {/* Banner Section */}
      <div className="relative h-48 md:h-72 w-full overflow-hidden rounded-3xl shadow-2xl shadow-slate-200">
        <img
          src={shop.bannerUrl || fallbackBanner}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt="shop-banner"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Nút share nhanh trên banner */}
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
          <Share2 size={18} />
        </button>
      </div>

      {/* Info Card Floating */}
      <div className="relative -mt-16 md:-mt-20 mx-4 md:mx-10 bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* Avatar với viền Neon nhẹ */}
        <div className="relative shrink-0 group">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] p-1.5 bg-linear-to-tr from-orange-500 to-yellow-400 shadow-xl overflow-hidden">
            <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-white">
              <img
                src={shop.logoUrl || "/placeholder-avatar.jpg"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="logo"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white flex items-center gap-1 shadow-lg">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Trực tuyến
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 text-center md:text-left pt-2">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight leading-none">
              {shop.shopName}
            </h1>
            <div className="flex items-center gap-1 bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-blue-200">
              <Verified size={10} fill="currentColor" /> Mall
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-slate-500 font-bold text-xs uppercase tracking-tight">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-500 fill-yellow-500" /> 
              <span className="text-slate-800">4.9</span> (2.1k đánh giá)
            </div>
            <div className="flex items-center gap-1.5">
              <LayoutGrid size={14} className="text-orange-500" /> 
              <span className="text-slate-800">{totalProducts}</span> Sản phẩm
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-red-500" /> Hà Nội, VN
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-400 flex items-center gap-2">
              <Clock size={12} /> Đã tham gia {shop.createdDate ? new Date(shop.createdDate).getFullYear() : '2024'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full md:w-auto gap-3 items-center self-center md:self-end">
          <button
            onClick={onFollow}
            className={`flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
              isFollowing
                ? "bg-slate-800 border-slate-800 text-white shadow-xl shadow-slate-200"
                : "bg-transparent border-slate-200 text-slate-400 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            <Heart size={18} fill={isFollowing ? "white" : "none"} className={isFollowing ? "animate-bounce" : ""} />
            {isFollowing ? "Đã theo dõi" : "Theo dõi"}
          </button>

          <button
            onClick={onChat}
            className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider bg-orange-500 text-white shadow-xl shadow-orange-200 hover:bg-orange-600 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Chat ngay
          </button>
        </div>
      </div>
    </div>
  );
};