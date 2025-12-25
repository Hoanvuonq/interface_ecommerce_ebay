"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Heart, 
    Package, 
    LayoutGrid, 
    Plus, 
    ChevronRight, 
    Share2, 
    Edit3, 
    Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '../products/_hooks/useCart';
import { isAuthenticated } from '@/utils/local.storage';
import { toPublicUrl } from '@/utils/storage/url';
import { toSizedVariant } from '@/utils/products/media.helpers';
import { cn } from '@/utils/cn';
import { toast } from "sonner";

import { WishlistListItem } from './_components/WishlistListItem';
import { WishlistItemCard } from './_components/WishlistItemCard';
import WishlistShareModal from './_components/WishlistShareModal';
import EditWishlistModal from './_components/EditWishlistModal';
import EditWishlistItemModal from './_components/EditWishlistItemModal';
import CreateWishlistModal from './_components/CreateWishlistModal';
import PageContentTransition from '@/features/PageContentTransition';

export default function WishlistPage() {
    const router = useRouter();
    const { 
        getBuyerWishlists, getWishlistById, removeFromWishlist, 
        updateWishlist, getPriceTargetMetItems, 
        regenerateShareToken 
    } = useWishlist();
    const { quickAddToCart } = useCart();

    // --- STATES ---
    const [wishlists, setWishlists] = useState<any[]>([]);
    const [loadingWishlists, setLoadingWishlists] = useState(true);
    const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
    const [selectedWishlist, setSelectedWishlist] = useState<any | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [priceTargetMetData, setPriceTargetMetData] = useState<any>(null);

    // FIX: Thêm state quản lý loading cho từng item
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
    const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set());

    // Modal Visibility States
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [editItemModalVisible, setEditItemModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // --- DATA LOADING ---

    const loadWishlistDetails = useCallback(async (id: string) => {
        try {
            setLoadingDetails(true);
            const result = await getWishlistById(id);
            if (result.success) setSelectedWishlist(result.data);
        } finally {
            setLoadingDetails(false);
        }
    }, [getWishlistById]);

    const loadAllWishlists = useCallback(async (autoSelect = false) => {
        try {
            setLoadingWishlists(true);
            const result = await getBuyerWishlists({ size: 100 });
            if (result.success && result.data?.content) {
                const sorted = result.data.content.sort((a: any, b: any) => (a.isDefault ? -1 : 1));
                setWishlists(sorted);
                if (autoSelect && sorted.length > 0) {
                    const target = sorted.find((w: any) => w.isDefault) || sorted[0];
                    setSelectedWishlistId(target.id);
                    loadWishlistDetails(target.id);
                }
            }
        } finally {
            setLoadingWishlists(false);
        }
    }, [getBuyerWishlists, loadWishlistDetails]);

    useEffect(() => {
        loadAllWishlists(true);
        getPriceTargetMetItems().then(res => res.success && setPriceTargetMetData(res.data));
    }, [loadAllWishlists, getPriceTargetMetItems]);

    // --- FIX: ACTIONS HANDLERS ---

    const handleRemoveItem = useCallback(async (variantId: string, itemId: string) => {
        if (!selectedWishlistId) return;
        setRemovingIds(prev => new Set(prev).add(itemId));
        try {
            const result = await removeFromWishlist(selectedWishlistId, variantId);
            if (result.success) {
                loadWishlistDetails(selectedWishlistId); 
                setWishlists(prev => prev.map(w => w.id === selectedWishlistId ? { ...w, itemCount: w.itemCount - 1 } : w));
            } else {
                toast.error(result.error || 'Lỗi khi xóa');
            }
        } catch (err) {
            toast.error('Thao tác thất bại');
        } finally {
            setRemovingIds(prev => { const next = new Set(prev); next.delete(itemId); return next; });
        }
    }, [selectedWishlistId, removeFromWishlist, loadWishlistDetails]);

    const handleAddToCartAction = useCallback(async (variantId: string, productName: string, itemId: string) => {
        setAddingToCartIds(prev => new Set(prev).add(itemId));
        try {
            const result = await quickAddToCart(variantId, 1);
            if (result.success) toast.success(`Đã thêm ${productName} vào giỏ`);
            else toast.error(result.error || 'Lỗi thêm vào giỏ');
        } finally {
            setAddingToCartIds(prev => { const next = new Set(prev); next.delete(itemId); return next; });
        }
    }, [quickAddToCart]);

    const handleSelect = (id: string) => {
        if (id === selectedWishlistId) return;
        setSelectedWishlistId(id);
        loadWishlistDetails(id);
    };

    const priceTargetMap = useMemo(() => {
        const map = new Map();
        priceTargetMetData?.wishlists?.forEach((w: any) => map.set(w.wishlistId, w.itemCount));
        return map;
    }, [priceTargetMetData]);

    return (
        <PageContentTransition>
            <div className="min-h-screen bg-[#fafafa] text-slate-900 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
                        <Link href="/" className="hover:text-orange-500 transition-colors flex items-center gap-1.5 font-bold">
                            <Home size={12} /> HOME
                        </Link>
                        <ChevronRight size={10} strokeWidth={3} />
                        <span className="text-slate-900 font-bold">WISHLIST COLLECTIONS</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        
                        {/* SIDEBAR */}
                        <aside className="lg:col-span-3 sticky top-28 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Collections</h2>
                                </div>
                                <button 
                                    onClick={() => setCreateModalVisible(true)}
                                    className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                                {loadingWishlists ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-white border border-slate-100 animate-pulse rounded-2xl" />)
                                ) : (
                                    wishlists.map(w => (
                                        <WishlistListItem 
                                            key={w.id} 
                                            wishlist={w} 
                                            isSelected={selectedWishlistId === w.id}
                                            onSelect={handleSelect}
                                            priceTargetMetCount={priceTargetMap.get(w.id)}
                                            onTogglePrivacy={() => {}} 
                                            onSetAsDefault={() => {}}
                                        />
                                    ))
                                )}
                            </div>
                        </aside>

                        <main className="lg:col-span-9">
                            <AnimatePresence mode="wait">
                                {loadingDetails ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />)}
                                    </motion.div>
                                ) : selectedWishlist ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                        <div className="bg-white border border-slate-100 rounded-[3rem] p-6 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-colors" />
                                            <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                                                <div className="w-44 h-44 shrink-0 relative">
                                                    <div className="absolute inset-0 bg-orange-100 rounded-[2.8rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                                                    <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
                                                        {selectedWishlist.imageBasePath ? (
                                                            <img 
                                                                src={toPublicUrl(toSizedVariant(`${selectedWishlist.imageBasePath}${selectedWishlist.imageExtension}`, '_medium'))} 
                                                                className="w-full h-full object-cover" 
                                                                alt="cover" 
                                                            />
                                                        ) : (
                                                            <Heart size={56} className="text-orange-500 fill-orange-50" strokeWidth={1} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 font-black">
                                                        {selectedWishlist.isDefault && <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-[9px] uppercase tracking-widest">Default</span>}
                                                        <span className={cn("px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border", selectedWishlist.isPublic ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200")}>
                                                            {selectedWishlist.isPublic ? "Public" : "Private"}
                                                        </span>
                                                    </div>
                                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-[0.9] mb-4">{selectedWishlist.name}</h1>
                                                    <p className="text-slate-400 font-medium line-clamp-2 max-w-xl mb-8">{selectedWishlist.description}</p>
                                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                        <button onClick={() => setEditModalVisible(true)} className="flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-slate-200"><Edit3 size={14} /> Edit</button>
                                                        {selectedWishlist.isPublic && <button onClick={() => setShareModalVisible(true)} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"><Share2 size={14} /> Share Link</button>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {selectedWishlist.items?.length > 0 ? (
                                                selectedWishlist.items.map((item: any) => (
                                                    <WishlistItemCard 
                                                        key={item.id} 
                                                        item={item}
                                                        onRemove={handleRemoveItem} 
                                                        onAddToCart={handleAddToCartAction}
                                                        onEdit={(i) => { setEditingItem(i); setEditItemModalVisible(true); }}
                                                        isRemoving={removingIds.has(item.id)}
                                                        isAddingToCart={addingToCartIds.has(item.id)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="col-span-full py-28 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
                                                    <Package size={48} className="text-orange-200 mb-4" strokeWidth={1} />
                                                    <h3 className="text-slate-900 font-black uppercase text-sm tracking-widest">Danh sách trống</h3>
                                                    <Link href="/products" className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all">Khám phá ngay <ChevronRight size={14} strokeWidth={3} /></Link>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </main>
                    </div>
                </div>

                <CreateWishlistModal visible={createModalVisible} onCancel={() => setCreateModalVisible(false)} onSuccess={(id) => { setCreateModalVisible(false); loadAllWishlists(); setSelectedWishlistId(id); loadWishlistDetails(id); }} />
                {selectedWishlist && (
                    <>
                        <EditWishlistModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} wishlist={selectedWishlist} onUpdate={async () => { await loadAllWishlists(); await loadWishlistDetails(selectedWishlist.id); }} />
                        <WishlistShareModal visible={shareModalVisible} onClose={() => setShareModalVisible(false)} wishlistId={selectedWishlist.id} wishlistName={selectedWishlist.name} shareToken={selectedWishlist.shareToken} onRegenerateToken={async () => { await regenerateShareToken(selectedWishlist.id); await loadWishlistDetails(selectedWishlist.id); }} />
                    </>
                )}
                {editingItem && selectedWishlist && (
                    <EditWishlistItemModal visible={editItemModalVisible} onClose={() => { setEditItemModalVisible(false); setEditingItem(null); }} item={editingItem} wishlistId={selectedWishlist.id} onSuccess={() => loadWishlistDetails(selectedWishlist.id)} />
                )}
            </div>
        </PageContentTransition>
    );
}