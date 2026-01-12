"use client";

import React from "react";
import { useProductStore } from "../../../_store/product.store";
import { useProductForm } from "../../../_context/ProductFormContext";

export const ProductBasicInfo = () => {
  const { 
    name, categoryPath, active, 
    setBasicInfo 
  } = useProductStore();

  const { setCategoryModalOpen } = useProductForm();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
          Thông tin cơ bản
        </h3>

        {/* Tên sản phẩm */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setBasicInfo("name", e.target.value)}
            placeholder="Nhập tên sản phẩm..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Ngành hàng <span className="text-red-500">*</span>
          </label>
          <div 
            onClick={() => setCategoryModalOpen(true)}
            className="group relative cursor-pointer"
          >
            <input
              type="text"
              readOnly
              value={categoryPath}
              placeholder="Chọn ngành hàng..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium cursor-pointer group-hover:border-blue-400 transition-all text-sm focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500">
              ✏️
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">Trạng thái:</label>
          <button
            onClick={() => setBasicInfo("active", !active)}
            className={`
              relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out focus:outline-none
              ${active ? "bg-blue-600" : "bg-gray-300"}
            `}
          >
            <span
              className={`
                absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out
                ${active ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
          <span className={`text-sm font-medium ${active ? "text-blue-600" : "text-gray-500"}`}>
            {active ? "Đang hoạt động" : "Tạm dừng"}
          </span>
        </div>

      </div>
    </div>
  );
};