"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { FormInput, CustomButtonActions } from "@/components";
import { QuickReplyModal } from "../../_components/QuickReplyModal";

export const SettingsQuickReply = () => {
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal

  return (
    <>
      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        {/* Header chuẩn Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-5">
            <button className="p-3 hover:bg-orange-50 text-orange-500 rounded-2xl transition-all active:scale-90 border border-orange-100 shadow-sm bg-white">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase leading-none">
                Tin nhắn nhanh
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mt-2">
                Personalized Response Templates
              </p>
            </div>
          </div>

          {/* Nút Tạo tin nhắn mới - Kích hoạt Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Tạo tin nhắn mới
          </button>
        </div>

        {/* Thanh công cụ tìm kiếm & thông báo */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="TÌM KIẾM MẪU TIN NHẮN..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl text-[10px] font-bold tracking-widest outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 shadow-sm transition-all"
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Đã dùng:{" "}
            <span className="text-orange-500 text-sm font-black">01</span> / 25
            nhóm
          </div>
        </div>

        {/* Nhóm tin nhắn chính */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transition-all group/card">
          {/* Header Nhóm */}
          <div className="p-8 flex items-center justify-between gap-6 bg-linear-to-r from-orange-50/30 to-transparent border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100 text-orange-500">
                <MessageSquare size={22} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Nhóm tin nhắn chung
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                  05 mẫu tin nhắn có sẵn
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Toggle Switch Web3 */}
              <button
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "w-16 h-9 rounded-full p-1.5 transition-all duration-500 flex items-center shadow-inner relative",
                  isActive ? "bg-orange-500" : "bg-slate-200",
                )}
              >
                <motion.div
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: isActive ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </button>

              <button
                onClick={() => setIsEditingGroup(!isEditingGroup)}
                className={cn(
                  "p-3 rounded-2xl transition-all active:scale-90 border-2",
                  isEditingGroup
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-orange-200 hover:text-orange-500 hover:bg-white",
                )}
              >
                {isEditingGroup ? (
                  <X size={18} strokeWidth={2.5} />
                ) : (
                  <Pencil size={18} strokeWidth={2.5} />
                )}
              </button>

              <button className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 border border-gray-100 transition-all active:scale-90">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isEditingGroup ? (
              <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 space-y-3"
              >
                <div className="space-y-2">
                  {[
                    "Sản phẩm có sẵn",
                    "Cảm ơn bạn!",
                    "Shop sẽ phản hồi sớm nhất có thể",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-orange-100 hover:bg-white text-xs font-semibold text-slate-600 transition-all cursor-default flex items-center gap-3 group/item"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-200 group-hover/item:bg-orange-500 rounded-full transition-colors" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Edit mode: Chỉnh sửa hàng loạt */
              <motion.div
                key="edit-view"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-visible bg-slate-50/50"
              >
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="grid grid-cols-1 md:grid-cols-[40px_1fr_200px_40px] items-start gap-4 p-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/20 border border-transparent hover:border-orange-200 transition-all group/item"
                      >
                        <div className="mt-4 text-slate-300 cursor-grab active:cursor-grabbing flex justify-center">
                          <GripVertical size={18} />
                        </div>

                        <FormInput
                          isTextArea
                          label={`Nội dung mẫu ${item}`}
                          placeholder="NHẬP NỘI DUNG PHẢN HỒI..."
                          className="rounded-2xl min-h-24 shadow-inner"
                        />

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                            Phím tắt (Tag)
                          </label>
                          <input
                            type="text"
                            placeholder="VÍ DỤ: /CAMON"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black tracking-widest outline-none focus:border-orange-300 transition-all"
                          />
                        </div>

                        <button className="mt-10 p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-orange-300 hover:text-orange-500 hover:bg-white transition-all">
                    + Thêm mẫu tin nhắn mới (Tối đa 20)
                  </button>

                  <CustomButtonActions
                    onCancel={() => setIsEditingGroup(false)}
                    onSubmit={() => console.log("Save groups")}
                    submitText="Cập nhật nhóm"
                    containerClassName="pt-6 border-t-0 justify-end"
                    className="w-48! rounded-[2rem] h-12"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <QuickReplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
