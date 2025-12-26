// "use client";

// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import ContentTable from "../../_components/category/_components/ContentTable";
// import CreateForm from "../../_components/category/_components/CreateForm";
// // import UpdateForm from "@/features/category/components/UpdateFrom";
// // import CategorySubmenu from "@/features/category/components/CategorySubmenu";
// import { CategoryResponse } from "@/types/categories/category.detail";
// import { useDeleteCategory } from "../../_hooks/useCategory";
// import { message } from "antd";

// export default function ManagerCategoryPage() {
//     const { t } = useTranslation();
    
//     const [showCreateForm, setShowCreateForm] = useState(false);
//     const [showUpdateForm, setShowUpdateForm] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
//     const [refreshKey, setRefreshKey] = useState(0);
//     const { handleDeleteCategory, loading: deleting } = useDeleteCategory();

//     const handleAddCategory = () => {
//         setShowCreateForm(true);
//     };

//     const handleCreateSuccess = () => {
//         setShowCreateForm(false);
//         setRefreshKey(prev => prev + 1);
//         message.success("Tạo danh mục thành công!");
//     };

//     const handleCreateCancel = () => {
//         setShowCreateForm(false);
//     };

//     const handleEditCategory = (category: CategoryResponse) => {
//         setSelectedCategory(category);
//         setShowUpdateForm(true);
//     };

//     const handleUpdateSuccess = () => {
//         setShowUpdateForm(false);
//         setSelectedCategory(null);
//         setRefreshKey(prev => prev + 1);
//         message.success("Cập nhật danh mục thành công!");
//     };

//     const handleUpdateCancel = () => {
//         setShowUpdateForm(false);
//         setSelectedCategory(null);
//     };

//     const handleDeleteCategoryConfirm = async (categoryId: string, etag: string) => {
//         try {
//             const result = await handleDeleteCategory(categoryId, etag);
//             if (result) {
//                 setRefreshKey(prev => prev + 1);
//                 message.success("Xóa danh mục thành công!");
//             }
//         } catch (error) {
//             message.error("Xóa danh mục thất bại!");
//         }
//     };

//     const handleViewCategory = (category: CategoryResponse) => {
//         // View is handled by ContentTable's DetailModal
//     };

//     // Block scroll when modals are open
//     useEffect(() => {
//         if (showCreateForm || showUpdateForm) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [showCreateForm, showUpdateForm]);

//     return (
//         <div className="space-y-6">
//             {/* Header with Submenu */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex items-center justify-between mb-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">{t("category")}</h1>
//                         <p className="text-sm text-gray-500 mt-1">Quản lý danh mục sản phẩm</p>
//                     </div>
//                     <button
//                         onClick={handleAddCategory}
//                         className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg flex items-center"
//                     >
//                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                         {t("addCategory")}
//                     </button>
//                 </div>

//                 {/* Submenu Navigation */}
//                 <CategorySubmenu />
//             </div>

//             {/* Content */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <ContentTable
//                     key={refreshKey}
//                     onEdit={handleEditCategory}
//                     onDelete={handleDeleteCategoryConfirm}
//                     onView={handleViewCategory}
//                 />
//             </div>

//             {/* Create Form Modal */}
//             {showCreateForm && (
//                 <div 
//                     className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-start justify-center p-4 z-50"
//                     onClick={(e) => {
//                         // Close modal when clicking outside
//                         if (e.target === e.currentTarget) {
//                             handleCreateCancel();
//                         }
//                     }}
//                     onWheel={(e) => {
//                         // Prevent scroll on overlay
//                         e.preventDefault();
//                     }}
//                     onTouchMove={(e) => {
//                         // Prevent scroll on mobile
//                         e.preventDefault();
//                     }}
//                     style={{ overscrollBehavior: 'none' }}
//                 >
//                     <div 
//                         className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
//                         onClick={(e) => {
//                             // Prevent closing when clicking inside modal
//                             e.stopPropagation();
//                         }}
//                     >
//                         <CreateForm
//                             onSuccess={handleCreateSuccess}
//                             onCancel={handleCreateCancel}
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* Update Form Modal */}
//             {showUpdateForm && selectedCategory && (
//                 <div 
//                     className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-start justify-center p-4 z-50"
//                     onClick={(e) => {
//                         if (e.target === e.currentTarget) {
//                             handleUpdateCancel();
//                         }
//                     }}
//                     onWheel={(e) => e.preventDefault()}
//                     onTouchMove={(e) => e.preventDefault()}
//                     style={{ overscrollBehavior: 'none' }}
//                 >
//                     <div 
//                         className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <UpdateForm
//                             category={selectedCategory}
//                             onSuccess={handleUpdateSuccess}
//                             onCancel={handleUpdateCancel}
//                         />
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }
