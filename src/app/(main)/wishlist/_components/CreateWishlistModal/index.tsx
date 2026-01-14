"use client";

import { PortalModal } from "@/features/PortalModal";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import {
    Check,
    Globe,
    Image as ImageIcon,
    Loader2,
    Lock,
    Plus,
    Star,
    Trash2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWishlist } from "../../_hooks/useWishlist";

interface CreateWishlistModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (wishlistId: string) => void;
}

export default function CreateWishlistModal({
    visible,
    onCancel,
    onSuccess,
}: CreateWishlistModalProps) {
    const { createWishlist } = useWishlist();
    const { uploadFile: uploadPresigned, uploading: uploadingImage } = usePresignedUpload();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [isDefault, setIsDefault] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [previewImage, setPreviewImage] = useState<string>("");
    const [coverImageAssetId, setCoverImageAssetId] = useState<string>("");

    useEffect(() => {
        if (!visible) {
            setName("");
            setDescription("");
            setIsPublic(false);
            setIsDefault(false);
            setPreviewImage("");
            setCoverImageAssetId("");
        }
    }, [visible]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn tệp hình ảnh!");
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);

        try {
            const res = await uploadPresigned(file, UploadContext.WISHLIST_COVER);
            if (res.assetId) {
                setCoverImageAssetId(res.assetId);
                toast.success("Tải ảnh bìa thành công!");
            }
        } catch (err) {
            toast.error("Tải ảnh thất bại");
            setPreviewImage("");
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Vui lòng nhập tên Wishlist");
            return;
        }

        try {
            setSubmitting(true);
            const result = await createWishlist({
                name,
                description,
                isPublic,
                isDefault,
                coverImageAssetId: coverImageAssetId || undefined,
            });

            if (result.success && result.data) {
                toast.success('Đã tạo Wishlist thành công! 🎉');
                onSuccess(result.data.id);
                onCancel();
            } else {
                toast.error(result.error || 'Không thể tạo wishlist');
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    // Header của Modal
    const modalTitle = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <Plus size={24} strokeWidth={3} />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tight leading-none">Tạo Wishlist Mới</h3>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Lưu trữ món đồ yêu thích</p>
            </div>
        </div>
    );

    // Footer của Modal
    const modalFooter = (
        <div className="flex w-full gap-3">
            <button 
                onClick={onCancel}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors uppercase text-xs tracking-widest"
            >
                Hủy bỏ
            </button>
            <button 
                disabled={submitting || uploadingImage}
                onClick={handleSubmit}
                className="flex-2 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-orange-600 disabled:bg-gray-200 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-xl shadow-gray-200 uppercase text-xs tracking-[0.2em]"
            >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                {submitting ? "ĐANG TẠO..." : "TẠO NGAY"}
            </button>
        </div>
    );

    return (
        <PortalModal
            isOpen={visible}
            onClose={onCancel}
            title={modalTitle}
            footer={modalFooter}
            width="max-w-xl"
            className="rounded-[2.5rem]"
        >
            <div className="space-y-6">
                {/* Image Upload Area */}
                <div className="space-y-3">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">Ảnh bìa (Tùy chọn)</label>
                    <div className="relative group aspect-21/9 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center transition-all hover:border-gray-300">
                        {previewImage ? (
                            <>
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => {setPreviewImage(""); setCoverImageAssetId("");}} 
                                        className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-red-500 transition-colors shadow-lg"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                                    {uploadingImage ? <Loader2 className="animate-spin" /> : <ImageIcon size={24} />}
                                </div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                                    {uploadingImage ? "Đang tải..." : "Tải ảnh lên"}
                                </span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">Tên Wishlist *</label>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Đồ Decor nhà mới..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-gray-700 placeholder:text-gray-300 shadow-inner"
                    />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">Mô tả</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Ghi chú về danh sách này..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-600 resize-none placeholder:text-gray-300 shadow-inner"
                    />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleOption 
                        active={isPublic} 
                        onClick={() => setIsPublic(!isPublic)}
                        icon={isPublic ? <Globe size={18} /> : <Lock size={18} />}
                        label="Công khai"
                        description="Ai cũng có thể xem"
                    />
                    <ToggleOption 
                        active={isDefault} 
                        onClick={() => setIsDefault(!isDefault)}
                        icon={<Star size={18} />}
                        label="Mặc định"
                        description="Tự động lưu vào đây"
                    />
                </div>
            </div>
        </PortalModal>
    );
}

const ToggleOption = ({ active, onClick, icon, label, description }: any) => (
    <div 
        onClick={onClick}
        className={cn(
            "flex items-center gap-4 p-4 rounded-[1.8rem] border cursor-pointer transition-all",
            active ? "bg-orange-50 border-gray-100 ring-1 ring-orange-200 shadow-sm" : "bg-gray-50 border-gray-200 hover:border-gray-300"
        )}
    >
        <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
            active ? "bg-orange-500 text-white" : "bg-white text-gray-600"
        )}>
            {icon}
        </div>
        <div className="flex-1">
            <h4 className={cn("text-xs font-semibold uppercase tracking-tight", active ? "text-orange-900" : "text-gray-700")}>
                {label}
            </h4>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{description}</p>
        </div>
        <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
            active ? "bg-orange-500 border-gray-500" : "border-gray-300 bg-white"
        )}>
            {active && <Check size={12} className="text-white" strokeWidth={4} />}
        </div>
    </div>
);