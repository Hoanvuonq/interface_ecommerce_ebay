// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Upload, Image, message as antdMessage, Select } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import type { UploadFile } from "antd";
// import { useCreateCategory,useGetAllParents } from "@/app/manager/_hooks/useCategory";
// import { CreateCategoryRequest } from "@/types/categories/category.create";
// import { CategoryResponse ,ShippingRestrictionsDTO} from "@/types/categories/category.detail";
// import { usePresignedUpload } from "@/hooks/usePresignedUpload";
// import { UploadContext } from "@/types/storage/storage.types";
// import { toPublicUrl } from "@/utils/storage/url";
// import { toSizedVariant } from "@/utils/products/media.helpers";

// interface CreateFormProps {
//     onSuccess?: () => void;
//     onCancel?: () => void;
// }

// // Danh sách quốc gia phổ biến (ISO 3166-1 alpha-2)
// const COUNTRIES = [
//     { value: 'US', label: 'United States (US)' },
//     { value: 'VN', label: 'Vietnam (VN)' },
//     { value: 'CN', label: 'China (CN)' },
//     { value: 'JP', label: 'Japan (JP)' },
//     { value: 'KR', label: 'South Korea (KR)' },
//     { value: 'GB', label: 'United Kingdom (GB)' },
//     { value: 'DE', label: 'Germany (DE)' },
//     { value: 'FR', label: 'France (FR)' },
//     { value: 'IT', label: 'Italy (IT)' },
//     { value: 'ES', label: 'Spain (ES)' },
//     { value: 'CA', label: 'Canada (CA)' },
//     { value: 'AU', label: 'Australia (AU)' },
//     { value: 'NZ', label: 'New Zealand (NZ)' },
//     { value: 'SG', label: 'Singapore (SG)' },
//     { value: 'MY', label: 'Malaysia (MY)' },
//     { value: 'TH', label: 'Thailand (TH)' },
//     { value: 'ID', label: 'Indonesia (ID)' },
//     { value: 'PH', label: 'Philippines (PH)' },
//     { value: 'IN', label: 'India (IN)' },
//     { value: 'BR', label: 'Brazil (BR)' },
//     { value: 'MX', label: 'Mexico (MX)' },
//     { value: 'AR', label: 'Argentina (AR)' },
//     { value: 'NL', label: 'Netherlands (NL)' },
//     { value: 'BE', label: 'Belgium (BE)' },
//     { value: 'CH', label: 'Switzerland (CH)' },
//     { value: 'AT', label: 'Austria (AT)' },
//     { value: 'SE', label: 'Sweden (SE)' },
//     { value: 'NO', label: 'Norway (NO)' },
//     { value: 'DK', label: 'Denmark (DK)' },
//     { value: 'FI', label: 'Finland (FI)' },
//     { value: 'PL', label: 'Poland (PL)' },
//     { value: 'RU', label: 'Russia (RU)' },
//     { value: 'TR', label: 'Turkey (TR)' },
//     { value: 'AE', label: 'United Arab Emirates (AE)' },
//     { value: 'SA', label: 'Saudi Arabia (SA)' },
//     { value: 'ZA', label: 'South Africa (ZA)' },
// ];

// // Danh sách khu vực phổ biến
// const REGIONS = [
//     { value: 'EU', label: 'European Union (EU)' },
//     { value: 'APAC', label: 'Asia-Pacific (APAC)' },
//     { value: 'NA', label: 'North America (NA)' },
//     { value: 'SA', label: 'South America (SA)' },
//     { value: 'MEA', label: 'Middle East & Africa (MEA)' },
//     { value: 'ASEAN', label: 'ASEAN' },
//     { value: 'EURO', label: 'Europe (EURO)' },
//     { value: 'LATAM', label: 'Latin America (LATAM)' },
//     { value: 'ANZ', label: 'Australia & New Zealand (ANZ)' },
//     { value: 'GCC', label: 'Gulf Cooperation Council (GCC)' },
// ];

// const CreateForm: React.FC<CreateFormProps> = ({ onSuccess, onCancel }) => {
//     const [formData, setFormData] = useState<CreateCategoryRequest>({
//         name: "",
//         description: "",
//         parentId: undefined,
//         active: true,
//         defaultShippingRestrictions: {
//             restrictionType: 'NONE',
//             countryRestrictionType: 'ALLOW_ONLY',
//             restrictedCountries: [],
//             restrictedRegions: [],
//         },
//     });

//     const [slug, setSlug] = useState<string>("");
//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [parentCategories, setParentCategories] = useState<CategoryResponse[]>([]);
//     const [imageFile, setImageFile] = useState<UploadFile | null>(null);
//     const [previewImage, setPreviewImage] = useState<string>("");
//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const isInitialMount = useRef(true);

//     const { handleCreateCategory, loading, error } = useCreateCategory(formData);
//     const { handleGetAllParents, loading: loadingParents, error: errorParents } = useGetAllParents();
//     const { uploadFile: uploadPresigned, uploading: uploadingImage } = usePresignedUpload();

//     // Load parent categories for dropdown - chỉ load 1 lần, tránh double render trong Strict Mode
//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//             loadParentCategories();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []); // Empty deps - chỉ chạy 1 lần khi mount

//     const loadParentCategories = async () => {
//         const data = await handleGetAllParents();
//         if (data) {
//             // Kiểm tra nếu data là array
//             if (Array.isArray(data)) {
//                 setParentCategories(data);
//             } else if (typeof data === 'object' && 'data' in data && Array.isArray((data as { data: CategoryResponse[] }).data)) {
//                 // Nếu data có cấu trúc { data: [...] }
//                 setParentCategories((data as { data: CategoryResponse[] }).data);
//             } else if (typeof data === 'object' && 'categories' in data && Array.isArray((data as { categories: CategoryResponse[] }).categories)) {
//                 // Nếu data có cấu trúc { categories: [...] }
//                 setParentCategories((data as { categories: CategoryResponse[] }).categories);
//             } else {
//                 setParentCategories([]);
//             }
//         } else {
//             setParentCategories([]);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;

//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//         }));

//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ""
//             }));
//         }
//     };

//     const validateForm = (): boolean => {
//         const newErrors: Record<string, string> = {};

//         if (!formData.name.trim()) {
//             newErrors.name = "Tên danh mục là bắt buộc";
//         } else if (formData.name.trim().length < 2) {
//             newErrors.name = "Tên danh mục phải có ít nhất 2 ký tự";
//         }

//         if (slug && slug.trim()) {
//             const slugRegex = /^[a-z0-9-]+$/;
//             if (!slugRegex.test(slug.trim())) {
//                 newErrors.slug = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang";
//             }
//         }

//         if (formData.description && formData.description.trim().length > 500) {
//             newErrors.description = "Mô tả không được vượt quá 500 ký tự";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         const result = await handleCreateCategory();

//         if (result) {
//             // Hiển thị thông báo thành công
//             antdMessage.success("Tạo danh mục thành công!");

//             // Reset form
//             setFormData({
//                 name: "",
//                 description: "",
//                 parentId: undefined,
//                 active: true,
//                 imageAssetId: undefined,
//                 defaultShippingRestrictions: {
//                     restrictionType: 'NONE',
//                     countryRestrictionType: 'ALLOW_ONLY',
//                     restrictedCountries: [],
//                     restrictedRegions: [],
//                 },
//             });
//             setSlug("");
//             // Clean up local URL if exists
//             if (localPreviewUrl) {
//                 URL.revokeObjectURL(localPreviewUrl);
//                 setLocalPreviewUrl(null);
//             }
//             setImageFile(null);
//             setPreviewImage("");
//             setUploadProgress(0);

//             // Call success callback
//             if (onSuccess) {
//                 onSuccess();
//             }
//         }
//     };

//     const handleCancel = () => {
//         if (onCancel) {
//             onCancel();
//         }
//     };

//     const beforeUpload = (file: File) => {
//         const isImage = file.type.startsWith('image/');
//         if (!isImage) {
//             antdMessage.error('Chỉ chấp nhận file hình ảnh!');
//             return Upload.LIST_IGNORE;
//         }
//         const isLt5M = file.size / 1024 / 1024 < 5;
//         if (!isLt5M) {
//             antdMessage.error('Hình ảnh phải nhỏ hơn 5MB!');
//             return Upload.LIST_IGNORE;
//         }

//         // Create local preview URL - hiển thị ngay
//         const localUrl = URL.createObjectURL(file);
//         setLocalPreviewUrl(localUrl);
//         setPreviewImage(localUrl);

//         // Set file với status 'done' để hiển thị local preview ngay
//         const fileUid = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//         setImageFile({
//             uid: fileUid,
//             name: file.name,
//             status: 'done', // Hiển thị local preview ngay
//             url: localUrl,
//         } as UploadFile);

//         // Start upload in background
//         handleImageUpload(file);

//         return false; // Prevent default upload
//     };

//     const handleImageUpload = async (file: File) => {
//         const currentLocalUrl = localPreviewUrl; // Capture current local URL

//         try {
//             setUploadProgress(10); // Started

//             // Update file status to 'uploading' để hiển thị loading indicator
//             if (imageFile) {
//                 setImageFile({
//                     ...imageFile,
//                     status: 'uploading',
//                 } as UploadFile);
//             }

//             // Upload via presigned flow với context CATEGORY_IMAGE
//             setUploadProgress(30);
//             const res = await uploadPresigned(file, UploadContext.CATEGORY_IMAGE);

//             setUploadProgress(60);

//             if (!res.assetId) {
//                 throw new Error('Upload thất bại - không có assetId');
//             }

//             // Update form với imageAssetId
//             setFormData(prev => ({
//                 ...prev,
//                 imageAssetId: res.assetId,
//             }));

//             setUploadProgress(80);

//             // Wait for final URL if available
//             let finalImageUrl = res.finalUrl;
//             if (!finalImageUrl && res.path) {
//                 // Build URL from path if finalUrl not available yet
//                 const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
//                 const ext = extension === 'jpeg' ? 'jpg' : extension;
//                 const rawPath = `${res.path.replace(/^pending\//, 'public/')}.${ext}`;
//                 const sizedPath = toSizedVariant(rawPath, '_orig');
//                 finalImageUrl = sizedPath; // Will be converted by toPublicUrl in display
//             }

//             setUploadProgress(95);

//             // Update states - chuyển sang server image
//             if (finalImageUrl) {
//                 // Use toPublicUrl helper if needed
//                 const publicUrl = finalImageUrl.startsWith('http')
//                     ? finalImageUrl
//                     : toPublicUrl(finalImageUrl);

//                 // Small delay to show progress before switching
//                 await new Promise(resolve => setTimeout(resolve, 300));

//                 // Clean up local preview
//                 if (currentLocalUrl) {
//                     URL.revokeObjectURL(currentLocalUrl);
//                     setLocalPreviewUrl(null);
//                 }

//                 // Update preview và file với server URL
//                 setPreviewImage(publicUrl);

//                 if (imageFile) {
//                     setImageFile({
//                         ...imageFile,
//                         status: 'done', // Upload thành công
//                         url: publicUrl,
//                     } as UploadFile);
//                 }
//             } else {
//                 // Keep local preview if no server URL yet
//                 if (imageFile) {
//                     setImageFile({
//                         ...imageFile,
//                         status: 'done',
//                         url: currentLocalUrl || '',
//                     } as UploadFile);
//                 }
//             }

//             setUploadProgress(100);

//             setTimeout(() => {
//                 setUploadProgress(0);
//             }, 1000);

//             antdMessage.success('Upload ảnh thành công!');
//         } catch (err: unknown) {
//             console.error('Upload error:', err);
//             const errorMessage = err instanceof Error ? err.message : 'Upload ảnh thất bại';
//             antdMessage.error(errorMessage);

//             // Clean up on error
//             if (currentLocalUrl) {
//                 URL.revokeObjectURL(currentLocalUrl);
//                 setLocalPreviewUrl(null);
//             }

//             setImageFile(null);
//             setPreviewImage("");
//             setUploadProgress(0);
//         }
//     };

//     const handleImageChange = (info: { file: UploadFile }) => {
//         const { file } = info;

//         if (file.status === 'removed') {
//             // Clean up local URL if exists
//             if (localPreviewUrl) {
//                 URL.revokeObjectURL(localPreviewUrl);
//                 setLocalPreviewUrl(null);
//             }
//             setImageFile(null);
//             setPreviewImage("");
//             setFormData(prev => ({
//                 ...prev,
//                 imageAssetId: undefined,
//             }));
//             setUploadProgress(0);
//         }
//     };

//     const handlePreview = async (file: UploadFile) => {
//         if (!file.url && !file.preview) {
//             if (file.originFileObj) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     const result = reader.result as string;
//                     setPreviewImage(result);
//                     setPreviewOpen(true);
//                 };
//                 reader.readAsDataURL(file.originFileObj);
//             }
//         } else {
//             const imageUrl = file.url || (file.preview as string) || previewImage;
//             setPreviewImage(imageUrl);
//             setPreviewOpen(true);
//         }
//     };

//     return (
//         <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-w-6xl mx-auto">
//             {/* Header với gradient */}
//             <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
//                 <div className="flex items-center space-x-3">
//                     <div className="bg-white/20 rounded-lg p-2">
//                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                     </div>
//                     <div>
//                         <h2 className="text-2xl font-bold text-white">Thêm danh mục mới</h2>
//                         <p className="text-indigo-100 text-sm mt-1">Điền thông tin để tạo danh mục mới</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-8">

//                 {/* Error Message */}
//                 {error && (
//                     <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
//                         <div className="flex">
//                             <div className="flex-shrink-0">
//                                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="ml-3">
//                                 <h3 className="text-sm font-semibold text-red-800">Lỗi tạo danh mục</h3>
//                                 <p className="text-sm text-red-700 mt-1">{error}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Section: Thông tin cơ bản */}
//                     <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//                         <div className="flex items-center space-x-2 mb-4">
//                             <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
//                         </div>

//                         <div className="space-y-5">
//                             {/* Tên danh mục và Slug - cùng hàng */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                                 {/* Tên danh mục */}
//                                 <div>
//                                     <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         <span className="flex items-center">
//                                             Tên danh mục
//                                             <span className="text-red-500 ml-1">*</span>
//                                         </span>
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                                             </svg>
//                                         </div>
//                                         <input
//                                             type="text"
//                                             id="name"
//                                             name="name"
//                                             value={formData.name}
//                                             onChange={handleInputChange}
//                                             className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.name ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 bg-white'
//                                                 }`}
//                                             placeholder="Nhập tên danh mục"
//                                             disabled={loading}
//                                         />
//                                     </div>
//                                     {errors.name && (
//                                         <p className="mt-2 text-sm text-red-600 flex items-center">
//                                             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                             </svg>
//                                             {errors.name}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Slug */}
//                                 <div>
//                                     <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Slug
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                                             </svg>
//                                         </div>
//                                         <input
//                                             type="text"
//                                             id="slug"
//                                             name="slug"
//                                             value={slug}
//                                             onChange={(e) => {
//                                                 setSlug(e.target.value);
//                                                 // Clear error when user starts typing
//                                                 if (errors.slug) {
//                                                     setErrors(prev => ({
//                                                         ...prev,
//                                                         slug: ""
//                                                     }));
//                                                 }
//                                             }}
//                                             className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm ${errors.slug ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 bg-white'
//                                                 }`}
//                                             placeholder="url-friendly-slug (tự động tạo)"
//                                             disabled={loading}
//                                         />
//                                     </div>
//                                     {errors.slug && (
//                                         <p className="mt-2 text-sm text-red-600 flex items-center">
//                                             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                             </svg>
//                                             {errors.slug}
//                                         </p>
//                                     )}
//                                     <p className="mt-2 text-xs text-gray-500">
//                                         Chỉ chứa chữ thường, số và dấu gạch ngang
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Mô tả */}
//                             <div>
//                                 <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
//                                     Mô tả
//                                 </label>
//                                 <textarea
//                                     id="description"
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     rows={4}
//                                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none ${errors.description ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 bg-white'
//                                         }`}
//                                     placeholder="Nhập mô tả cho danh mục"
//                                     disabled={loading}
//                                 />
//                                 {errors.description && (
//                                     <p className="mt-2 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                         </svg>
//                                         {errors.description}
//                                     </p>
//                                 )}
//                                 <p className="mt-2 text-xs text-gray-500 flex items-center justify-between">
//                                     <span className="flex items-center">
//                                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                         </svg>
//                                         Mô tả danh mục
//                                     </span>
//                                     <span className={`font-medium ${(formData.description?.length || 0) > 450 ? 'text-red-500' : 'text-gray-500'}`}>
//                                         {formData.description?.length || 0}/500 ký tự
//                                     </span>
//                                 </p>
//                             </div>

//                             {/* Hình ảnh danh mục */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                     <span className="flex items-center">
//                                         <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                         </svg>
//                                         Hình ảnh danh mục
//                                         <span className="text-gray-400 ml-2 text-xs font-normal">(Tùy chọn)</span>
//                                     </span>
//                                 </label>
//                                 <div className="space-y-3">
//                                     <div className="relative inline-block p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
//                                         <Upload
//                                             listType="picture-card"
//                                             fileList={imageFile ? [imageFile] : []}
//                                             onPreview={handlePreview}
//                                             onChange={handleImageChange}
//                                             beforeUpload={beforeUpload}
//                                             maxCount={1}
//                                             accept="image/*"
//                                             disabled={loading || uploadingImage}
//                                             onRemove={() => {
//                                                 if (localPreviewUrl) {
//                                                     URL.revokeObjectURL(localPreviewUrl);
//                                                     setLocalPreviewUrl(null);
//                                                 }
//                                                 setImageFile(null);
//                                                 setPreviewImage("");
//                                                 setFormData(prev => ({
//                                                     ...prev,
//                                                     imageAssetId: undefined,
//                                                 }));
//                                                 setUploadProgress(0);
//                                             }}
//                                         >
//                                             {imageFile ? null : (
//                                                 <div>
//                                                     <PlusOutlined />
//                                                     <div style={{ marginTop: 8 }}>Upload</div>
//                                                 </div>
//                                             )}
//                                         </Upload>
//                                         {/* Custom loading overlay khi đang upload - overlay lên trên picture-card */}
//                                         {imageFile && imageFile.status === 'uploading' && (
//                                             <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center z-10 pointer-events-none" style={{ width: '104px', height: '104px' }}>
//                                                 <div className="flex flex-col items-center text-white">
//                                                     <svg className="animate-spin h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24">
//                                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                     </svg>
//                                                     <div className="text-xs font-medium text-center px-1">
//                                                         {uploadProgress > 0 ? `${uploadProgress}%` : '...'}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     {previewImage && (
//                                         <Image
//                                             style={{ display: 'none' }}
//                                             alt="preview"
//                                             preview={{
//                                                 visible: previewOpen,
//                                                 src: previewImage,
//                                                 onVisibleChange: (visible) => setPreviewOpen(visible),
//                                             }}
//                                         />
//                                     )}
//                                     <p className="text-xs text-gray-500 flex items-center">
//                                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                         </svg>
//                                         Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB. Kích thước khuyến nghị: 400x400px
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Section: Cấu trúc danh mục */}
//                     <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//                         <div className="flex items-center space-x-2 mb-4">
//                             <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                             </svg>
//                             <h3 className="text-lg font-semibold text-gray-900">Cấu trúc danh mục</h3>
//                         </div>

//                         <div className="space-y-5">
//                             {/* Danh mục cha và Trạng thái - cùng hàng */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                                 {/* Danh mục cha */}
//                                 <div>
//                                     <label htmlFor="parentId" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         <span className="flex items-center">
//                                             Danh mục cha
//                                             <span className="text-gray-400 ml-2 text-xs font-normal">(Tùy chọn)</span>
//                                         </span>
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//                                             </svg>
//                                         </div>
//                                         <select
//                                             id="parentId"
//                                             name="parentId"
//                                             value={formData.parentId || ""}
//                                             onChange={handleInputChange}
//                                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white appearance-none"
//                                             disabled={loading || loadingParents}
//                                         >
//                                             <option value="">-- Chọn danh mục cha --</option>
//                                             {Array.isArray(parentCategories) && parentCategories.length > 0 ? (
//                                                 parentCategories.map((category) => (
//                                                     <option key={category.id} value={category.id}>
//                                                         {category.name}
//                                                         {category.parent && ` (Con của: ${category.parent.name})`}
//                                                     </option>
//                                                 ))
//                                             ) : (
//                                                 <option value="" disabled>
//                                                     {loadingParents ? "Đang tải..." : "Không có danh mục nào"}
//                                                 </option>
//                                             )}
//                                         </select>
//                                     </div>
//                                     {errorParents && (
//                                         <p className="mt-2 text-xs text-red-500 flex items-center">
//                                             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                             </svg>
//                                             Lỗi tải danh mục cha: {errorParents}
//                                         </p>
//                                     )}
//                                     <p className="mt-2 text-xs text-gray-500">
//                                         Để trống nếu đây là danh mục gốc
//                                     </p>
//                                 </div>

//                                 {/* Trạng thái */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Trạng thái
//                                     </label>
//                                     <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 h-[52px]">
//                                         <input
//                                             type="checkbox"
//                                             id="active"
//                                             name="active"
//                                             checked={formData.active}
//                                             onChange={handleInputChange}
//                                             className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
//                                             disabled={loading}
//                                         />
//                                         <label htmlFor="active" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
//                                             <span className="flex items-center">
//                                                 <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                                 </svg>
//                                                 Danh mục hoạt động
//                                             </span>
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Section: Giới hạn giao hàng */}
//                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
//                         <div className="flex items-center space-x-2 mb-4">
//                             <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                             </svg>
//                             <h3 className="text-lg font-semibold text-gray-900">Giới hạn giao hàng</h3>
//                         </div>

//                         <div className="bg-white rounded-lg p-5 border border-blue-100">
//                             {/* Restriction Type và Country Restriction Type - cùng hàng khi COUNTRIES */}
//                             <div className={`grid gap-5 ${formData.defaultShippingRestrictions?.restrictionType === 'COUNTRIES' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
//                                 {/* Restriction Type */}
//                                 <div>
//                                     <label htmlFor="restrictionType" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Loại giới hạn
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                             </svg>
//                                         </div>
//                                         <select
//                                             id="restrictionType"
//                                             name="restrictionType"
//                                             value={formData.defaultShippingRestrictions?.restrictionType || 'NONE'}
//                                             onChange={(e) => {
//                                                 const restrictionType = e.target.value as ShippingRestrictionsDTO['restrictionType'];
//                                                 setFormData(prev => ({
//                                                     ...prev,
//                                                     defaultShippingRestrictions: {
//                                                         ...prev.defaultShippingRestrictions,
//                                                         restrictionType: restrictionType || 'NONE',
//                                                         // Reset các field khác khi chọn NONE
//                                                         ...(restrictionType === 'NONE' && {
//                                                             maxShippingRadiusKm: undefined,
//                                                             countryRestrictionType: 'ALLOW_ONLY',
//                                                             restrictedCountries: [],
//                                                             restrictedRegions: [],
//                                                         }),
//                                                     },
//                                                 }));
//                                             }}
//                                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white appearance-none"
//                                             disabled={loading}
//                                         >
//                                             <option value="NONE">Không giới hạn</option>
//                                             <option value="LOCAL_RADIUS">Bán kính địa phương (km)</option>
//                                             <option value="COUNTRIES">Theo quốc gia</option>
//                                             <option value="REGIONS">Theo khu vực</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 {/* Country Restriction Type - chỉ hiện khi COUNTRIES */}
//                                 {formData.defaultShippingRestrictions?.restrictionType === 'COUNTRIES' && (
//                                     <div>
//                                         <label htmlFor="countryRestrictionType" className="block text-sm font-semibold text-gray-700 mb-2">
//                                             <span className="flex items-center">
//                                                 <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 Loại giới hạn quốc gia
//                                             </span>
//                                         </label>
//                                         <select
//                                             id="countryRestrictionType"
//                                             name="countryRestrictionType"
//                                             value={formData.defaultShippingRestrictions?.countryRestrictionType || 'ALLOW_ONLY'}
//                                             onChange={(e) => {
//                                                 const countryRestrictionType = e.target.value as ShippingRestrictionsDTO['countryRestrictionType'];
//                                                 setFormData(prev => ({
//                                                     ...prev,
//                                                     defaultShippingRestrictions: {
//                                                         ...prev.defaultShippingRestrictions!,
//                                                         countryRestrictionType: countryRestrictionType || 'ALLOW_ONLY',
//                                                     },
//                                                 }));
//                                             }}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
//                                             disabled={loading}
//                                         >
//                                             <option value="ALLOW_ONLY">Chỉ cho phép (Whitelist)</option>
//                                             <option value="DENY_ONLY">Chặn (Blacklist)</option>
//                                         </select>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Local Radius */}
//                             {formData.defaultShippingRestrictions?.restrictionType === 'LOCAL_RADIUS' && (
//                                 <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                     <label htmlFor="maxShippingRadiusKm" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         <span className="flex items-center">
//                                             <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             </svg>
//                                             Bán kính giao hàng (km)
//                                             <span className="text-red-500 ml-1">*</span>
//                                         </span>
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id="maxShippingRadiusKm"
//                                         name="maxShippingRadiusKm"
//                                         min="1"
//                                         max="10000"
//                                         value={formData.defaultShippingRestrictions?.maxShippingRadiusKm || ''}
//                                         onChange={(e) => {
//                                             const value = e.target.value ? parseInt(e.target.value) : undefined;
//                                             setFormData(prev => ({
//                                                 ...prev,
//                                                 defaultShippingRestrictions: {
//                                                     ...prev.defaultShippingRestrictions!,
//                                                     maxShippingRadiusKm: value,
//                                                 },
//                                             }));
//                                         }}
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
//                                         placeholder="Nhập bán kính (1-10000 km)"
//                                         disabled={loading}
//                                     />
//                                     <p className="mt-2 text-xs text-gray-500">Ví dụ: 40 km cho giao hàng trong thành phố</p>
//                                 </div>
//                             )}

//                             {/* Countries Restriction */}
//                             {formData.defaultShippingRestrictions?.restrictionType === 'COUNTRIES' && (
//                                 <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                     <label htmlFor="restrictedCountries" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         <span className="flex items-center">
//                                             <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                             Danh sách mã quốc gia
//                                         </span>
//                                     </label>
//                                     <Select
//                                         mode="multiple"
//                                         id="restrictedCountries"
//                                         placeholder="Chọn các quốc gia"
//                                         value={formData.defaultShippingRestrictions?.restrictedCountries || []}
//                                         onChange={(values: string[]) => {
//                                             setFormData(prev => ({
//                                                 ...prev,
//                                                 defaultShippingRestrictions: {
//                                                     ...prev.defaultShippingRestrictions!,
//                                                     restrictedCountries: values,
//                                                 },
//                                             }));
//                                         }}
//                                         options={COUNTRIES}
//                                         className="w-full"
//                                         disabled={loading}
//                                         showSearch
//                                         filterOption={(input, option) =>
//                                             (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                         }
//                                         maxTagCount="responsive"
//                                     />
//                                     <p className="mt-2 text-xs text-gray-500 flex items-center">
//                                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                         </svg>
//                                         Chọn các quốc gia từ danh sách. Có thể tìm kiếm bằng tên hoặc mã quốc gia.
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Regions Restriction */}
//                             {formData.defaultShippingRestrictions?.restrictionType === 'REGIONS' && (
//                                 <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                                     <label htmlFor="restrictedRegions" className="block text-sm font-semibold text-gray-700 mb-2">
//                                         <span className="flex items-center">
//                                             <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                             Danh sách khu vực
//                                         </span>
//                                     </label>
//                                     <Select
//                                         mode="multiple"
//                                         id="restrictedRegions"
//                                         placeholder="Chọn các khu vực"
//                                         value={formData.defaultShippingRestrictions?.restrictedRegions || []}
//                                         onChange={(values: string[]) => {
//                                             setFormData(prev => ({
//                                                 ...prev,
//                                                 defaultShippingRestrictions: {
//                                                     ...prev.defaultShippingRestrictions!,
//                                                     restrictedRegions: values,
//                                                 },
//                                             }));
//                                         }}
//                                         options={REGIONS}
//                                         className="w-full"
//                                         disabled={loading}
//                                         showSearch
//                                         filterOption={(input, option) =>
//                                             (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                         }
//                                         maxTagCount="responsive"
//                                     />
//                                     <p className="mt-2 text-xs text-gray-500 flex items-center">
//                                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                         </svg>
//                                         Chọn các khu vực từ danh sách. Có thể tìm kiếm bằng tên hoặc mã khu vực.
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
//                         <button
//                             type="button"
//                             onClick={handleCancel}
//                             className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//                             disabled={loading}
//                         >
//                             Hủy
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center"
//                         >
//                             {loading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Đang tạo...
//                                 </>
//                             ) : (
//                                 <>
//                                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                     </svg>
//                                     Tạo danh mục
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateForm;
