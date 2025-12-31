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
    const image =
      media.find((m: any) => m.isPrimary && m.type === "IMAGE") || media[0];
    return resolveMediaUrlHelper(image, "_medium");
  }
  const variants = product?.variants || [];
  if (Array.isArray(variants) && variants.length > 0) {
    const withImage = variants.find(
      (v: any) => v?.imageUrl || v?.imageBasePath
    );
    return resolveVariantImageUrlHelper(withImage, "_medium");
  }
  return "/placeholder.png";
};

const BrandCard = ({
  product,
  isWishlisted,
}: {
  product: any;
  isWishlisted: boolean;
}) => {
  const imageUrl = useMemo(() => getProductImageUrl(product), [product]);

  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="flex flex-col items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer group h-full relative"
    >
      <div className="absolute top-3 right-3 z-10">
        <Heart
          size={16}
          className={cn(
            "transition-colors",
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-slate-300 dark:text-slate-600 group-hover:text-orange-400"
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
            className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
            unoptimized={
              imageUrl.startsWith("http") && !imageUrl.includes("localhost")
            }
          />
        ) : (
          <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-300">
            No Image
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center w-full">
        <div className="bg-slate-100 dark:bg-slate-800 text-orange-400 dark:text-slate-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase mb-2 truncate max-w-full tracking-tighter">
          CaLaTha Store
        </div>
        <p className="text-orange-600 dark:text-orange-400 text-[11px] font-bold text-center line-clamp-1 leading-tight uppercase">
          {product.comparePrice && product.comparePrice > product.basePrice
            ? `Giảm ${Math.round(
                ((product.comparePrice - product.basePrice) /
                  product.comparePrice) *
                  100
              )}%`
            : "Ưu đãi Mall"}
        </p>
      </div>
    </motion.div>
  );
};

export const CalathaMallSection = () => {
  const { flashSale, saleProducts, isLoading, isInitialLoading } =
    useHomepageData("vi");

  const displayProducts = useMemo(() => {
    const rawList =
      Array.isArray(flashSale) && flashSale.length > 0
        ? flashSale
        : saleProducts;
    const finalArray = Array.isArray(rawList)
      ? rawList
      : rawList?.content || [];
    return finalArray.slice(0, 7);
  }, [flashSale, saleProducts]);

  const { wishlistMap } = useWishlistStatus(displayProducts);

  if (isLoading || isInitialLoading) return <SectionLoading />;
  if (!displayProducts.length) return null;

  return (
    <SectionSreen id="calatha-mall" animation="slideUp" >
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="bg-orange-600 dark:bg-orange-500 text-white px-2 py-0.5 rounded-lg text-md tracking-tighter">
              CALATHA
            </span>
            MALL
          </h2>
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase">
            <div className="flex items-center gap-1.5">
              <RotateCcw
                size={14}
                className="text-orange-600 dark:text-orange-500"
              />
              7 Ngày Trả Hàng
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                size={14}
                className="text-orange-600 dark:text-orange-500"
              />
              100% Chính Hãng
            </div>
            <div className="flex items-center gap-1.5">
              <Truck
                size={14}
                className="text-orange-600 dark:text-orange-500"
              />
              Miễn Phí Vận Chuyển
            </div>
          </div>
        </div>
        <Link
          href="/products"
          className="group flex items-center gap-1 text-slate-600 text-[11px] font-bold uppercase tracking-wider hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          KHÁM PHÁ NGAY
          <ChevronRight
            size={12}
            strokeWidth={3}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          className="lg:col-span-4 relative min-h-95 rounded-2xl overflow-hidden shadow-md group"
        >
          <Image
            src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2070"
            alt="Mall Promotion"
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
            <span className="text-orange-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
              Thương hiệu quốc tế
            </span>
            <h3 className="text-white text-4xl font-bold leading-none mb-6">
              PREMIUM
              <br />
              <span className="text-slate-300">CHOICE.</span>
            </h3>
            <Link
              href="/products"
              className="w-fit bg-orange-600 dark:bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              Săn Deal Ngay
            </Link>
          </div>
        </motion.div>

        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayProducts.map((product: any, idx: number) => (
            <motion.div
              key={product.id || idx}
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: idx * 0.04,
              }}
              className="h-full"
            >
              <BrandCard
                product={product}
                isWishlisted={
                  wishlistMap.get(product.variants?.[0]?.id || "") || false
                }
              />
            </motion.div>
          ))}

          <Link
            href="/products"
            className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 transition-all group p-4 h-full"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:bg-orange-600 dark:group-hover:bg-orange-500 group-hover:text-white transition-all mb-2">
              <ArrowRight size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-500 uppercase">
              Xem tất cả
            </span>
          </Link>
        </div>
      </div>
    </SectionSreen>
  );
};
