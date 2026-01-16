"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import { SectionLoading } from "@/components";
import { SectionSreen } from "@/features/SectionSreen";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { ArrowRight, Flame, Plus, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useInfiniteProducts } from "../../_hooks/useHomePageData";
import { useHomepageContext } from "../../_context/HomepageContext";

export const ProductShowcase = ({
  title = "GỢI Ý HÔM NAY",
  subtitle = "Dành riêng cho bạn",
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "new">("all");
  const saleQuery = useInfiniteProducts("sale");
  const newQuery = useInfiniteProducts("new");

  const saleList = useMemo(
    () => saleQuery.data?.pages.flatMap((p) => p.data.content) || [],
    [saleQuery.data]
  );
  const newList = useMemo(
    () => newQuery.data?.pages.flatMap((p) => p.data.content) || [],
    [newQuery.data]
  );

  const displayProducts = useMemo(() => {
    let list = [];
    if (activeTab === "sale") list = saleList;
    else if (activeTab === "new") list = newList;
    else list = _.compact(_.flatten(_.zip(saleList, newList)));

    return _.take(list, 11); 
  }, [activeTab, saleList, newList]);

  const { wishlistMap } = useHomepageContext(); // Lấy từ context

  const tabConfigs = [
    { id: "all", label: "Gợi ý", icon: Star },
    { id: "sale", label: "Giảm giá", icon: Flame },
    { id: "new", label: "Mới nhất", icon: Sparkles },
  ] as const;

  if (saleQuery.isLoading || newQuery.isLoading) return <SectionLoading />;

  return (
    <SectionSreen id="calatha-mall" animation="slideUp">
      <div className="flex flex-col items-center text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
          {title}
        </h2>
        <p className="text-white/80 font-medium tracking-widest text-[11px] uppercase">
          {subtitle}
        </p>
        <div className="w-8 h-1 bg-red-500/80 rounded-full mt-1" />
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-gray-50 border border-gray-200/60 rounded-full relative">
          {tabConfigs.map((tab) => {
            const IsActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-5 py-1.5 rounded-full text-[11px] font-bold uppercase transition-all duration-300 z-10",
                  IsActive
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-600"
                )}
              >
                {IsActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-red-500 rounded-full shadow-sm"
                    transition={{
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.5,
                    }}
                  />
                )}
                <tab.icon size={13} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        <AnimatePresence mode="popLayout">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={`${activeTab}-${product.id}-${idx}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard
                product={product}
                isWishlisted={
                  wishlistMap.get(product.variants?.[0]?.id || "") || false
                }
              />
            </motion.div>
          ))}

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <Link
              href="/products"
              className="group h-full flex flex-col items-center justify-center p-6 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                <ArrowRight size={20} />
              </div>
              <span className="mt-4 text-[12px] font-bold uppercase  text-red-500 group-hover:text-red-600">
                Xem tất cả
              </span>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-gray-600 font-medium">
                <Plus size={10} />
                <span>Hơn 1000+ sản phẩm</span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionSreen>
  );
};