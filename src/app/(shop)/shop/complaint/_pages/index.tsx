"use client";

import React, { useState } from "react";
import {
  Store,
  FileText,
  ShieldCheck,
  Search,
  Rotate3DIcon,
  Filter,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { FormInput, InputField, SelectComponent } from "@/components";
import { ButtonField } from "@/components";

type TabKey = "preferred" | "intellectual";

export const ComplaintScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("preferred");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const complaintTabs = [
    {
      id: "preferred",
      label: "Khiếu nại danh hiệu Shop Yêu Thích",
      icon: <Store size={16} />,
    },
    {
      id: "intellectual",
      label: "Khiếu nại Quyền Sở Hữu Trí Tuệ",
      icon: <ShieldCheck size={16} />,
    },
  ];

  const subTabs = [
    { label: "Tất cả", count: 0, status: "all" },
    { label: "Đang xem xét", count: 0, status: "pending" },
    {
      label: "Chờ cung cấp thêm bằng chứng",
      count: 0,
      status: "evidence_required",
    },
    { label: "Chấp nhận", count: 0, status: "accepted" },
    { label: "Từ chối", count: 0, status: "rejected" },
  ];
  const typeOptions = [
    { label: "Khiếu nại danh hiệu", value: "preferred" },
    { label: "Khiếu nại sở hữu trí tuệ", value: "intellectual" },
  ];

  const statusOptions = [
    { label: "Đang xem xét", value: "pending" },
    { label: "Chấp nhận", value: "accepted" },
    { label: "Từ chối", value: "rejected" },
    { label: "Chờ bằng chứng", value: "evidence_required" },
  ];

  return (
    <div className="max-w-450 mx-auto space-y-6 animate-in fade-in duration-500 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Khiếu nại</h1>
        <p className="text-sm text-gray-500 italic">
          Theo dõi và quản lý các yêu cầu khiếu nại của Shop bạn.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-6 pt-4">
          <div className="flex gap-8">
            {complaintTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative uppercase tracking-tight",
                  activeTab === tab.id
                    ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-orange-500 after:rounded-full"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50 pb-1">
            {subTabs.map((sub) => (
              <button
                key={sub.status}
                onClick={() => setFilterStatus(sub.status)}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap",
                  filterStatus === sub.status
                    ? "text-orange-600 bg-orange-50 font-bold"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {sub.label} {sub.count > 0 && `(${sub.count})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <FormInput
                placeholder="TTìm kiếm mã khiếu nại"
                className="pl-11 h-11 w-full bg-white border-transparent shadow-sm rounded-2xl focus:bg-white"
              />
            </div>
            <SelectComponent
              placeholder="Loại khiếu nại"
              options={typeOptions}
              value={selectedType}
              onChange={(val) => setSelectedType(val)}
              className="h-12"
            />

            <SelectComponent
              placeholder="Trạng thái"
              options={statusOptions}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              className="h-12"
            />
            <div className="flex gap-2">
              <ButtonField className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl py-2.5 shadow-lg shadow-orange-200 transition-all font-bold uppercase text-xs">
                Áp dụng
              </ButtonField>
              <ButtonField className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl py-2.5 transition-all font-bold uppercase text-xs">
                Đặt lại
              </ButtonField>
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-100">
                    Mã khiếu nại
                  </th>
                  <th className="px-6 py-4 border-b border-gray-100">
                    Loại khiếu nại
                  </th>
                  <th className="px-6 py-4 border-b border-gray-100">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 border-b border-gray-100">
                    Cập nhật
                  </th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State */}
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <FileText size={64} strokeWidth={1} />
                      <p className="text-sm font-medium text-gray-500">
                        Không có dữ liệu khiếu nại nào được tìm thấy.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Box - Dựa theo style image_b7830a */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex gap-4 animate-in slide-in-from-bottom duration-700">
        <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 shrink-0 self-start">
          <Info size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
            Hướng dẫn khiếu nại
          </h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Bạn có thể thực hiện khiếu nại nếu Shop bị gỡ danh hiệu không đúng
            quy định hoặc phát hiện vi phạm quyền sở hữu trí tuệ từ các Shop
            khác. Thời gian xử lý trung bình từ 3-5 ngày làm việc.
          </p>
        </div>
      </div>
    </div>
  );
};
