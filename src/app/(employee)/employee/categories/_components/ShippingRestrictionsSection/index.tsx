/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Map } from "lucide-react";
import { cn } from "@/utils/cn";
import { SectionHeader, SelectComponent, FormInput } from "@/components";
import { COUNTRIES, REGIONS } from "@/app/manager/_constants/category";
import { ShippingRestrictionsDTO } from "@/types/categories/category.detail";

interface ShippingRestrictionsSectionProps {
  value?: ShippingRestrictionsDTO;
  onChange: (value: ShippingRestrictionsDTO) => void;
  loading?: boolean;
  errors?: any;
}

export const ShippingRestrictionsSection: React.FC<
  ShippingRestrictionsSectionProps
> = ({ value, onChange, loading, errors }) => {
  const updateField = (updates: Partial<ShippingRestrictionsDTO>) => {
    onChange({ ...value!, ...updates });
  };

  const restrictionType = value?.restrictionType || "NONE";

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] p-6 border border-blue-200">
      <SectionHeader icon={Map} title="Giới hạn giao hàng" />

      <div className="bg-white rounded-4xl p-6 border border-blue-100 space-y-6 shadow-sm">
        <div
          className={cn(
            "grid gap-6 transition-all duration-500",
            restrictionType === "COUNTRIES"
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1",
          )}
        >
          {/* Loại giới hạn */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-2 tracking-widest">
              Phạm vi áp dụng
            </label>
            <SelectComponent
              options={[
                { label: "Không giới hạn (Toàn cầu)", value: "NONE" },
                { label: "Bán kính địa phương (Km)", value: "LOCAL_RADIUS" },
                { label: "Theo quốc gia", value: "COUNTRIES" },
                { label: "Theo khu vực", value: "REGIONS" },
              ]}
              value={restrictionType}
              onChange={(val: any) => {
                const newType =
                  val as ShippingRestrictionsDTO["restrictionType"];
                onChange({
                  restrictionType: newType,
                  countryRestrictionType: "ALLOW_ONLY",
                  restrictedCountries: [],
                  restrictedRegions: [],
                  maxShippingRadiusKm: undefined,
                });
              }}
              disabled={loading}
            />
          </div>

          {restrictionType === "COUNTRIES" && (
            <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
              <SelectComponent
                label="Chế độ giới hạn"
                options={[
                  { label: "Chỉ cho phép (Whitelist)", value: "ALLOW_ONLY" },
                  { label: "Chặn danh sách (Blacklist)", value: "DENY_ONLY" },
                ]}
                value={value?.countryRestrictionType || "ALLOW_ONLY"}
                onChange={(val: any) =>
                  updateField({ countryRestrictionType: val })
                }
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {restrictionType === "LOCAL_RADIUS" && (
            <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in zoom-in-95 duration-300">
              <FormInput
                label="Bán kính tối đa (km)"
                type="number"
                required
                min={1}
                value={value?.maxShippingRadiusKm?.toString() || ""}
                onChange={(e) =>
                  updateField({
                    maxShippingRadiusKm: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Ví dụ: 50"
              />
              <p className="text-[10px] text-blue-400 font-bold uppercase mt-3 ml-2 italic opacity-70">
                * Áp dụng tính từ vị trí kho hàng của shop
              </p>
            </div>
          )}

          {/* Danh sách Quốc gia */}
          {restrictionType === "COUNTRIES" && (
            <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in fade-in duration-500 space-y-3">
              <SelectComponent
                isMulti
                label=" Chọn danh sách quốc gia"
                placeholder="Tìm quốc gia..."
                options={COUNTRIES}
                value={value?.restrictedCountries || []}
                onChange={(vals: any) =>
                  updateField({ restrictedCountries: vals })
                }
                disabled={loading}
                error={errors?.restrictedCountries}
              />
            </div>
          )}

          {/* Danh sách Khu vực */}
          {restrictionType === "REGIONS" && (
            <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in fade-in duration-500 space-y-3">
              <SelectComponent
                isMulti
                label=" Chọn danh sách khu vực"
                placeholder="Tìm khu vực..."
                options={REGIONS}
                value={value?.restrictedRegions || []}
                onChange={(vals: any) =>
                  updateField({ restrictedRegions: vals })
                }
                disabled={loading}
                error={errors?.restrictedRegions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
