"use client";

import { PortalModal } from '@/features/PortalModal';
import { UpdateWishlistItemRequest, WishlistItemResponse } from '@/types/wishlist/wishlist.types';
import { cn } from "@/utils/cn";
import {
    Edit3,
    HelpCircle,
    Loader2,
    Minus,
    Plus,
    Save
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { useWishlist } from '../../_hooks/useWishlist';

interface EditWishlistItemModalProps {
    visible: boolean;
    onClose: () => void;
    item: WishlistItemResponse;
    wishlistId: string;
    onSuccess: () => void;
}

export default function EditWishlistItemModal({
    visible,
    onClose,
    item,
    wishlistId,
    onSuccess,
}: EditWishlistItemModalProps) {
    const { updateWishlistItem } = useWishlist();
    const [updating, setUpdating] = useState(false);

    // Form states
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState("");
    const [priority, setPriority] = useState(0);
    const [desiredPrice, setDesiredPrice] = useState<number | "">("");

    // Sync data khi modal mở hoặc item thay đổi
    useEffect(() => {
        if (visible && item) {
            setQuantity(item.quantity || 1);
            setNotes(item.notes || "");
            setPriority(item.priority || 0);
            setDesiredPrice(item.desiredPrice || "");
        }
    }, [visible, item]);

    const handleSubmit = async () => {
        if (quantity < 1) {
            toast.error("Số lượng phải ít nhất là 1");
            return;
        }

        try {
            setUpdating(true);
            const updateData: UpdateWishlistItemRequest = {
                quantity,
                notes: notes.trim() || undefined,
                priority,
                desiredPrice: desiredPrice === "" ? undefined : desiredPrice,
            };

            const result = await updateWishlistItem(wishlistId, item.id, updateData);

            if (result.success) {
                toast.success('Cập nhật thành công! 🎉');
                onSuccess();
                onClose();
            } else {
                toast.error(result.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setUpdating(false);
        }
    };

    // --- PORTAL MODAL CONFIG ---

    const modalTitle = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                <Edit3 size={20} />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tight leading-none">Chỉnh sửa mục</h3>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1 truncate max-w-[200px]">
                    {item?.productName || "Sản phẩm"}
                </p>
            </div>
        </div>
    );

    const modalFooter = (
        <div className="flex w-full gap-3">
            <button 
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors uppercase text-xs tracking-widest"
            >
                Bỏ qua
            </button>
            <button 
                disabled={updating}
                onClick={handleSubmit}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-orange-600 disabled:bg-gray-200 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-xl shadow-gray-200 uppercase text-xs tracking-[0.2em]"
            >
                {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {updating ? "ĐANG LƯU..." : "CẬP NHẬT NGAY"}
            </button>
        </div>
    );

    return (
        <PortalModal
            isOpen={visible}
            onClose={onClose}
            title={modalTitle}
            footer={modalFooter}
            width="max-w-lg"
            className="rounded-[2.5rem]"
        >
            <div className="space-y-6">
                {/* Quantity & Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quantity Picker */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">Số lượng</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1 shadow-inner">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-colors text-gray-500 hover:text-orange-600"
                            >
                                <Minus size={16} />
                            </button>
                            <input 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="flex-1 bg-transparent text-center font-semibold text-gray-700 outline-none"
                            />
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-colors text-gray-500 hover:text-orange-600"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Priority Selector */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">Độ ưu tiên</label>
                        <div className="flex bg-gray-50 border border-gray-200 rounded-2xl p-1 gap-1 shadow-inner">
                            {[0, 1, 2].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-tighter transition-all",
                                        priority === p 
                                            ? p === 2 ? "bg-red-500 text-white shadow-lg shadow-red-200" : 
                                              p === 1 ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : 
                                              "bg-gray-900 text-white"
                                            : "text-gray-600 hover:text-gray-600"
                                    )}
                                >
                                    {p === 0 ? "Thấp" : p === 1 ? "Cao" : "Gấp"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desired Price */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">Giá mong muốn (VND)</label>
                        <div className="group relative">
                            <HelpCircle size={14} className="text-gray-300 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-medium">
                                Hệ thống sẽ thông báo khi sản phẩm đạt mức giá này.
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <input 
                            type="text"
                            value={desiredPrice ? new Intl.NumberFormat('vi-VN').format(desiredPrice as number) : ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setDesiredPrice(val ? parseInt(val) : "");
                            }}
                            placeholder="Nhập giá bạn muốn chờ đợi..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-orange-600 placeholder:text-gray-300 shadow-inner"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 font-semibold text-gray-300 group-focus-within:text-orange-300">₫</span>
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 ml-1">Ghi chú</label>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Lưu ý về size, màu sắc hoặc thời điểm mua..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-600 resize-none placeholder:text-gray-300 shadow-inner"
                    />
                </div>
            </div>
        </PortalModal>
    );
}