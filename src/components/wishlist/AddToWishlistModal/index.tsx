'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
    Heart, Plus, CheckCircle2, Star, DollarSign, FileText, ShoppingCart, Sparkles, Loader2,
} from 'lucide-react';

import { useWishlist } from '@/hooks/useWishlist';
import { usePresignedUpload } from '@/hooks/usePresignedUpload';
import { UploadContext } from '@/types/storage/storage.types';
import { toPublicUrl } from '@/utils/storage/url';
import { toSizedVariant } from '@/utils/products/media.helpers';
import type {
    WishlistSummaryResponse,
    CreateWishlistRequest,
    AddToWishlistRequest,
} from '@/types/wishlist/wishlist.types';
import { PRIORITY_TEXT } from '@/types/wishlist/wishlist.types';
import type {
    PublicProductDetailDTO,
    PublicProductVariantDTO,
} from '@/types/product/public-product.dto';
import {
    resolveMediaUrl as resolveMediaUrlHelper,
    resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from '@/utils/products/media.helpers';
import Image from 'next/image';
import { CustomButton } from '@/components/button';
import { ModalWrapper } from '@/components/modalWrapper';
import { cn } from '@/utils/cn';
import { FormErrors,WishlistFormData,CustomUploadFile,AddToWishlistModalProps } from '../type';


const CustomSpin: React.FC<{ spinning: boolean; children: React.ReactNode }> = ({ spinning, children }) => {
    if (spinning) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50px]">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
        );
    }
    return <>{children}</>;
};

const CustomInput: React.FC<any> = ({ label, name, value, onChange, placeholder, type = 'text', required, className, ...rest }) => (
    <div className={cn("mb-1.5", className)}>
        <label className="text-xs sm:text-sm font-medium block mb-1" htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition duration-150 h-7 sm:h-8 md:h-9"
            {...rest}
        />
    </div>
);

const CustomSelect: React.FC<any> = ({ label, name, value, onChange, children, className, ...rest }) => (
    <div className={cn("mb-1.5", className)}>
        <label className="text-xs sm:text-sm font-medium block mb-1" htmlFor={name}>{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition duration-150 h-7 sm:h-8 md:h-9 bg-white"
            {...rest}
        >
            {children}
        </select>
    </div>
);


export const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({
    open,
    onCancel,
    onSuccess,
    product,
    defaultVariantId,
}) => {
    const [formData, setFormData] = useState<WishlistFormData>({
        wishlistId: '',
        variantId: '',
        quantity: 1,
        priority: 0,
        newWishlistName: '',
        newWishlistDescription: '',
        desiredPrice: '',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: WishlistFormData) => ({ ...prev, [name]: value }));
        
        if (formErrors[name]) {
            setFormErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
        }
    };
    
    const setFieldValue = (name: keyof WishlistFormData, value: any) => {
        setFormData((prev: WishlistFormData) => ({ ...prev, [name]: value }));
    };
    
    const validateFields = (fields: string[]) => {
        const errors: any = {};
        let isValid = true;
        
        fields.forEach(name => {
            const value = formData[name];
            if (name === 'wishlistId' && !value) {
                errors[name] = 'Vui lòng chọn wishlist';
                isValid = false;
            }
            if (name === 'newWishlistName' && (!value || value.trim() === '')) {
                errors[name] = 'Vui lòng nhập tên wishlist';
                isValid = false;
            }
        });
        
        setFormErrors(errors);
        return isValid ? formData : null;
    };
    
    const resetFields = () => {
        setFormData({
            wishlistId: '',
            variantId: '',
            quantity: 1,
            priority: 0,
            newWishlistName: '',
            newWishlistDescription: '',
            desiredPrice: '',
            notes: '',
        });
        setFormErrors({});
    };

  const {
        getBuyerWishlists,
        createWishlist,
        addToWishlist,
        isProductInWishlist,
        loading,
    } = useWishlist();

    const { uploadFile: uploadPresigned, uploading: uploadingImage } = usePresignedUpload();    
    const [wishlists, setWishlists] = useState<WishlistSummaryResponse[]>([]);
    const [loadingWishlists, setLoadingWishlists] = useState(false);
    const [creatingWishlist, setCreatingWishlist] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [variantInWishlist, setVariantInWishlist] = useState<Map<string, boolean>>(new Map());
    const [submitting, setSubmitting] = useState(false);
    
    const [imageFile, setImageFile] = useState<CustomUploadFile | null>(null); 
    const [previewImage, setPreviewImage] = useState<string>('');
    const [coverImageAssetId, setCoverImageAssetId] = useState<string>('');

    useEffect(() => {
        if (open) {
            const y = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${y}px`;
            document.body.style.width = '100%';
            
            return () => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, y);
            };
        }
    }, [open]);

    // 2. Load Wishlists and Set Default Variant
    useEffect(() => {
        if (open && product) {
            loadWishlists();
            if (product.variants && product.variants.length > 0) {
                const defaultVariant = defaultVariantId
                    ? product.variants.find(v => v.id === defaultVariantId)
                    : product.variants[0];
                if (defaultVariant) {
                    setSelectedVariantId(defaultVariant.id);
                    setFieldValue('variantId', defaultVariant.id);
                }
            }
        } else {
            resetFields();
            setShowCreateForm(false);
            setSelectedVariantId(null);
            setVariantInWishlist(new Map());
            setImageFile(null);
            setPreviewImage('');
            setCoverImageAssetId('');
        }
    }, [open, product, defaultVariantId]);

    // 3. Set Default Wishlist
    useEffect(() => {
        if (open && wishlists.length > 0) {
            const currentWishlistId = formData.wishlistId;
            if (!currentWishlistId) {
                const defaultWishlist = wishlists.find(w => w.isDefault) || wishlists[0];
                if (defaultWishlist) {
                    setFieldValue('wishlistId', defaultWishlist.id);
                    setFormErrors(prev => ({ ...prev, wishlistId: undefined }));
                }
            }
        }
    }, [wishlists, open, formData.wishlistId]);

    // 4. Check Variants in Wishlist
    useEffect(() => {
        if (open && product && product.variants && product.variants.length > 0) {
            checkVariantsInWishlist();
        }
    }, [open, product, wishlists]);

    // ... (loadWishlists, checkVariantsInWishlist logic giữ nguyên) ...
    const loadWishlists = useCallback(async () => {
        setLoadingWishlists(true);
        try {
            const result = await getBuyerWishlists({ page: 0, size: 100 });
            if (result.success && result.data) {
                const loadedWishlists = result.data.content || [];
                setWishlists(loadedWishlists);
            }
        } catch (error) {
            console.error('Error loading wishlists:', error);
        } finally {
            setLoadingWishlists(false);
        }
    }, [getBuyerWishlists]);

    const checkVariantsInWishlist = useCallback(async () => {
        if (!product?.variants || product.variants.length === 0) return;

        const variantIds = product.variants.map(v => v.id);
        const checkMap = new Map<string, boolean>();

        for (const variantId of variantIds) {
            try {
                const inWishlist = await isProductInWishlist(variantId);
                checkMap.set(variantId, inWishlist);
            } catch (error) {
                checkMap.set(variantId, false);
            }
        }

        setVariantInWishlist(checkMap);
    }, [product, isProductInWishlist]);



    const beforeUpload = useCallback((file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            toast.error('Chỉ chấp nhận file hình ảnh!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            toast.error('Hình ảnh phải nhỏ hơn 5MB!');
            return false;
        }

        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);

        const fileUid = `upload-${Date.now()}`;
        setImageFile({
            uid: fileUid,
            name: file.name,
            status: 'uploading',
            url: localUrl,
            originFileObj: file as any,
        });

        handleImageUpload(file);
        return false;
    }, []);

   const handleImageUpload = useCallback(async (file: File) => {
        try {
            const res = await uploadPresigned(file, UploadContext.WISHLIST_COVER);

            if (!res.assetId) {
                throw new Error('Upload thất bại - không có assetId');
            }

            setCoverImageAssetId(res.assetId);

            let finalImageUrl = res.finalUrl;
            if (!finalImageUrl && res.path) {
                const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
                const ext = extension === 'jpeg' ? 'jpg' : extension;
                const rawPath = `${res.path.replace(/^pending\//, 'public/')}.${ext}`;
                const sizedPath = toSizedVariant(rawPath, '_orig');
                finalImageUrl = sizedPath;
            }

            if (finalImageUrl) {
                const publicUrl = finalImageUrl.startsWith('http')
                    ? finalImageUrl
                    : toPublicUrl(finalImageUrl);

                setPreviewImage(publicUrl);

                setImageFile((prev: CustomUploadFile | null) => prev ? { 
                    ...prev,
                    status: 'done',
                    url: publicUrl,
                } : null);
            } else {
                setImageFile((prev: CustomUploadFile | null) => prev ? {
                    ...prev,
                    status: 'done',
                } : null);
            }

            toast.success('Upload ảnh thành công!');
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(err?.message || 'Upload ảnh thất bại');
            setImageFile((prev: CustomUploadFile | null) => prev ? { ...prev, status: 'error' } : null);
        }
    }, [uploadPresigned]);

    const handleRemoveImage = useCallback(() => {
        setImageFile(null);
        setPreviewImage('');
        setCoverImageAssetId('');
    }, []);


    const handleCreateWishlist = useCallback(async (values: CreateWishlistRequest) => {
        setCreatingWishlist(true);
        try {
            const result = await createWishlist({
                ...values,
                coverImageAssetId: coverImageAssetId || undefined,
            });
            if (result.success && result.data) {
                toast.success('Đã tạo wishlist thành công'); // ✅ Thay thế message.success
                await loadWishlists();
                setFieldValue('wishlistId', result.data.id);
                setFormErrors(prev => ({ ...prev, wishlistId: undefined }));
                setShowCreateForm(false);
                setImageFile(null);
                setPreviewImage('');
                setCoverImageAssetId('');
            } else {
                toast.error(result.error || 'Không thể tạo wishlist'); // ✅ Thay thế message.error
            }
        } catch (error: any) {
            toast.error(error?.message || 'Không thể tạo wishlist'); // ✅ Thay thế message.error
        } finally {
            setCreatingWishlist(false);
        }
    }, [createWishlist, loadWishlists, coverImageAssetId]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn form submit mặc định
        
        if (!product || !selectedVariantId) {
            toast.warning('Vui lòng chọn variant'); // ✅ Thay thế message.warning
            return;
        }
        
        const validData = validateFields(['wishlistId', 'quantity', 'priority']);
        if (!validData) return;

        setSubmitting(true);
        try {
            const wishlistId = formData.wishlistId;
            if (!wishlistId) {
                toast.warning('Vui lòng chọn wishlist'); // ✅ Thay thế message.warning
                return;
            }

            const requestData: AddToWishlistRequest = {
                variantId: selectedVariantId,
                quantity: formData.quantity || 1,
                desiredPrice: formData.desiredPrice ? parseFloat(String(formData.desiredPrice).replace(/\./g, '')) : undefined,
                notes: formData.notes || undefined,
                priority: formData.priority || 0,
            };

            const result = await addToWishlist(wishlistId, requestData);
            if (result.success) {
                toast.success('Đã thêm vào wishlist thành công'); // ✅ Thay thế message.success
                onSuccess?.();
                onCancel();
            } else {
                toast.error(result.error || 'Không thể thêm vào wishlist'); // ✅ Thay thế message.error
            }
        } catch (error: any) {
            toast.error(error?.message || 'Không thể thêm vào wishlist'); // ✅ Thay thế message.error
        } finally {
            setSubmitting(false);
        }
    }, [product, selectedVariantId, addToWishlist, onSuccess, onCancel, formData]);

    const formatPrice = (price: number) => {
        const formatted = new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
        return `${formatted} ₫`;
    };
    
    
    const getVariantDisplayName = (variant: PublicProductVariantDTO) => {
        if (variant.optionValues && variant.optionValues.length > 0) {
            return variant.optionValues.map(ov => ov.name).join(' / ');
        }
        return `SKU: ${variant.sku}`;
    };

    if (!product) return null;

    const hasVariants = product.variants && product.variants.length > 0;

    return (
        <ModalWrapper
            open={open}
            onCancel={onCancel}
            title={
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-md opacity-50 animate-pulse" />
                        <Heart className="relative w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />
                    </div>
                    <h4 className="!mb-0 text-base sm:!text-lg font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent leading-tight truncate min-w-0 flex-1">
                        Thêm vào yêu thích
                    </h4>
                </div>
            }
        >
            <form onSubmit={handleSubmit}>
                {/* Variant Selection - Grid Layout */}
                {hasVariants && (
                    <div className="mb-4">
                        <label className="text-xs sm:text-sm font-medium block mb-2">
                            Chọn phiên bản <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto overflow-x-hidden">
                            {product.variants!.map((variant) => {
                                const isInWishlist = variantInWishlist.get(variant.id) || false;
                                const isSelected = selectedVariantId === variant.id;

                                const variantImageUrl = resolveVariantImageUrlHelper(variant, '_thumb');
                                const fallbackImage = product.media?.find(m => m.isPrimary && m.type === 'IMAGE')
                                    || product.media?.find(m => m.type === 'IMAGE')
                                    || product.media?.[0];
                                const fallbackImageUrl = fallbackImage ? resolveMediaUrlHelper(fallbackImage, '_thumb') : null;
                                const displayImageUrl = variantImageUrl || fallbackImageUrl;

                                return (
                                    <div
                                        key={variant.id}
                                        onClick={() => {
                                            setSelectedVariantId(variant.id);
                                            setFieldValue('variantId', variant.id);
                                        }}
                                        className={cn(
                                            "relative p-2 rounded border-2 transition-all cursor-pointer overflow-hidden",
                                            isSelected
                                                ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-red-50 shadow-sm ring-1 ring-pink-200'
                                                : 'border-gray-200 hover:border-pink-300 hover:shadow-sm bg-white'
                                        )}
                                    >
                                        <div className="w-full aspect-square rounded overflow-hidden bg-gray-100 mb-1">
                                            {displayImageUrl ? (
                                                <Image
                                                    src={displayImageUrl}
                                                    alt={getVariantDisplayName(variant)}
                                                    width={100} 
                                                    height={100}
                                                    className="w-full h-full object-cover"
                                                    unoptimized // Vô hiệu hóa tối ưu hóa Next Image cho ảnh bên ngoài (nếu chưa config next.config.js)
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs font-medium text-gray-700 mb-0.5 text-center break-words line-clamp-2 min-h-[2rem] px-0.5 leading-tight">
                                            {getVariantDisplayName(variant)}
                                        </div>
                                        <div className="flex items-center justify-center gap-1 flex-wrap">
                                            <span className="text-xs font-bold text-orange-600 break-words text-center leading-tight">
                                                {formatPrice(variant.price)}
                                            </span>
                                            {isInWishlist && (
                                                <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                            )}
                                        </div>

                                        {isSelected && (
                                            <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
                                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Wishlist Selection */}
               <div className="mb-4">
                    <CustomSpin spinning={loadingWishlists}>
                        <CustomSelect
                            label="Wishlist"
                            name="wishlistId"
                            value={formData.wishlistId}
                            onChange={(e: any) => setFieldValue('wishlistId', e.target.value)}
                            required
                            disabled={showCreateForm}
                        >
                            <option value="" disabled>Chọn wishlist</option>
                            {wishlists.map((wishlist) => (
                                <option key={wishlist.id} value={wishlist.id}>
                                    {wishlist.name} {wishlist.isDefault && '(Mặc định)'} ({wishlist.itemCount})
                                </option>
                            ))}
                        </CustomSelect>
                        {formErrors.wishlistId && <p className="text-red-500 text-xs mt-1">{formErrors.wishlistId}</p>}
                    </CustomSpin>
                </div>
                
                {/* Create New Wishlist Button */}
                <div className="mb-4">
                    {!showCreateForm ? (
                        <CustomButton
                            type="dashed"
                            icon={<Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                            onClick={() => setShowCreateForm(true)}
                            className="w-full !h-8"
                        >
                            Tạo wishlist mới
                        </CustomButton>
                    ) : (
                        <div className="mb-2 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                            {/* Cover Image Upload (Simplified) */}
                            <div className="mb-2">
                                <label className="block mb-1 text-xs font-medium text-gray-700">Ảnh bìa (Tùy chọn)</label>
                                <div className="relative inline-block">
                                    {/* Upload Area */}
                                    {!imageFile && (
                                        <label 
                                            htmlFor="wishlist-cover-upload"
                                            className={cn(
                                                "w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-50 transition duration-150",
                                                uploadingImage && "opacity-60 cursor-wait"
                                            )}
                                        >
                                            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-pink-500" /> : <Plus className="w-4 h-4 text-gray-500" />}
                                            <span className="text-[10px] text-gray-600 mt-0.5">{uploadingImage ? 'Tải...' : 'Tải ảnh'}</span>
                                            <input
                                                id="wishlist-cover-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => { if (e.target.files) beforeUpload(e.target.files[0]) }}
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    )}
                                    
                                    {previewImage && (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-300">
                                            <Image src={previewImage} alt="Preview" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                                            <button 
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-0 right-0 p-1 bg-black/60 text-white rounded-bl-lg"
                                                aria-label="Remove image"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                            {imageFile?.status === 'uploading' && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <CustomInput
                                label="Tên wishlist"
                                name="newWishlistName"
                                value={formData.newWishlistName}
                                onChange={handleFormChange}
                                required
                                placeholder="Nhập tên wishlist"
                                maxLength={100}
                            />
                            {formErrors.newWishlistName && <p className="text-red-500 text-xs mt-1">{formErrors.newWishlistName}</p>}

                            <div className="mb-4">
                                <label className="text-xs sm:text-sm font-medium block mb-1" htmlFor="newWishlistDescription">Mô tả</label>
                                <textarea
                                    id="newWishlistDescription"
                                    name="newWishlistDescription"
                                    rows={2}
                                    value={formData.newWishlistDescription}
                                    onChange={handleFormChange}
                                    placeholder="Mô tả (tùy chọn)"
                                    maxLength={500}
                                    className="w-full px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition duration-150"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <CustomButton
                                    type="primary"
                                    loading={creatingWishlist}
                                    onClick={async () => {
                                        const values = validateFields(['newWishlistName', 'newWishlistDescription']);
                                        if (values) {
                                            await handleCreateWishlist({
                                                name: values.newWishlistName,
                                                description: values.newWishlistDescription,
                                                isPublic: false,
                                            });
                                        }
                                    }}
                                    className="flex-1 !h-8 !text-sm"
                                >
                                    Tạo
                                </CustomButton>
                                <CustomButton
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        // Reset new wishlist fields
                                        setFieldValue('newWishlistName', '');
                                        setFieldValue('newWishlistDescription', '');
                                        handleRemoveImage(); 
                                    }}
                                    className="flex-1 !h-8 !text-sm"
                                >
                                    Hủy
                                </CustomButton>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-gray-200 my-4" /> {/* Thay thế Antd Divider */}

                {/* Additional Options */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <CustomInput
                        label="Số lượng"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        min={1}
                        max={999}
                    />

                    <CustomSelect
                        label="Độ ưu tiên"
                        name="priority"
                        value={formData.priority}
                        onChange={handleFormChange}
                    >
                        <option value={0}>{PRIORITY_TEXT[0]}</option>
                        <option value={1}>{PRIORITY_TEXT[1]}</option>
                        <option value={2}>{PRIORITY_TEXT[2]}</option>
                    </CustomSelect>
                </div>

                <details className="group border border-gray-200 rounded-lg mb-4">
                    <summary className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-pink-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Tùy chọn bổ sung</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-500 transform group-open:rotate-180 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="p-3 space-y-3 bg-white">
                        <CustomInput
                            label={<div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-orange-500" /> <span className="text-xs">Giá mong muốn</span></div>}
                            name="desiredPrice"
                            type="text" 
                            value={formData.desiredPrice}
                            onChange={handleFormChange}
                            placeholder="Nhập giá mong muốn"
                            className="mb-0"
                        />

                        <div className="mb-0">
                            <label className="text-xs sm:text-sm font-medium block mb-1">
                                <div className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-blue-500" /> <span className="text-xs">Ghi chú</span></div>
                            </label>
                            <textarea
                                name="notes"
                                rows={2}
                                value={formData.notes}
                                onChange={handleFormChange}
                                placeholder="Ghi chú (tùy chọn)"
                                maxLength={500}
                                className="w-full px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition duration-150"
                            />
                        </div>
                    </div>
                </details>

                <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-gray-100 -mx-3 sm:-mx-5 px-3 sm:px-5 mt-4 z-10">
                    <div className="flex items-center justify-end gap-2 w-full">
                        <CustomButton
                            onClick={onCancel}
                            className="flex-1 sm:flex-initial !text-sm !h-9"
                        >
                            Hủy
                        </CustomButton>
                        <CustomButton
                            type="primary"
                            htmlType="submit"
                            loading={submitting || loading}
                            className="flex-1 sm:flex-initial !text-sm !h-9 min-w-[150px]"
                            icon={<Heart className="w-4 h-4 fill-white" />}
                        >
                            Thêm vào wishlist
                        </CustomButton>
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default AddToWishlistModal;