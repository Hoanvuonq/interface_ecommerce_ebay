/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Info,
  Package,
  Globe,
  Truck,
  Plane,
  Zap,
  Map,
} from "lucide-react";
import { DataTable, FormInput } from "@/components";
import { VariantData } from "@/app/(shop)/shop/_stores/product.store";
import { cn } from "@/utils/cn";
import { MiniSettingCard } from "../ShippingChannelCard";

interface ProductShippingTabsProps {
  variants: VariantData[];
  optionNames: string[];
  allowedShippingChannels: string[];
  setAllowedShippingChannels: (channels: string[]) => void;
  regions: string[];
  setRegions: (regions: string[]) => void;
  onUpdateVariant: (
    index: number,
    field: keyof VariantData,
    value: any,
  ) => void;
  updateAllVariants: (field: keyof VariantData, value: any) => void;
}

export const ProductShippingTabs: React.FC<ProductShippingTabsProps> = ({
  variants,
  optionNames,
  allowedShippingChannels,
  setAllowedShippingChannels,
  regions,
  setRegions,
  onUpdateVariant,
  updateAllVariants,
}) => {
  const [isIndividual, setIsIndividual] = useState(false);

  // 1. Cấu hình Dữ liệu (Theo yêu cầu của bro)
  const regionOptions = [
    {
      id: "VIETNAM",
      title: "Việt Nam",
      desc: "Bán hàng trong nước",
      icon: <Map size={14} />,
    },
    {
      id: "INTERNATIONAL",
      title: "Quốc tế",
      desc: "Xuyên biên giới",
      icon: <Globe size={14} />,
    },
  ];

  const shippingMethods = [
    { id: "EXPRESS", title: "Hỏa Tốc", price: 22000, icon: <Zap size={14} /> },
    { id: "STANDARD", title: "Nhanh", price: 16500, icon: <Truck size={14} /> },
    {
      id: "INTERNATIONAL_AIR",
      title: "Hàng không Quốc tế",
      price: 85000,
      icon: <Plane size={14} />,
    },
  ];

  // 2. Logic xử lý Toggle đa năng
  const handleToggle = (
    currentList: string[],
    setList: (l: string[]) => void,
    id: string,
  ) => {
    const newList = currentList.includes(id)
      ? currentList.filter((item) => item !== id)
      : [...currentList, id];
    setList(newList);
  };

  // 3. Định nghĩa Table Columns cho phần nhập riêng
  const columns = useMemo(
    () => [
      {
        header: "Phân loại",
        render: (item: VariantData) => (
          <div className="flex flex-wrap gap-1">
            {item.optionValueNames.map((val, i) => (
              <span
                key={i}
                className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-100"
              >
                {val}
              </span>
            ))}
          </div>
        ),
      },
      {
        header: "Cân nặng (g)",
        render: (item: VariantData, index: number) => (
          <FormInput
            type="number"
            value={item.weightGrams}
            onChange={(e) =>
              onUpdateVariant(
                index,
                "weightGrams",
                parseFloat(e.target.value) || 0,
              )
            }
            className="h-9 text-center font-bold"
            containerClassName="space-y-0"
          />
        ),
      },
      {
        header: "Kích thước (D x R x C)",
        render: (item: VariantData, index: number) => (
          <div className="flex items-center gap-1">
            {(["lengthCm", "widthCm", "heightCm"] as const).map((dim) => (
              <FormInput
                key={dim}
                type="number"
                value={item[dim]}
                placeholder={dim[0].toUpperCase()}
                onChange={(e) =>
                  onUpdateVariant(index, dim, parseFloat(e.target.value) || 0)
                }
                className="h-9 w-14 text-center text-[10px] font-bold"
                containerClassName="space-y-0"
              />
            ))}
          </div>
        ),
      },
    ],
    [onUpdateVariant],
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* SECTION 1: CÂN NẶNG & KÍCH THƯỚC */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
                Thông số đóng gói
              </h3>
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest mt-0.5 italic">
                Nhập đúng để tránh bị truy thu phí vận chuyển
              </p>
            </div>
          </div>

          {/* Toggle "Thiết lập cho từng phân loại" */}
          {variants.length > 1 && (
            <div className="flex items-center gap-3 bg-gray-50 p-2 pl-4 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-black uppercase text-gray-400">
                Nhập riêng theo size/màu
              </span>
              <button
                onClick={() => setIsIndividual(!isIndividual)}
                className={cn(
                  "w-10 h-5.5 rounded-full p-0.5 transition-all",
                  isIndividual ? "bg-orange-500" : "bg-gray-200",
                )}
              >
                <div
                  className={cn(
                    "w-4.5 h-4.5 bg-white rounded-full transition-all shadow-sm",
                    isIndividual ? "translate-x-4.5" : "0",
                  )}
                />
              </button>
            </div>
          )}
        </div>

        {!isIndividual ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-orange-50/20 rounded-3xl border border-orange-100/50 border-dashed animate-in zoom-in-95">
            <FormInput
              label="Cân nặng (g)"
              type="number"
              value={variants[0]?.weightGrams || ""}
              onChange={(e) =>
                updateAllVariants(
                  "weightGrams",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="h-11 font-bold"
            />
            <FormInput
              label="Dài (cm)"
              type="number"
              value={variants[0]?.lengthCm || ""}
              onChange={(e) =>
                updateAllVariants("lengthCm", parseFloat(e.target.value) || 0)
              }
              className="h-11 font-bold"
            />
            <FormInput
              label="Rộng (cm)"
              type="number"
              value={variants[0]?.widthCm || ""}
              onChange={(e) =>
                updateAllVariants("widthCm", parseFloat(e.target.value) || 0)
              }
              className="h-11 font-bold"
            />
            <FormInput
              label="Cao (cm)"
              type="number"
              value={variants[0]?.heightCm || ""}
              onChange={(e) =>
                updateAllVariants("heightCm", parseFloat(e.target.value) || 0)
              }
              className="h-11 font-bold"
            />
          </div>
        ) : (
          <DataTable<VariantData>
            data={variants}
            columns={columns}
            loading={false}
            rowKey={(item, index) => item.sku || `v-${index}`}
            page={0}
            size={variants.length}
            totalElements={variants.length}
            onPageChange={() => {}}
          />
        )}
      </div>

      {/* SECTION 2: BỐ CỤC 2 CỘT (KHU VỰC & ĐƠN VỊ VẬN CHUYỂN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột trái: Khu vực */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={18} className="text-blue-500" />
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-tighter">
              Khu vực bán hàng
            </h3>
          </div>
          <div className="space-y-3">
            {regionOptions.map((r) => (
              <MiniSettingCard
                key={r.id}
                title={r.title}
                desc={r.desc}
                icon={r.icon}
                isActive={regions.includes(r.id)}
                onToggle={() => handleToggle(regions, setRegions, r.id)}
              />
            ))}
          </div>
        </div>

        {/* Cột phải: Đơn vị vận chuyển */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Truck size={18} className="text-green-500" />
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-tighter">
              Hình thức giao hàng
            </h3>
          </div>
          <div className="space-y-3">
            {shippingMethods.map((m) => (
              <MiniSettingCard
                key={m.id}
                title={m.title}
                price={m.price}
                icon={m.icon}
                isActive={allowedShippingChannels.includes(m.id)}
                onToggle={() =>
                  handleToggle(
                    allowedShippingChannels,
                    setAllowedShippingChannels,
                    m.id,
                  )
                }
                isPartner
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3 items-center">
        <Info size={16} className="text-amber-600 shrink-0" />
        <p className="text-[10px] text-amber-700 font-bold italic uppercase tracking-tight">
          Cài đặt đơn vị vận chuyển ở đây chỉ áp dụng cho sản phẩm này.
        </p>
      </div>
    </div>
  );
};
