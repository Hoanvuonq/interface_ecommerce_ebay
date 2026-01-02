"use client";

import { SectionSreen } from "@/features/SectionSreen";
import { SectionLoading } from "@/components";
import { cn } from "@/utils/cn";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useHomepageData } from "../../_hooks/useHomePageData";
import useWishlistStatus from "../../_hooks/useWishlistStatus";

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
  return "/placeholder.png";
};

const BrandCard = ({ product, isWishlisted }: { product: any; isWishlisted: boolean }) => {
  const imageUrl = useMemo(() => getProductImageUrl(product), [product]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer group h-full relative"
    >
      <div className="absolute top-2 right-2 z-10">
        <Heart
          size={14}
          className={cn("transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-slate-300 group-hover:text-orange-400")}
        />
      </div>

      <div className="relative w-full aspect-square mb-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product"}
            fill
            sizes="(max-width: 768px) 40vw, 15vw"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-300 uppercase">No Image</div>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center w-full space-y-1">
        <div className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest truncate max-w-full">
          MALL
        </div>
        <p className="text-slate-900 dark:text-white text-[10px] font-bold text-center line-clamp-1 leading-tight uppercase tracking-tighter">
          {product.comparePrice && product.comparePrice > product.basePrice
            ? `Giảm ${Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)}%`
            : "Giá Ưu Đãi"}
        </p>
      </div>
    </motion.div>
  );
};

export const CalathaMallSection = () => {
  const { flashSale, saleProducts, isLoading, isInitialLoading } = useHomepageData("vi");

  const displayProducts = useMemo(() => {
    const rawList = Array.isArray(flashSale) && flashSale.length > 0 ? flashSale : saleProducts;
    const finalArray = Array.isArray(rawList) ? rawList : rawList?.content || [];
    return finalArray.slice(0, 7);
  }, [flashSale, saleProducts]);

  const { wishlistMap } = useWishlistStatus(displayProducts);

  if (isLoading || isInitialLoading) return <SectionLoading />;
  if (!displayProducts.length) return null;

  return (
    <SectionSreen id="calatha-mall" animation="slideUp">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tighter">
            <span className="bg-orange-600 dark:bg-orange-500 text-white px-2 py-0.5 rounded-lg italic">MALL</span>
            CALATHA
          </h2>
          <div className="hidden xl:flex items-center gap-6 text-[9px] font-bold text-slate-400 uppercase">
            <span className="flex items-center gap-1.5 text-slate-600"><RotateCcw size={14} className="text-(--color-mainColor)" /> 7 Ngày Trả Hàng</span>
            <span className="flex items-center gap-1.5 text-slate-600"><ShieldCheck size={14} className="text-(--color-mainColor)" /> 100% Chính Hãng</span>
            <span className="flex items-center gap-1.5 text-slate-600"><Truck size={14} className="text-(--color-mainColor)" /> Miễn Phí Vận Chuyển</span>
          </div>
        </div>
        <Link href="/products" className="group flex items-center gap-1 text-(--color-mainColor) text-[10px] font-bold uppercase hover:opacity-80 transition-all">
          XEM TẤT CẢ <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-4 relative h-50 lg:h-auto min-h-full rounded-4xl overflow-hidden shadow-2xl group"
        >
          <Image
            src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2070"
            alt="Mall Promotion"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent p-6 sm:p-8 flex flex-col justify-end">
            <span className="text-(--color-mainColor) text-[9px] font-bold tracking-[0.3em] uppercase mb-1">Authentic 100%</span>
            <h3 className="text-white text-3xl sm:text-4xl font-bold leading-[0.9] mb-4 tracking-tighter">PREMIUM<br/><span className="text-slate-300/50">STORE.</span></h3>
            <Link href="/products" className="w-fit bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold text-[9px] uppercase hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-xl">
              SĂN DEAL NGAY
            </Link>
          </div>
        </motion.div>

        <div className="lg:col-span-8 overflow-x-auto scrollbar-none snap-x snap-mandatory flex lg:grid lg:grid-cols-4 gap-3 pb-4 lg:pb-0">
          {displayProducts.map((product: any, idx: number) => (
            <div key={product.id || idx} className="min-w-37.5 sm:min-w-45 lg:min-w-0 snap-start shrink-0 lg:shrink">
              <BrandCard
                product={product}
                isWishlisted={wishlistMap.get(product.variants?.[0]?.id || "") || false}
              />
            </div>
          ))}

          <Link
            href="/products"
            className="min-w-30 lg:min-w-0 snap-start shrink-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all group p-4 h-full"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-(--color-mainColor) group-hover:bg-orange-600 group-hover:text-white transition-all mb-2">
              <ArrowRight size={18} />
            </div>
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-(--color-mainColor) uppercase tracking-widest text-center">
              Khám phá<br/>thêm
            </span>
          </Link>
        </div>
      </div>
    </SectionSreen>
  );
};