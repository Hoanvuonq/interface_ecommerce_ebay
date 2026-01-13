"use client";

import React, { useEffect, useState, useRef } from "react";
import { FileText, Save, Loader2, Lightbulb, ImagePlus } from "lucide-react";
import { richTextParagraphService } from "@/services/products/product.service";
import { TipTapEditor } from "../TipTapEditor";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import { PortalModal } from "@/features/PortalModal";

interface RichTextEditorModalProps {
  open: boolean;
  productId: string;
  onClose: () => void;
}

export function RichTextEditorModal({
  open,
  productId,
  onClose,
}: RichTextEditorModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paragraphId, setParagraphId] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { success: toastSuccess, error: toastError } = useToast();
  const { uploadFile, uploading } = usePresignedUpload();

  useEffect(() => {
    if (open && productId) {
      loadContent();
    }
  }, [open, productId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await richTextParagraphService.list(productId);
      const data = response?.data || response;
      const paragraphs = Array.isArray(data) ? data : [];

      if (paragraphs.length > 0) {
        const textParagraph = paragraphs.find((p) => p.type === "TEXT");
        if (textParagraph) {
          setContent(textParagraph.contentText || "");
          setParagraphId(textParagraph.id);
        }
      }
    } catch (error) {
      toastError("Không thể tải mô tả nâng cao");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (paragraphId) {
        await richTextParagraphService.update(productId, paragraphId, {
          contentText: content,
        });
      } else {
        const response = await richTextParagraphService.create(productId, {
          type: "TEXT",
          displayOrder: 0,
          contentText: content,
        });
        const data = response?.data || response;
        setParagraphId(data.id);
      }
      toastSuccess("Đã lưu mô tả sản phẩm");
      onClose();
    } catch (error) {
      toastError("Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorInstance) return;

    if (!file.type.startsWith("image/")) {
      toastError("Vui lòng chọn file ảnh!");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        editorInstance.chain().focus().setImage({
          src: e.target?.result as string,
        }).run();
      };
      reader.readAsDataURL(file);

      const result = await uploadFile(file, UploadContext.PRODUCT_IMAGE);
      const uploadedUrl = result.finalUrl;

      if (!uploadedUrl) throw new Error("Upload failed");

      const { state } = editorInstance;
      state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === "image" && node.attrs.src?.startsWith("data:")) {
          const tr = state.tr.setNodeMarkup(pos, undefined, { src: uploadedUrl });
          editorInstance.view.dispatch(tr);
        }
      });
    } catch (err) {
      toastError("Upload ảnh thất bại");
    }
  };

  // Định nghĩa Footer riêng để truyền vào PortalModal
  const footerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {uploading && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase animate-pulse">
            <ImagePlus size={14} /> Đang xử lý media...
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          disabled={saving}
          className="px-6 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={cn(
            "flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-95",
            saving ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
          )}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "ĐANG LƯU..." : "LƯU MÔ TẢ"}
        </button>
      </div>
    </div>
  );

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      width="max-w-5xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-xl text-white shadow-md shadow-orange-100">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 uppercase tracking-tight leading-none">Mô tả nâng cao</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Rich Text Editor</p>
          </div>
        </div>
      }
      footer={footerContent}
    >
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Banner hướng dẫn */}
            <div className="flex gap-4 p-4 bg-orange-50/50 border border-orange-100 rounded-3xl">
              <div className="shrink-0 w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm text-orange-600 border border-orange-50">
                <Lightbulb size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-bold text-orange-700 uppercase tracking-widest">Mẹo thiết kế</h4>
                <p className="text-[12px] text-orange-900/70 leading-relaxed font-semibold italic">
                  Chèn hình ảnh xen kẽ văn bản để tăng tính thuyết phục cho khách hàng.
                </p>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            
            <TipTapEditor
              content={content}
              onChange={setContent}
              onImageUpload={() => fileInputRef.current?.click()}
            />
          </div>
        )}
      </div>
    </PortalModal>
  );
}