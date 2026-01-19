"use client";

import React, { useState, useMemo } from "react";
import { PortalModal } from "@/features/PortalModal";
import { Checkbox } from "@/components/checkbox";
import { CustomButtonActions } from "@/components";
import { cn } from "@/utils/cn";

const TEMPLATE_DATA: Record<string, any[]> = {
  popular: [
    { id: "p1", content: "Xin chào, Cảm ơn bạn đã quan tâm đến sản phẩm của shop!", tag: "Xin chào!" },
    { id: "p2", content: "Sản phẩm này vẫn còn hàng, bạn có thể mua ngay!", tag: "Có sẵn" },
  ],
  order: [
    { id: "o1", content: "Cảm ơn bạn đã đặt hàng! Shop sẽ nhanh chóng giao hàng đến bạn.", tag: "Xác nhận" },
  ],
  care: [
    { id: "t1", content: "Bạn cung cấp mã đơn hàng để Shop kiểm tra nhé", tag: "Kiểm tra đơn" },
  ],
};
export const TemplateReplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  existingContents,
}: any) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("popular");

  const tabs = [
    { key: "popular", label: "Phổ biến" },
    { key: "order", label: "Đơn hàng" },
    { key: "care", label: "Chăm sóc khách hàng" },
  ];

  const currentTemplates = useMemo(() => {
    return TEMPLATE_DATA[activeTab] || [];
  }, [activeTab]);

  // FIX: Cho phép toggle thoải mái
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const allTemplates = Object.values(TEMPLATE_DATA).flat();
    const selectedTemplates = allTemplates.filter((t) =>
      selectedIds.includes(t.id)
    );
    onConfirm(selectedTemplates);
    setSelectedIds([]);
    onClose();
  };

  const footer = (
    <div className="flex justify-between items-center w-full bg-white">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-4">
        Đã chọn: <span className="text-orange-500">{selectedIds.length}</span>/16
      </span>
      <CustomButtonActions
        onCancel={onClose}
        onSubmit={handleConfirm}
        submitText="Xác nhận thêm"
        isDisabled={selectedIds.length === 0}
        className="w-44! rounded-2xl h-11 shadow-xl shadow-orange-500/20"
        containerClassName="border-t-0 bg-transparent py-4 px-6"
      />
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-3xl"
      footer={footer}
      title={<span className="text-slate-800 font-bold uppercase italic">Thêm từ mẫu có sẵn</span>}
    >
      <div className="space-y-5">
        <div className="flex border-b border-slate-100 gap-8 px-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "pb-3 text-[13px] font-bold uppercase tracking-tight transition-all border-b-2 relative whitespace-nowrap",
                activeTab === tab.key ? "text-orange-500 border-orange-500" : "text-slate-400 border-transparent hover:text-slate-600"
              )}
            >
              {tab.label}
              {activeTab === tab.key && <div className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-orange-500 shadow-[0_2px_8px_rgba(249,115,22,0.4)]" />}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-100 overflow-hidden bg-slate-50/30">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
            {currentTemplates.map((item) => {
              const isAdded = existingContents.includes(item.content);
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)} // Click thoải mái
                  className={cn(
                    "p-5 border-b border-slate-50 flex items-start gap-5 cursor-pointer transition-all",
                    // Chỉ làm mờ nhẹ để biết đã có, nhưng vẫn cho chọn
                    isSelected ? "bg-orange-50/30" : "hover:bg-slate-50/50"
                  )}
                >
                  <div className="mt-1 shrink-0">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}} // Checkbox follow state isSelected
                    />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-[13px] font-medium italic transition-colors",
                        isAdded ? "text-orange-500/70" : "text-slate-700"
                      )}>
                        "{item.content}"
                      </p>
                      {isAdded && (
                        <span className="text-[9px] font-bold text-orange-400 border border-orange-200 px-1.5 py-0.5 rounded uppercase">
                          Đã thêm
                        </span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200 uppercase tracking-widest">
                      {item.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalModal>
  );
};