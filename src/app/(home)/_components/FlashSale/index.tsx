"use client";

import { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { publicProductService } from "@/services/products/product.service";
import { useWishlist } from "@/hooks/useWishlist";
import { isAuthenticated } from "@/utils/local.storage";
import { Flame } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/app/products/_components";
import CountdownTimer from "@/features/CountdownTimer";
import { CustomButton, CustomSpinner } from "@/components";
import { CustomProgressBar } from "@/components/CustomProgressBar";
import { toast } from "sonner";
import ScrollReveal from "@/features/ScrollReveal";
import { SectionLoading } from "@/components";
const FlashSaleSection: React.FC = () => {
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMap, setWishlistMap] = useState<Map<string, boolean>>(
    new Map()
  );
  const { checkVariantsInWishlist } = useWishlist();
  const hasInitialFetchedRef = useRef(false);

  const [flashSaleEnd] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });

  useEffect(() => {
    if (hasInitialFetchedRef.current) return;
    hasInitialFetchedRef.current = true;

    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        const response = await publicProductService.getSale(0, 6);
        const productsList = (response.data?.content ||
          []) as PublicProductListItemDTO[];
        setProducts(productsList);

        if (isAuthenticated() && productsList.length > 0) {
          const variantIds: string[] = [];
          productsList.forEach((product: any) => {
            if (product.variants?.[0]?.id) {
              variantIds.push(product.variants[0].id);
            }
          });

          if (variantIds.length > 0) {
            const wishlistStatusMap = await checkVariantsInWishlist(variantIds);
            setWishlistMap(wishlistStatusMap);
          }
        }
      } catch (error) {
        console.error("Error fetching flash sale products:", error);
        toast.error("Không thể tải sản phẩm flash sale");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, [checkVariantsInWishlist]);

  const getSoldPercentage = (id: string) => {
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 60) + 20;
  };

  if (loading) {
    return <SectionLoading message="Đang tải Flash Sale..." />;
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-linear-to-br from-(--color-gradient-1) via-white to-(--color-gradient-2) relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
      <ScrollReveal animation="fadeIn" delay={200}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <Flame className="w-12 h-12 text-yellow-500 animate-bounce" />
                <div className="absolute inset-0 blur-xl bg-yellow-400/50 animate-pulse" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-(--color-primary) mb-3 drop-shadow-lg tracking-tight">
              ⚡ FLASH SALE ⚡
            </h2>
            <p className="text-gray-700 text-base sm:text-lg mb-6 font-semibold italic">
              Giảm giá cực sốc - Số lượng có hạn
            </p>

            <div className="flex justify-center">
              <div className="backdrop-blur-md rounded-2xl px-8 py-5 border border-white shadow-xl">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3">
                  Kết thúc sau
                </p>
                <CountdownTimer
                  endTime={flashSaleEnd}
                  size="large"
                  theme="light"
                //   showLabels={true}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product: any) => {
              const firstVariantId = product.variants?.[0]?.id || null;
              const isWishlisted = firstVariantId
                ? wishlistMap.get(firstVariantId) || false
                : false;
              const soldPercentage = getSoldPercentage(product.id);

              return (
                <div key={product.id} className="flex flex-col group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 border border-gray-100">
                    <div className="relative">
                      <ProductCard
                        product={product}
                        isWishlisted={isWishlisted}
                      />

                      {soldPercentage > 60 && (
                        <div className="absolute top-2 left-2 z-20 bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 uppercase italic">
                          <Flame className="w-3 h-3 fill-current" />
                          Sắp hết
                        </div>
                      )}
                    </div>

                    <div className="px-3 pb-4 pt-2">
                      <div className="flex justify-between items-center mb-1.5 px-0.5">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">
                          Đã bán {soldPercentage}%
                        </span>
                        <span className="text-[10px] text-red-500 font-bold italic">
                          Còn {100 - soldPercentage}%
                        </span>
                      </div>

                      <CustomProgressBar
                        percent={soldPercentage}
                        color="bg-linear-to-r from-orange-500 to-red-600"
                        className="h-2 rounded-full shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/products?filter=sale">
              <CustomButton
                type="primary"
                className="h-12! cursor-pointer m-auto w-60! rounded-full!"
              >
                Xem tất cả ưu đãi <span className="text-xl">→</span>
              </CustomButton>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FlashSaleSection;
