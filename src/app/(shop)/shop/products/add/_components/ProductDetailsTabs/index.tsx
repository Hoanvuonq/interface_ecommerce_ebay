"use client";
import React, { useState } from "react";
import { Sparkles, Info } from "lucide-react";
import { SelectComponent } from "@/components/SelectComponent";

export const ProductDetailsTabs: React.FC = () => {
  // 1. Tạo State để quản lý dữ liệu được chọn
  const [details, setDetails] = useState({
    brand: "",
    gender: "",
    origin: "",
    isCustom: "",
    orgName: "",
    orgAddress: "",
  });

  // Hàm update state tiện lợi
  const updateDetail = (key: string, value: any) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const brands = [
    { label: "AKUBA", value: "akuba" },
    { label: "Nike", value: "nike" },
    { label: "Adidas", value: "adidas" },
  ];

  const genders = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Unisex", value: "unisex" },
  ];

  const origins = [
    { label: "Việt Nam", value: "vn" },
    { label: "Trung Quốc", value: "cn" },
    { label: "Mỹ", value: "us" },
  ];

  const requestOptions = [
    { label: "Đúng", value: "true" },
    { label: "Sai", value: "false" },
  ];

  return (
    <div className="bg-white rounded-4xl p-8 shadow-sm border border-gray-100/50 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-orange-100 rounded-2xl animate-pulse">
          <Sparkles className="w-6 h-6 text-orange-600" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Thông tin chi tiết
          </h3>
          <p className="text-xs font-medium text-gray-500">
            Hoàn thành các thuộc tính để tăng mức độ hiển thị cho sản phẩm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
        {/* Thương hiệu */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-700 ml-1">
            Thương hiệu <span className="text-red-500">*</span>
          </label>
          <SelectComponent
            options={brands}
            value={details.brand} // TRUYỀN VALUE VÀO ĐỂ HIỆN LABEL
            onChange={(v) => updateDetail("brand", v)} // CẬP NHẬT STATE
            placeholder="Chọn thương hiệu"
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-700 ml-1">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <SelectComponent
            options={genders}
            value={details.gender}
            onChange={(v) => updateDetail("gender", v)}
            placeholder="Chọn giới tính"
          />
        </div>

        {/* Xuất xứ */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-700 ml-1">
            Xuất xứ
          </label>
          <SelectComponent
            options={origins}
            value={details.origin}
            onChange={(v) => updateDetail("origin", v)}
            placeholder="Chọn quốc gia"
          />
        </div>

        {/* Đặt theo yêu cầu */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-700 ml-1">
            Sản phẩm đặt theo yêu cầu
          </label>
          <SelectComponent
            options={requestOptions}
            value={details.isCustom}
            onChange={(v) => updateDetail("isCustom", v)}
            placeholder="Chọn trạng thái"
          />
        </div>

        {/* Tên tổ chức */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-700 ml-1">
            Tên tổ chức chịu trách nhiệm
          </label>
          <SelectComponent
            options={[{ label: "Đang cập nhật", value: "updating" }]}
            value={details.orgName}
            onChange={(v) => updateDetail("orgName", v)}
            placeholder="Tìm kiếm tổ chức..."
          />
        </div>

        {/* Địa chỉ tổ chức */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-700 ml-1">
            Địa chỉ tổ chức chịu trách nhiệm
          </label>
          <SelectComponent
            options={[{ label: "Đang cập nhật", value: "updating" }]}
            value={details.orgAddress}
            onChange={(v) => updateDetail("orgAddress", v)}
            placeholder="Tìm kiếm địa chỉ..."
          />
        </div>
      </div>

      <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-3xl flex gap-4 animate-in slide-in-from-bottom-2 duration-700">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-600">
          <Info size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1 pt-0.5">
          <h4 className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">
            Mẹo nhỏ cho người bán
          </h4>
          <p className="text-xs text-orange-900/70 leading-relaxed font-semibold">
            Lưu ý: Bạn nên điền chính xác{" "}
            <span className="text-orange-600 font-bold">Thương hiệu</span> để
            tránh vi phạm chính sách hàng giả. Nếu không có thương hiệu, hãy
            chọn{" "}
            <span className="underline decoration-orange-300 underline-offset-4 text-orange-600 italic">
              No Brand
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
