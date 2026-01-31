/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, DateTimeInput, CustomButtonActions } from "@/components";
import {
  Clock,
  Timer,
  Plus,
  Trash2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { differenceInMinutes, format } from "date-fns";
import { cn } from "@/utils/cn";

interface CreateCampaignSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any[]) => Promise<void>;
  isProcessing: boolean;
}

export const CreateCampaignSlotsModal: React.FC<
  CreateCampaignSlotsModalProps
> = ({ isOpen, onClose, onSave, isProcessing }) => {
  // State quản lý danh sách các slot sẽ tạo
  const [slotList, setSlotList] = useState<any[]>([]);

  // State cho slot đang nhập dở
  const [currentSlot, setCurrentSlot] = useState({
    slotName: "",
    startTime: "",
    endTime: "",
    maxProducts: 10,
  });

  const duration = useMemo(() => {
    if (!currentSlot.startTime || !currentSlot.endTime) return 0;
    return differenceInMinutes(
      new Date(currentSlot.endTime),
      new Date(currentSlot.startTime),
    );
  }, [currentSlot.startTime, currentSlot.endTime]);

  const handleAddToList = () => {
    if (
      !currentSlot.slotName ||
      !currentSlot.startTime ||
      !currentSlot.endTime ||
      duration <= 0
    )
      return;

    const newSlot = {
      ...currentSlot,
      id: crypto.randomUUID(), // ID tạm để xóa
      date: format(new Date(currentSlot.startTime), "yyyy-MM-dd"),
    };

    setSlotList((prev) => [...prev, newSlot]);
    // Reset form để nhập cái tiếp theo
    setCurrentSlot({
      slotName: "",
      startTime: "",
      endTime: "",
      maxProducts: 10,
    });
  };

  const handleRemoveFromList = (id: string) => {
    setSlotList((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmitAll = () => {
    // Format lại payload đúng chuẩn API bạn gửi
    const finalPayload = slotList.map(
      ({ date, startTime, endTime, slotName, maxProducts }) => ({
        date,
        startTime,
        endTime,
        slotName,
        maxProducts,
      }),
    );
    onSave(finalPayload);
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500 shadow-sm border border-orange-100">
            <Timer size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 uppercase italic">
              Khởi tạo khung giờ hàng loạt
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              Cấu hình nhiều Slot cho chiến dịch
            </p>
          </div>
        </div>
      }
      footer={
        <CustomButtonActions
          cancelText="Hủy thao tác"
          submitText={
            isProcessing
              ? "Đang khởi tạo..."
              : `Lưu ${slotList.length} khung giờ`
          }
          onCancel={onClose}
          onSubmit={handleSubmitAll}
          disabled={slotList.length === 0 || isProcessing}
          className="w-64! rounded-2xl font-bold uppercase text-[11px] h-12 shadow-lg shadow-orange-100"
        />
      }
      width="max-w-4xl"
      className="rounded-[2.5rem]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-2">
        {/* CỘT TRÁI: FORM NHẬP */}
        <div className="lg:col-span-5 space-y-5 border-r border-gray-100 pr-8">
          <div className="p-4 bg-orange-50/50 rounded-3xl border border-orange-100 mb-2">
            <label className="text-[10px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Plus size={14} strokeWidth={3} /> Thiết lập Slot mới
            </label>

            <div className="space-y-4">
              <FormInput
                label="Tên Slot"
                placeholder="Vd: Flash Sale sáng..."
                value={currentSlot.slotName}
                onChange={(e) =>
                  setCurrentSlot({ ...currentSlot, slotName: e.target.value })
                }
                className="bg-white"
              />

              <DateTimeInput
                label="Bắt đầu"
                value={currentSlot.startTime}
                onChange={(val) =>
                  setCurrentSlot({ ...currentSlot, startTime: val })
                }
              />

              <DateTimeInput
                label="Kết thúc"
                value={currentSlot.endTime}
                onChange={(val) =>
                  setCurrentSlot({ ...currentSlot, endTime: val })
                }
              />

              <FormInput
                label="Số lượng sản phẩm"
                type="number"
                value={currentSlot.maxProducts}
                onChange={(e) =>
                  setCurrentSlot({
                    ...currentSlot,
                    maxProducts: Number(e.target.value),
                  })
                }
                className="bg-white"
              />

              <button
                onClick={handleAddToList}
                disabled={!currentSlot.slotName || duration <= 0}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                Thêm vào danh sách chờ
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH CHỜ */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Danh sách slot đã thêm ({slotList.length})
            </label>
            {slotList.length > 0 && (
              <button
                onClick={() => setSlotList([])}
                className="text-[9px] font-bold text-rose-500 uppercase hover:underline"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3 max-h-120 overflow-y-auto pr-2 custom-scrollbar">
            {slotList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-4xl p-10 text-center">
                <CalendarDays className="text-gray-200 mb-3" size={48} />
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  Chưa có khung giờ nào
                  <br />
                  được thêm
                </p>
              </div>
            ) : (
              slotList.map((slot) => (
                <div
                  key={slot.id}
                  className="group flex items-center justify-between p-4 bg-white border-2 border-gray-50 rounded-2xl hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 font-bold italic shadow-sm">
                      {slotList.indexOf(slot) + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tighter italic">
                        {slot.slotName}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-0.5">
                        <Clock size={12} className="text-orange-400" />
                        {format(new Date(slot.startTime), "HH:mm")}{" "}
                        <ArrowRight size={10} />{" "}
                        {format(new Date(slot.endTime), "HH:mm")}
                        <span className="mx-1 opacity-20">|</span>
                        <span>{slot.maxProducts} SP</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromList(slot.id)}
                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
