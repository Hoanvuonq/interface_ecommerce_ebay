"use client";

import React, { useState, useMemo } from 'react';
import { 
    Share2, 
    Copy, 
    RefreshCcw, 
    Check, 
    Facebook, 
    Twitter, 
    MessageCircle,
    ShieldAlert,
    QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import QRCode from "react-qr-code";
import { toast } from "sonner"; 
import { PortalModal } from '@/features/PortalModal';

interface Props {
    visible: boolean;
    onClose: () => void;
    wishlistId: string;
    wishlistName: string;
    shareUrl?: string;
    shareToken?: string;
    onRegenerateToken: () => Promise<void>;
}

export default function WishlistShareModal({
    visible,
    onClose,
    wishlistId,
    wishlistName,
    shareUrl: providedShareUrl,
    shareToken,
    onRegenerateToken,
}: Props) {
    const [copied, setCopied] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const shareUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return providedShareUrl || (shareToken ? `${window.location.origin}/wishlist/shared/${shareToken}` : '');
    }, [providedShareUrl, shareToken]);

    const handleCopyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Đã sao chép liên kết!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Không thể sao chép');
        }
    };

    const handleShare = (platform: 'fb' | 'tw' | 'wa') => {
        if (!shareUrl) return;
        let url = '';
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(`Xem danh sách yêu thích của mình: ${wishlistName}`);

        switch (platform) {
            case 'fb': url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
            case 'tw': url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`; break;
            case 'wa': url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`; break;
        }
        window.open(url, '_blank', 'width=600,height=400');
    };

    // --- PORTAL MODAL CONFIG ---

    const modalTitle = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm shadow-orange-100">
                <Share2 size={20} />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Chia sẻ Wishlist</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gửi cho bạn bè và người thân</p>
            </div>
        </div>
    );

    const modalFooter = (
        <div className="flex w-full">
            <button 
                onClick={onClose}
                className="w-full py-3.5 rounded-xl font-bold text-slate-400 hover:bg-slate-100 transition-colors uppercase text-xs tracking-widest"
            >
                Đóng cửa sổ
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
            <div className="space-y-8">
                {!shareToken ? (
                    <div className="py-10 text-center space-y-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <ShieldAlert size={48} strokeWidth={1.5} className="mx-auto text-slate-300" />
                        <p className="text-slate-500 font-medium leading-relaxed px-6">
                            Wishlist này đang ở chế độ riêng tư. <br />
                            Vui lòng chuyển sang <span className="text-orange-600 font-bold">Công khai</span> để chia sẻ.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* URL Input Area */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Liên kết chia sẻ</label>
                            <div className="flex p-1.5 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all shadow-inner">
                                <input 
                                    readOnly 
                                    value={shareUrl}
                                    className="flex-1 bg-transparent px-3 text-sm font-bold text-slate-600 outline-none truncate"
                                />
                                <button 
                                    onClick={handleCopyLink}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${
                                        copied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-orange-600 shadow-slate-200'
                                    } shadow-lg active:scale-95`}
                                >
                                    {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={3} />}
                                    {copied ? 'ĐÃ CHÉP' : 'SAO CHÉP'}
                                </button>
                            </div>
                        </div>

                        {/* Socials & QR Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                            {/* Social Icons */}
                            <div className="space-y-4 text-center md:text-left">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">Mạng xã hội</label>
                                <div className="flex justify-center md:justify-start gap-3">
                                    <SocialButton icon={<Facebook />} color="bg-[#1877F2]" onClick={() => handleShare('fb')} />
                                    <SocialButton icon={<Twitter />} color="bg-[#1DA1F2]" onClick={() => handleShare('tw')} />
                                    <SocialButton icon={<MessageCircle />} color="bg-[#25D366]" onClick={() => handleShare('wa')} />
                                </div>
                            </div>

                            {/* QR Area */}
                            <div className="flex flex-col items-center gap-3 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                                <div className="bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-100">
                                    <QRCode value={shareUrl} size={100} />
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <QrCode size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Quét mã QR</span>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="pt-6 border-t border-slate-100">
                            <button 
                                disabled={isRegenerating}
                                onClick={async () => {
                                    if (confirm('Link cũ sẽ không còn hoạt động. Bạn có chắc chắn muốn tạo link mới?')) {
                                        try {
                                            setIsRegenerating(true);
                                            await onRegenerateToken();
                                            toast.success("Đã làm mới liên kết!");
                                        } finally {
                                            setIsRegenerating(false);
                                        }
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-orange-200 hover:text-orange-500 transition-all font-black text-[10px] uppercase tracking-widest active:scale-98"
                            >
                                <RefreshCcw size={14} className={isRegenerating ? 'animate-spin' : ''} />
                                Regenerate Public Link
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PortalModal>
    );
}

const SocialButton = ({ icon, color, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`${color} text-white p-4 rounded-2xl shadow-lg shadow-current/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center`}
    >
        {React.cloneElement(icon, { size: 20 })}
    </button>
);