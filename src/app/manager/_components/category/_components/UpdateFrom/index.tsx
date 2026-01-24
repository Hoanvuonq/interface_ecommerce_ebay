"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  X, 
  Image as ImageIcon, 
  ChevronDown, 
  ShieldCheck, 
  Globe, 
  Layout, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Activity,
  Edit3,
  MapPin
} from "lucide-react";
import NextImage from "next/image";
import { useUpdateCategory, useGetAllParents, useGetCategoryById, invalidateParentCategoriesCache } from "@/app/manager/_hooks/useCategory";
import { UpdateCategoryRequest } from "@/types/categories/category.update";
import { CategoryResponse, ShippingRestrictionsDTO } from "@/types/categories/category.detail";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";
import { COUNTRIES, REGIONS } from "@/app/manager/_constants/category";
import { cn } from "@/utils/cn";

interface UpdateFormProps {
    category: CategoryResponse;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({ category, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<UpdateCategoryRequest>({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parentId: category.parent?.id,
        active: category.active,
        imageAssetId: undefined,
        defaultShippingRestrictions: category.defaultShippingRestrictions || {
            restrictionType: 'NONE',
            countryRestrictionType: 'ALLOW_ONLY',
            restrictedCountries: [],
            restrictedRegions: [],
        },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [parentCategories, setParentCategories] = useState<CategoryResponse[]>([]);
    const [etag, setEtag] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    const isInitialMount = useRef(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleUpdateCategory, loading } = useUpdateCategory();
    const { handleGetAllParents, loading: loadingParents } = useGetAllParents();
    const { handleGetCategoryById } = useGetCategoryById();
    const { uploadFile: uploadPresigned, uploading: uploadingImage } = usePresignedUpload();

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast({ message: '', type: null }), 3000);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            loadParentCategories();
            loadCategoryForEtag();
            if (category.imageBasePath && category.imageExtension) {
                setCurrentImageUrl(toPublicUrl(`${category.imageBasePath}_orig${category.imageExtension}`));
            }
        }
    }, []);

    const loadCategoryForEtag = async () => {
        const data = await handleGetCategoryById(category.id);
        setEtag(String(data?.data?.version || category.version));
    };

    const loadParentCategories = async () => {
        const data = await handleGetAllParents();
        if (data) {
            const content = Array.isArray(data) ? data : (data as any).data || [];
            setParentCategories(content.filter((cat: any) => cat.id !== category.id));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return showToast("Chỉ chấp nhận file hình ảnh", "error");
        if (file.size / 1024 / 1024 > 5) return showToast("Ảnh tối đa 5MB", "error");

        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);
        setCurrentImageUrl(null);
        
        try {
            setUploadProgress(20);
            const res = await uploadPresigned(file, UploadContext.CATEGORY_IMAGE);
            if (res.assetId) {
                setFormData(prev => ({ ...prev, imageAssetId: res.assetId }));
                setUploadProgress(100);
                showToast("Upload ảnh thành công", "success");
            }
        } catch (err) {
            showToast("Lỗi upload ảnh", "error");
            setPreviewImage(null);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Tên danh mục là bắt buộc";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !etag) {
            if (!etag) showToast("Thiếu phiên bản (ETag)", "error");
            return;
        }

        const result = await handleUpdateCategory(category.id, formData, etag);
        if (result) {
            invalidateParentCategoriesCache();
            showToast("Cập nhật thành công!", "success");
            setTimeout(() => onSuccess?.(), 1000);
        }
    };

    const handleCancelAction = () => {
        if (previewImage) URL.revokeObjectURL(previewImage);
        onCancel?.();
    };

    return (
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
            {/* Toast System */}
            {toast.type && (
                <div className={cn(
                    "fixed top-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right border bg-white",
                    toast.type === 'success' ? "text-emerald-600 border-emerald-100" : "text-rose-600 border-rose-100"
                )}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-semibold uppercase tracking-widest">{toast.message}</span>
                </div>
            )}

            {/* Protocol Header */}
            <div className="bg-linear-to-br from-indigo-600 to-purple-700 px-10 py-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                        <Edit3 className="w-8 h-8 text-white" strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-semibold uppercase tracking-tighter italic leading-none">Update <span className="text-indigo-100 underline decoration-4 underline-offset-8">Entity</span></h2>
                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-[0.3em] mt-3 opacity-80 italic">Revision Hash: {category.id.slice(0,12).toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10 bg-[#fffcf9]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-4">
                        <label className="text-[10px] font-semibold text-gray-600 uppercase  flex items-center gap-2">
                            <ImageIcon size={14} /> Visual Asset
                        </label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group aspect-square rounded-[44px] border-4 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all shadow-inner overflow-hidden"
                        >
                            {(previewImage || currentImageUrl) ? (
                                <>
                                    <img src={previewImage || currentImageUrl || ""} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Loader2 className={cn("text-white w-10 h-10", uploadingImage ? "animate-spin" : "hidden")} />
                                        <span className="text-white text-[10px] font-semibold uppercase tracking-widest">Swap Identity</span>
                                    </div>
                                    {uploadingImage && (
                                        <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Plus size={48} className="text-gray-200 group-hover:text-indigo-400 transition-colors" />
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-semibold text-gray-600 uppercase  flex items-center gap-2">
                                <Layout size={14} /> Metadata Configuration
                            </label>
                            <input 
                                name="name" value={formData.name} onChange={handleInputChange}
                                placeholder="Entity Name *"
                                className={cn("w-full px-6 py-4 bg-white border-2 rounded-2xl text-sm font-bold outline-none transition-all", errors.name ? "border-rose-500 shadow-rose-50" : "border-gray-100 focus:border-indigo-500 shadow-sm")}
                            />
                            <div className="flex items-center gap-3 px-6 py-4 bg-gray-100 rounded-2xl border-2 border-gray-100">
                                <Activity size={16} className="text-gray-600" />
                                <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Public Endpoint:</span>
                                <code className="text-xs font-semibold text-indigo-600">/{formData.slug}</code>
                            </div>
                            <textarea 
                                name="description" value={formData.description} onChange={handleInputChange}
                                placeholder="Classification details..."
                                rows={4}
                                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-[32px] text-sm font-bold outline-none focus:border-indigo-500 shadow-sm resize-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Hierarchy & Logic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-4">
                        <label className="text-[10px] font-semibold text-gray-600 uppercase  flex items-center gap-2">
                            <Layers size={14} /> Node Hierarchy
                        </label>
                        <div className="relative">
                            <select 
                                name="parentId" value={formData.parentId || ""} onChange={handleInputChange}
                                className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none appearance-none focus:border-purple-500 shadow-sm transition-all"
                            >
                                <option value="">Genesis Node (Root)</option>
                                {parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-semibold text-gray-600 uppercase  flex items-center gap-2">
                            <Activity size={14} /> Network State
                        </label>
                        <button 
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                            className={cn(
                                "w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all shadow-sm",
                                formData.active ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
                            )}
                        >
                            <span className="text-sm font-semibold uppercase tracking-widest">{formData.active ? "Operational" : "Offline"}</span>
                            <div className={cn("w-12 h-6 rounded-full relative transition-all duration-500 p-1", formData.active ? "bg-emerald-500" : "bg-rose-500")}>
                                <div className={cn("w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md", formData.active ? "ml-auto" : "ml-0")} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Section 3: Shipping Restrictions (Custom Select replacement) */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={18}/></div>
                        <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-tighter italic text-[11px] font-semibold text-gray-600 uppercase tracking-[0.2em]">Shipping <span className="text-blue-600">Protocol</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[40px] border-2 border-gray-100 shadow-sm">
                        <div className="space-y-2">
                            <label className="text-[9px] font-semibold text-gray-600 uppercase  ml-2 leading-none mb-1.5">Restriction Type</label>
                            <select 
                                value={formData.defaultShippingRestrictions?.restrictionType}
                                onChange={(e) => setFormData(p => ({ ...p, defaultShippingRestrictions: { ...p.defaultShippingRestrictions!, restrictionType: e.target.value as any }}))}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none appearance-none"
                            >
                                <option value="NONE">No Restrictions</option>
                                <option value="COUNTRIES">By Country Whitelist</option>
                                <option value="LOCAL_RADIUS">Local Geo-fencing (KM)</option>
                            </select>
                        </div>

                        {formData.defaultShippingRestrictions?.restrictionType === 'LOCAL_RADIUS' && (
                            <div className="space-y-2 animate-in slide-in-from-right">
                                <label className="text-[9px] font-semibold text-gray-600 uppercase  ml-2 leading-none mb-1.5">Radius Threshold (KM)</label>
                                <input 
                                    type="number" placeholder="Enter KM..."
                                    value={formData.defaultShippingRestrictions?.maxShippingRadiusKm || ""}
                                    className="w-full px-6 py-4 bg-blue-50 border-none rounded-2xl text-sm font-bold outline-none text-blue-700"
                                    onChange={(e) => setFormData(p => ({ ...p, defaultShippingRestrictions: { ...p.defaultShippingRestrictions!, maxShippingRadiusKm: Number(e.target.value) }}))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-10 border-t border-gray-100">
                    <button 
                        type="button" onClick={handleCancelAction}
                        className="w-full sm:w-auto px-10 py-4 bg-gray-50 text-gray-600 rounded-2xl font-semibold uppercase  text-[10px] hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Discard Revisions
                    </button>
                    <button 
                        type="submit" disabled={loading}
                        className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white rounded-2xl font-semibold uppercase  text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle2 size={16}/> Push Revisions</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
