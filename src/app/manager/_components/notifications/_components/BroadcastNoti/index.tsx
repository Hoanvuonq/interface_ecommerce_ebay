"use client";

import { useState } from "react";
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  AlertCircle,
  Bell,
  Target,
  Layers,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import notificationService, {
    type BroadcastAudience,
    type NotificationType,
    type NotificationPriority,
} from "@/layouts/header/_service/notification.service";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

interface BroadcastFormData {
    targetAudience: BroadcastAudience;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    content: string;
    imageUrl: string;
    redirectUrl: string;
}

const ACCEPTED_IMAGE_TYPES = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function BroadcastNotificationForm() {
    const { success, error: toastError } = useToast();
    const { uploading, uploadFile } = usePresignedUpload();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState<BroadcastFormData>({
        targetAudience: "ALL_USERS",
        type: "SYSTEM",
        priority: "NORMAL",
        title: "",
        content: "",
        imageUrl: "",
        redirectUrl: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toastError("Định dạng không hỗ trợ", { description: "Chỉ chấp nhận file WebP, JPEG, PNG" });
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toastError("File quá lớn", { description: "Kích thước ảnh tối đa là 5MB" });
            return;
        }

        try {
            const result = await uploadFile(file, UploadContext.PRODUCT_IMAGE);
            if (result.finalUrl) {
                setFormData(prev => ({ ...prev, imageUrl: result.finalUrl ?? "" }));
                success("Tải ảnh thành công");
            }
        } catch (err) {
            toastError("Upload thất bại", { description: "Không thể tải ảnh lên hệ thống" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            toastError("Thiếu thông tin", { description: "Vui lòng nhập tiêu đề thông báo" });
            return;
        }

        setLoading(true);
        try {
            const recipientCount = await notificationService.sendBroadcast(formData);
            success("Đã gửi broadcast", { description: `Thông báo đã được gửi đến ${recipientCount} người dùng` });
            setFormData({
                targetAudience: "ALL_USERS",
                type: "SYSTEM",
                priority: "NORMAL",
                title: "",
                content: "",
                imageUrl: "",
                redirectUrl: "",
            });
        } catch (err) {
            toastError("Lỗi hệ thống", { description: "Không thể gửi thông báo lúc này" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Target Audience Selector */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <Target size={16} className="text-orange-500" /> Đối tượng nhận
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {(['ALL_BUYERS', 'ALL_SHOPS', 'ALL_USERS'] as BroadcastAudience[]).map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, targetAudience: val }))}
                            className={cn(
                                "py-3 px-4 rounded-2xl text-xs font-bold transition-all border-2",
                                formData.targetAudience === val 
                                    ? "bg-orange-500 border-gray-500 text-white shadow-lg shadow-orange-200" 
                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                            )}
                        >
                            {val.replace('ALL_', 'Tất cả ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notification Type */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <Layers size={16} className="text-orange-500" /> Loại thông báo
                    </label>
                    <select 
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:bg-white focus:border-gray-500 transition-all font-bold text-gray-700 appearance-none shadow-inner-sm"
                    >
                        <option value="SYSTEM">Hệ thống</option>
                        <option value="ORDER">Đơn hàng</option>
                        <option value="PRODUCT">Sản phẩm</option>
                        <option value="PAYMENT">Thanh toán</option>
                        <option value="SHIPPING">Vận chuyển</option>
                    </select>
                </div>

                {/* Priority Selector */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        <Zap size={16} className="text-orange-500" /> Độ ưu tiên
                    </label>
                    <select 
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 outline-none focus:bg-white focus:border-gray-500 transition-all font-bold text-gray-700 appearance-none shadow-inner-sm"
                    >
                        <option value="LOW">Thấp</option>
                        <option value="NORMAL">Bình thường</option>
                        <option value="HIGH">Cao</option>
                        <option value="URGENT">Khẩn cấp</option>
                    </select>
                </div>
            </div>

            {/* Title & Content */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">Tiêu đề</label>
                    <input 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tiêu đề thu hút người dùng..."
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-gray-500 transition-all font-bold text-gray-800 placeholder:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">Nội dung chi tiết</label>
                    <textarea 
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Nội dung thông báo sẽ xuất hiện trên thiết bị người dùng..."
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-gray-500 transition-all font-bold text-gray-800 placeholder:text-gray-500 resize-none"
                    />
                </div>
            </div>

            {/* Image Upload Custom */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">Hình ảnh đính kèm</label>
                <div className="flex items-center gap-4">
                    <AnimatePresence mode="wait">
                        {formData.imageUrl ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                            >
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ) : (
                            <label className="w-32 h-32 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-gray-300 transition-all group">
                                <ImageIcon className="text-gray-500 group-hover:text-orange-400 transition-colors" size={28} />
                                <span className="text-[10px] font-semibold text-gray-500 group-hover:text-orange-400 uppercase mt-2">Tải ảnh</span>
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </AnimatePresence>
                    <div className="text-xs text-gray-600 font-medium leading-relaxed max-w-[200px]">
                        <p className="flex items-center gap-1"><AlertCircle size={12} /> Hỗ trợ: WebP, JPG, PNG</p>
                        <p>Dung lượng tối đa 5MB</p>
                    </div>
                </div>
            </div>

            {/* Redirect URL */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">URL Chuyển hướng</label>
                <input 
                    name="redirectUrl"
                    value={formData.redirectUrl}
                    onChange={handleInputChange}
                    placeholder="/san-pham/123 hoặc https://..."
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 outline-none focus:border-gray-500 transition-all font-bold text-gray-800 placeholder:text-gray-500 shadow-sm"
                />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100">
                <button
                    disabled={loading || uploading}
                    className="w-full py-5 bg-linear-to-r from-orange-500 to-red-600 hover:scale-[1.01] active:scale-[0.98] disabled:from-gray-200 disabled:to-gray-300 text-white rounded-3xl font-semibold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-200"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>Gửi thông báo ngay <Send size={18} strokeWidth={3} /></>
                    )}
                </button>
            </div>
        </form>
    );
}