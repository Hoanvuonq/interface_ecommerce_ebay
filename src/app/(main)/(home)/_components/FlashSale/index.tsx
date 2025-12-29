"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import { ButtonField, SectionLoading } from "@/components";
import { CustomProgressBar } from "@/components/CustomProgressBar";
import ScrollReveal from "@/features/ScrollReveal";
import { useToast } from "@/hooks/useToast";
import { useWishlist } from "@/app/(main)/wishlist/_hooks/useWishlist";
import { publicProductService } from "@/services/products/product.service";
import { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { isAuthenticated } from "@/utils/local.storage";
import { Flame } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { CountdownFlashSale } from "../CountdownFlashSale";

export const FlashSaleSection: React.FC = () => {
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();
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
  const calculateDiscount = (price: number, salePrice: number) => {
    if (!price || !salePrice || price <= salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

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
      } catch (errorDetail) {
        error("Không thể tải sản phẩm flash sale");
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
      <section className="py-6 bg-linear-to-br from-(--color-gradient-1) via-white to-(--color-gradient-2) relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
        <ScrollReveal animation="fadeIn" delay={200}>
          <div className="max-w-328 mx-auto px-4 sm:px-6 relative z-10">
            <CountdownFlashSale />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-6">
              {products.map((product: any) => {
                const firstVariant = product.variants?.[0] || {};
                const discount = calculateDiscount(
                  firstVariant.price,
                  firstVariant.salePrice
                );
                const isWishlisted = firstVariant.id
                  ? wishlistMap.get(firstVariant.id) || false
                  : false;
                const soldPercentage = getSoldPercentage(product.id);

                return (
                  <div key={product.id} className="flex flex-col group">
                    <div className={cn(
                      "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all",
                      "duration-300 transform group-hover:-translate-y-1 border border-gray-100"
                    )}>
                      <div className="relative">
                        {discount > 0 && (
                          <div className="absolute top-0 right-0 z-30 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-bl-2xl shadow-md animate-pulse">
                            -{discount}%
                          </div>
                        )}
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

            <div className="text-center w-full all-center mt-10">
              <Link href="/products?filter=sale">
                <ButtonField
                  form="profile-form"
                  htmlType="submit"
                  type="login"
                  className="flex w-60 items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
                >
                  <span className="flex items-center gap-2">
                    Xem tất cả ưu đãi <span className="text-xl">→</span>
                  </span>
                </ButtonField>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
  );
};
