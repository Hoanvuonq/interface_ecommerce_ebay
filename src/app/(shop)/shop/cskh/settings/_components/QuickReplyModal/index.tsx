"use client";

import React, { useState, KeyboardEvent, useMemo } from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, CustomButtonActions } from "@/components";
import { Plus, Trash2, GripVertical, X, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { TemplateReplyModal } from "../TemplateReplyModal";

interface QuickReplyItem {
  id: string;
  content: string;
  tags: string[];
}

export const QuickReplyModal: React.FC<any> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [groupName, setGroupName] = useState(initialData?.groupName || "");
  const [replies, setReplies] = useState<QuickReplyItem[]>(
    initialData?.replies || [{ id: "1", content: "", tags: [] }],
  );
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});

  const isEditMode = !!initialData;
  const currentContents = useMemo(
    () => replies.map((r) => r.content),
    [replies],
  );

  const handleDeleteRow = (id: string) => {
    if (replies.length > 1) {
      setReplies((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInputs[id]?.trim();
      const currentReply = replies.find((r) => r.id === id);
      if (value && currentReply && currentReply.tags.length < 3) {
        setReplies((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, tags: [...r.tags, value] } : r,
          ),
        );
        setTagInputs((prev) => ({ ...prev, [id]: "" }));
      }
    }
  };

  const renderTagChips = (reply: QuickReplyItem) => (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 p-2.5 min-h-20 w-full",
        "bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-300",
        "focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/10",
      )}
    >
      <AnimatePresence mode="popLayout">
        {reply.tags.map((tag, idx) => (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key={idx}
            className="flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-orange-200"
          >
            {tag}
            <X
              size={12}
              className="cursor-pointer hover:rotate-90 transition-transform"
              onClick={() =>
                setReplies((prev) =>
                  prev.map((r) =>
                    r.id === reply.id
                      ? { ...r, tags: r.tags.filter((_, i) => i !== idx) }
                      : r,
                  ),
                )
              }
            />
          </motion.span>
        ))}
      </AnimatePresence>
      {reply.tags.length < 3 && (
        <input
          placeholder={reply.tags.length === 0 ? "Enter để thêm..." : ""}
          value={tagInputs[reply.id] || ""}
          onChange={(e) =>
            setTagInputs((prev) => ({ ...prev, [reply.id]: e.target.value }))
          }
          onKeyDown={(e) => handleTagKeyDown(e, reply.id)}
          className="flex-1 min-w-20 bg-transparent outline-none text-[13px]  text-gray-700 font-medium placeholder:text-gray-300"
        />
      )}
    </div>
  );

  return (
    <>
      <PortalModal
        isOpen={isOpen}
        onClose={onClose}
        width="max-w-5xl"
        title={
          <span className=" text-gray-800 font-bold uppercase tracking-tighter italic text-lg">
            Cấu hình tin nhắn nhanh
          </span>
        }
        footer={
          <CustomButtonActions
            onCancel={onClose}
            onSubmit={() => console.log(replies)}
            submitText={isEditMode ? "Cập nhật" : "Tạo mới"}
            className="w-44! rounded-2xl h-11 shadow-xl shadow-orange-500/20"
            containerClassName="border-t-0 bg-transparent py-4 px-6"
          />
        }
      >
        <div className="space-y-6 px-1">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-orange-500 ml-1 tracking-widest">
              Tên nhóm tin nhắn *
            </label>
            <FormInput
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e: any) => setGroupName(e.target.value)}
              className="h-12 rounded-2xl border-slate-100 focus:border-orange-400 shadow-sm bg-slate-50/30"
            />
          </div>

          <div className="grid grid-cols-[50px_1fr_1fr_60px] px-6 text-[10px] font-bold uppercase  text-gray-400 tracking-widest">
            <span>No.</span>
            <span>Nội dung phản hồi</span>
            <span>Phím tắt (Tag)</span>
            <span className="text-right">Xóa</span>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-[50px_1fr_1fr_60px] items-center gap-5 p-4 bg-white border border-slate-100 rounded-4xl shadow-sm hover:border-orange-200 transition-all group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold  text-gray-300 group-hover:text-orange-500 transition-colors">
                      {index + 1}
                    </span>
                    <GripVertical
                      size={16}
                      className="text-gray-200 cursor-grab active:cursor-grabbing"
                    />
                  </div>

                  <FormInput
                    isTextArea
                    placeholder="Nhập nội dung..."
                    value={reply.content}
                    className="min-h-20 rounded-2xl text-[13px] font-medium bg-slate-50/50 border-transparent focus:bg-white focus:border-orange-200 py-3"
                    onChange={(e: any) =>
                      setReplies((prev) =>
                        prev.map((r) =>
                          r.id === reply.id
                            ? { ...r, content: e.target.value }
                            : r,
                        ),
                      )
                    }
                  />

                  {renderTagChips(reply)}

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteRow(reply.id)}
                      className="p-3  text-gray-300 hover:text-white hover:bg-red-500 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-red-200 active:scale-90"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() =>
                setReplies([
                  ...replies,
                  { id: Date.now().toString(), content: "", tags: [] },
                ])
              }
              className="flex-1 py-4 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest  text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-all bg-slate-50/30 active:scale-[0.98]"
            >
              <Plus size={16} strokeWidth={3} /> Thêm tin nhắn ({replies.length}
              /20)
            </button>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex-1 py-4 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest  text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-slate-50/30 active:scale-[0.98]"
            >
              <LayoutTemplate size={16} strokeWidth={2.5} /> Mẫu có sẵn
            </button>
          </div>
        </div>
      </PortalModal>

      <TemplateReplyModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        existingContents={currentContents}
        onConfirm={(ts: any) =>
          setReplies((prev) => [
            ...prev,
            ...ts.map((t: any) => ({
              id: Math.random().toString(),
              content: t.content,
              tags: t.tag ? [t.tag] : [],
            })),
          ])
        }
      />
    </>
  );
};
