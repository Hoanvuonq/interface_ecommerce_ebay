"use client";

import { SectionLoading } from "@/components";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  RotateCcw, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  Heart
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { useHomepageData } from "../../_hooks/useHomePageData";
import useWishlistStatus from "../../_hooks/useWishlistStatus";
import Image from "next/image";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";

// Helper lấy ảnh chuẩn từ DTO sản phẩm
const getProductImageUrl = (product: any) => {
  const media = product?.media || [];
  if (Array.isArray(media) && media.length > 0) {
    const image = media.find((m: any) => m.isPrimary && m.type === "IMAGE") || media[0];
    return resolveMediaUrlHelper(image, "_medium");
  }
  const variants = product?.variants || [];
  if (Array.isArray(variants) && variants.length > 0) {
    const withImage = variants.find((v: any) => v?.imageUrl || v?.imageBasePath);
    return resolveVariantImageUrlHelper(withImage, "_medium");
  }
  return "/placeholder.png"; // Ảnh mặc định nếu không tìm thấy
};

const BrandCard = ({ product, isWishlisted }: { product: any; isWishlisted: boolean }) => {
  const imageUrl = useMemo(() => getProductImageUrl(product), [product]);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col items-center bg-white p-4 rounded-xl border border-amber-50 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 transition-all cursor-pointer group h-full relative"
    >
      <div className="absolute top-3 right-3 z-10">
        <Heart 
          size={16} 
          className={cn(
            "transition-colors", 
            isWishlisted ? "fill-red-500 text-red-500" : "text-amber-600"
          )} 
        />
      </div>

      <div className="relative w-full aspect-square mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain p-1 transition-transform duration-500 group-hover:scale-110"
            unoptimized={imageUrl.startsWith('http') && !imageUrl.includes('localhost')} // Tránh lỗi hostname nếu chưa config config
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">
             No Image
          </div>
        )}
      </div>
      
      <div className="mt-auto flex flex-col items-center w-full">
        <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase mb-2 truncate max-w-full tracking-tighter">
          CaLaTha Store
        </div>
        <p className="text-amber-500 text-[11px] font-bold text-center line-clamp-1 group-hover:text-amber-700 leading-tight">
          {product.comparePrice && product.comparePrice > product.basePrice 
            ? `GIẢM ${Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)}%` 
            : "ƯU ĐÃI MALL"}
        </p>
      </div>
    </motion.div>
  );
};

export const CalathaMallSection = () => {
  const { flashSale, saleProducts, isLoading, isInitialLoading } = useHomepageData("vi");

  const displayProducts = useMemo(() => {
    const rawList = (Array.isArray(flashSale) && flashSale.length > 0) ? flashSale : saleProducts;
    const finalArray = Array.isArray(rawList) ? rawList : (rawList?.content || []);
    return finalArray.slice(0, 7);
  }, [flashSale, saleProducts]);

  const { wishlistMap } = useWishlistStatus(displayProducts);

  if (isLoading || isInitialLoading) return <SectionLoading />;
  if (!displayProducts.length) return null;

  return (
    <section className="bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-amber-100 pb-4 mb-6 gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-extrabold text-amber-600 flex items-center gap-2">
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded text-sm">CALATHA</span>
              MALL
            </h2>
            <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase">
              <div className="flex items-center gap-1.5"><RotateCcw size={14} className="text-amber-500" /> 7 Ngày Trả Hàng</div>
              <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-amber-500" /> 100% Chính Hãng</div>
              <div className="flex items-center gap-1.5"><Truck size={14} className="text-amber-500" /> Miễn Phí Vận Chuyển</div>
            </div>
          </div>
          <Link href="/products" className="group flex items-center gap-1 text-amber-500 text-[11px] font-bold uppercase tracking-wider">
            KHÁM PHÁ NGAY <ChevronRight size={12} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 relative min-h-[380px] rounded-2xl overflow-hidden shadow-lg group"
          >
            <Image
              src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2070" 
              alt="Mall Promotion"
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-transparent to-transparent p-8 flex flex-col justify-end">
              <span className="text-amber-300 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Thương hiệu quốc tế</span>
              <h3 className="text-white text-4xl font-black leading-none mb-6 italic">
                PREMIUM <br /> <span className="text-amber-400">CHOICE.</span>
              </h3>
              <Link href="/products" className="w-fit bg-white text-amber-600 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase shadow-lg hover:bg-amber-50 transition-all active:scale-95">
                Săn Deal Ngay
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayProducts.map((product: any, idx: number) => (
              <motion.div
                key={product.id || idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="h-full"
              >
                <BrandCard 
                  product={product} 
                  isWishlisted={wishlistMap.get(product.variants?.[0]?.id || "") || false}
                />
              </motion.div>
            ))}

            <Link href="/products" className="flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-amber-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all group p-4 h-full">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all mb-2">
                <ArrowRight size={18} />
              </div>
              <span className="text-[10px] font-bold text-amber-500 uppercase">Xem tất cả</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};