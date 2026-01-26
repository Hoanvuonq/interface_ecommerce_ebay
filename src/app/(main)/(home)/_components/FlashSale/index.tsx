"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import { ButtonField, SectionLoading } from "@/components";
import { CustomProgressBar } from "@/components/custom/components/customProgressBar";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/utils/cn";
import { CountdownFlashSale } from "../CountdownFlashSale";
import { useHomepageContext } from "../../_context/HomepageContext";
import { SectionSreen } from "@/features/SectionSreen";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export const FlashSaleSection: React.FC = () => {
  const {
    flashSale,
    isLoading: contextLoading,
    wishlistMap,
  } = useHomepageContext();

  const calculateDiscount = (price: number, salePrice: number) => {
    if (!price || !salePrice || price <= salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  const getSoldPercentage = (id: string) => {
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 60) + 20;
  };

  if (contextLoading && flashSale.length === 0) {
    return <SectionLoading message="Đang tải Flash Sale..." />;
  }

  if (flashSale.length === 0) return null;

  return (
    <SectionSreen id="flash-sale" animation="slideUp">
      <CountdownFlashSale />

      <div className="relative pt-3 group/carousel">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={{
            nextEl: ".flashsale-next",
            prevEl: ".flashsale-prev",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="pb-4"
        >
          {flashSale.map((product: any) => {
            const firstVariant = product.variants?.[0] || {};
            const discount = calculateDiscount(
              firstVariant.price,
              firstVariant.salePrice,
            );
            const isWishlisted = wishlistMap.get(firstVariant.id) || false;
            const soldPercentage = getSoldPercentage(product.id);

            return (
              <SwiperSlide key={product.id}>
                <div className="flex flex-col group h-full">
                  <div
                    className={cn(
                      "bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full",
                      "duration-300 border border-gray-100 flex flex-col",
                    )}
                  >
                    <div className="relative">
                      {discount > 0 && (
                        <div className="absolute top-0 right-0 z-30 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-2xl shadow-md">
                          -{discount}%
                        </div>
                      )}

                      <ProductCard
                        product={product}
                        isWishlisted={isWishlisted}
                        isType="flashsale"
                      />

                      {soldPercentage > 60 && (
                        <div className="absolute top-2 left-2 z-20 bg-orange-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 uppercase italic">
                          <Flame className="w-3 h-3 fill-current" />
                          Sắp hết
                        </div>
                      )}
                    </div>

                    <div className="px-3 pb-4 pt-2 mt-auto flex flex-col gap-2">
                      <CustomProgressBar
                        percent={soldPercentage}
                        color="bg-gradient-to-r from-orange-500 to-red-600"
                        className="h-2 rounded-full shadow-inner"
                      />
                      <div className="flex justify-between items-center px-0.5">
                        <span className="text-[9px] text-gray-500 font-bold uppercase">
                          Đã bán {soldPercentage}%
                        </span>
                        <span className="text-[9px] text-red-500 font-bold italic">
                          Còn {100 - soldPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button className="flashsale-prev absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:bg-orange-500 hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="flashsale-next absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:bg-orange-500 hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/products?filter=sale">
          <ButtonField
            type="login"
            className="flex w-60 items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
          >
            Xem tất cả ưu đãi <span className="text-xl">→</span>
          </ButtonField>
        </Link>
      </div>
    </SectionSreen>
  );
};
