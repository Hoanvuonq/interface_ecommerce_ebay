"use client";

import { PortalModal } from '@/features/PortalModal';
import { usePresignedUpload } from '@/hooks/usePresignedUpload';
import { UploadContext } from '@/types/storage/storage.types';
import { UpdateWishlistRequest, WishlistResponse } from '@/types/wishlist/wishlist.types';
import { cn } from "@/utils/cn";
import { toSizedVariant } from '@/utils/products/media.helpers';
import { toPublicUrl } from '@/utils/storage/url';
import { motion } from 'framer-motion';
import {
    Edit3,
    Loader2,
    Lock,
    Plus,
    Save,
    Trash2,
    Unlock
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";

interface EditWishlistModalProps {
    visible: boolean;
    onClose: () => void;
    wishlist: WishlistResponse;
    onUpdate: (id: string, data: UpdateWishlistRequest) => Promise<void>;
}

export default function EditWishlistModal({
    visible,
    onClose,
    wishlist,
    onUpdate,
}: EditWishlistModalProps) {
    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [coverAssetId, setCoverAssetId] = useState<string | null>(null);

    // Upload States
    const { uploadFile: uploadPresigned, uploading: uploadingImage } = usePresignedUpload();
    const [previewImage, setPreviewImage] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (visible && wishlist) {
            setName(wishlist.name);
            setDescription(wishlist.description || "");
            setIsPublic(wishlist.isPublic);
            
            if (wishlist.imageBasePath && wishlist.imageExtension) {
                const rawPath = `${wishlist.imageBasePath}${wishlist.imageExtension}`;
                setPreviewImage(toPublicUrl(toSizedVariant(rawPath, '_orig')));
            } else {
                setPreviewImage("");
            }
            setCoverAssetId(null);
            setUploadProgress(0);
        }
    }, [visible, wishlist]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn tệp hình ảnh!");
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);
        setUploadProgress(10);

        try {
            const res = await uploadPresigned(file, UploadContext.WISHLIST_COVER);
            if (res.assetId) {
                setCoverAssetId(res.assetId);
                setUploadProgress(100);
                toast.success("Tải ảnh bìa thành công!");
            }
        } catch (err) {
            toast.error("Tải ảnh thất bại");
            setPreviewImage("");
        } finally {
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage("");
        setCoverAssetId(""); 
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        try {
            setUpdating(true);
            const updateData: UpdateWishlistRequest = {
                name,
                description,
                isPublic,
                coverImageAssetId: coverAssetId === null ? undefined : coverAssetId 
            };

            await onUpdate(wishlist.id, updateData);
            toast.success("Cập nhật danh mục thành công! 🎉");
            onClose();
        } catch (error) {
            toast.error("Không thể cập nhật danh mục");
        } finally {
            setUpdating(false);
        }
    };


    const modalTitle = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                <Edit3 size={20} />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-tight leading-none">Chỉnh sửa Wishlist</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cập nhật bộ sưu tập của bạn</p>
            </div>
        </div>
    );

    const modalFooter = (
        <div className="flex w-full gap-3">
            <button 
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-400 hover:bg-slate-100 transition-colors uppercase text-xs tracking-widest"
            >
                Hủy bỏ
            </button>
            <button 
                disabled={updating || uploadingImage}
                onClick={handleSubmit}
                className="flex-2 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-orange-600 disabled:bg-slate-200 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase text-xs tracking-[0.2em]"
            >
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {updating ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
            </button>
        </div>
    );

    return (
        <PortalModal
            isOpen={visible}
            onClose={onClose}
            title={modalTitle}
            footer={modalFooter}
            width="max-w-xl"
            className="rounded-[2.5rem]"
        >
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">Ảnh bìa danh mục</label>
                    <div className="relative group aspect-21/9 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center transition-all hover:border-orange-300 shadow-inner">
                        {previewImage ? (
                            <>
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button 
                                        onClick={handleRemoveImage} 
                                        className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-red-500 transition-colors shadow-lg"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                                    {uploadingImage ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tải ảnh mới</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} />
                            </label>
                        )}

                        {uploadingImage && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                                <div className="w-full max-w-50 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-orange-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">Tên danh mục *</label>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên wishlist..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                    />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">Mô tả</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Mô tả ngắn gọn về danh sách này..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-600 resize-none placeholder:text-slate-300 shadow-inner"
                    />
                </div>

                {/* Privacy Control */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ml-1">Cài đặt quyền riêng tư</label>
                    <div 
                        onClick={() => setIsPublic(!isPublic)}
                        className={cn(
                            "flex items-center justify-between p-5 rounded-[1.8rem] border cursor-pointer transition-all",
                            isPublic ? "bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-100" : "bg-slate-50 border-slate-200 shadow-inner"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                                isPublic ? "bg-white text-emerald-500" : "bg-white text-slate-400"
                            )}>
                                {isPublic ? <Unlock size={20} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <h4 className={cn("text-sm font-semibold uppercase tracking-tight", isPublic ? "text-emerald-700" : "text-slate-700")}>
                                    {isPublic ? "Công khai" : "Riêng tư"}
                                </h4>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5 leading-none">
                                    {isPublic ? "Mọi người có thể xem qua link" : "Chỉ mình bạn xem được"}
                                </p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-12 h-6 rounded-full relative transition-colors p-1",
                            isPublic ? "bg-emerald-500" : "bg-slate-300"
                        )}>
                            <motion.div 
                                animate={{ x: isPublic ? 24 : 0 }}
                                className="w-4 h-4 bg-white rounded-full shadow-sm" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PortalModal>
    );
}