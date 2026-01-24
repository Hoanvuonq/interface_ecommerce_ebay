"use client";

import { SectionLoading } from "@/components";
import { SectionSreen } from "@/features/SectionSreen";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useHomepageContext } from "../../_context/HomepageContext";
import { BrandCard } from "../BranCard";

export const CalathaMallSection = () => {
  const { flashSale, saleProducts, isLoading, isInitialLoading, wishlistMap } =
    useHomepageContext();

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

  if (isLoading || isInitialLoading) return <SectionLoading />;
  if (!displayProducts.length) return null;

  return (
    <SectionSreen id="calatha-mall" animation="slideUp">
      <div className="flex flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              Official Store
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter flex items-baseline gap-2">
            CanoX <span className="italic font-bold text-yellow-400">MALL</span>
          </h2>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6">
            {[
              { icon: <RotateCcw size={18} />, text: "7 Ngày Trả Hàng" },
              { icon: <ShieldCheck size={18} />, text: "100% Chính Hãng" },
              { icon: <Truck size={18} />, text: "Giao Hỏa Tốc" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-wider italic"
              >
                <span className="text-yellow-500">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-[11px] font-bold uppercase hover:bg-white hover:text-black transition-all"
          >
            Xem Tất Cả
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 relative group min-h-100 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2070"
            alt="Mall Promotion"
            fill
            className="object-cover transition-transform duration-2000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
            <h3 className="text-white text-5xl font-bold leading-none mb-4 tracking-tighter italic">
              PREMIUM
              <br />
              <span className="text-yellow-500 underline decoration-4 underline-offset-8">
                EXPERIENCE.
              </span>
            </h3>
            <p className="text-white/80 text-xs font-medium mb-6 max-w-50 leading-relaxed">
              Trải nghiệm mua sắm đẳng cấp với các thương hiệu quốc tế ưu đãi
              độc quyền.
            </p>
            <Link
              href="/products"
              className="w-fit bg-yellow-600 text-white px-8 py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 shadow-2xl shadow-yellow-600/20"
            >
              MUA NGAY
            </Link>
          </div>
        </motion.div>

        <div className="lg:col-span-8 overflow-x-auto scrollbar-none snap-x snap-mandatory flex lg:grid lg:grid-cols-4 gap-4 pb-4">
          {displayProducts.map((product: any, idx: number) => (
            <div
              key={product.id || idx}
              className="min-w-45 sm:min-w-55 lg:min-w-0 snap-start shrink-0"
            >
              <BrandCard
                product={product}
                isWishlisted={
                  wishlistMap.get(product.variants?.[0]?.id || "") || false
                }
              />
            </div>
          ))}

          <Link
            href="/products"
            className="min-w-45 h-auto min-h-80 lg:min-w-0 snap-start shrink-0 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-4xl hover:bg-white/10 transition-all group p-6"
          >
            <div className="w-14 h-14 rounded-3xl bg-yellow-600 shadow-lg shadow-yellow-500/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 mb-4">
              <ArrowRight size={24} />
            </div>
            <span className="text-[11px] font-bold text-white/80 uppercase  text-center italic">
              Khám phá
              <br />
              thế giới mall
            </span>
          </Link>
        </div>
      </div>
    </SectionSreen>
  );
};
