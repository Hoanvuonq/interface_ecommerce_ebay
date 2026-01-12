// "use client";

// import { CategoryService } from "@/app/(main)/category/_service/category.service";
// import { UploadFile } from "@/app/(main)/orders/_types/review";
// import { usePresignedUpload } from "@/hooks/usePresignedUpload";
// import { userProductService } from "@/services/products/product.service";
// import { storageService } from "@/services/storage/storage.service";
// import { CategoryResponse } from "@/types/categories/category.detail";
// import { CategorySummaryResponse } from "@/types/categories/category.summary";
// import type {
//   CreateUserProductBulkDTO,
//   CreateUserProductOptionDTO,
// } from "@/types/product/user-product.dto";
// import { UploadContext } from "@/types/storage/storage.types";
// import { safeApiCall } from "@/utils/api.helpers";
// import { toPublicUrl } from "@/utils/storage/url";
// import {
//   LayoutGrid,
//   Grid2X2Plus,
//   Check,
//   Copy,
//   Trash2,
//   Info,
//   MinusCircle,
//   Image as ImageIcon,
//   PlayCircle,
//   Plus,
//   ChevronRight,
//   Save,
//   Search,
//   ShoppingCart,
//   ShoppingBag,
//   Tags,
//   UploadCloud,
// } from "lucide-react";
// import {
//   Alert,
//   App,
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   InputNumber,
//   notification,
//   Row,
//   Space,
//   Spin,
//   Switch,
//   Tabs,
//   Tag,
//   Tooltip,
//   Typography,
//   Upload,
// } from "antd";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import SparkMD5 from "spark-md5";
// import { BasePriceSection } from "../../_components/Products/BasePriceSection";
// import { ProductClassificationSection } from "../../_components/Products/ProductClassificationSection";
// import { ProductDescription } from "../../_components/Products/ProductDescription";
// import { ProductVariantsSection } from "../../_components/Products/ProductVariantsSection";
// import { SectionPageComponents } from "@/features/SectionPageComponents";
// import { ProductVariantsTable } from "../../_components/Products/ProductVariantsTable";
// import {
//   AddOptionGroupModal,
//   CategorySelectionModal,
// } from "../../_components/Modal";
// import { useProductStore } from "../../_store/product.store";
// import { ProductPreviewSidebar } from "../../_components/Products/ProductPreviewSidebar";
// import { ProductFormTabs } from "../../_components/Products/ProductFormTabs";
// import ShippingTable from "../../_components/Products/ShippingTable";
// const { Title, Text, Paragraph } = Typography;

// type OptionConfig = {
//   id: string;
//   name: string;
//   values: string[];
// };

// const MAX_OPTION_GROUPS = 2;
// const MAX_OPTION_VALUES = 20;

// const cartesianProduct = (arrays: string[][]): string[][] => {
//   if (!arrays.length) return [];
//   return arrays.reduce<string[][]>(
//     (acc, curr) =>
//       acc.flatMap((accItem) => curr.map((currItem) => [...accItem, currItem])),
//     [[]]
//   );
// };


// export default function ShopProductAddStepsFormScreen() {
//   const {
//     name,
//     basePrice,
//     variants,
//     setBasicInfo,
//     setVariants,
//     addOptionGroup,
//     updateOptionValue,
//   } = useProductStore();
//   const [optionGroups, setOptionGroups] = useState<OptionConfig[]>([]);

//   const [form] = Form.useForm();
//   const router = useRouter();
//   const { message, modal } = App.useApp();
//   const { uploadFile: uploadPresigned } = usePresignedUpload();
//   // States
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState<CategoryResponse[]>([]);
//   const [categoriesLoading, setCategoriesLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [videoList, setVideoList] = useState<UploadFile[]>([]);
//   const [uploadingVideo, setUploadingVideo] = useState(false);
//   const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
//   const [newOptionName, setNewOptionName] = useState("");
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track if form has unsaved changes
//   const [activeTab, setActiveTab] = useState<string>("basic"); // Tab state: basic, details, description, sales, shipping
//   const [categoryModalOpen, setCategoryModalOpen] = useState(false); // Category selection modal
//   const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>(""); // Display path like "Thời Trang Nam > Quần jean"
//   const [categoryTree, setCategoryTree] = useState<CategorySummaryResponse[]>(
//     []
//   ); // Full tree with children
//   const [secondLevelCategories, setSecondLevelCategories] = useState<
//     CategorySummaryResponse[]
//   >([]);
//   const [thirdLevelCategories, setThirdLevelCategories] = useState<
//     CategorySummaryResponse[]
//   >([]);
//   const [fourthLevelCategories, setFourthLevelCategories] = useState<
//     CategorySummaryResponse[]
//   >([]);
//   const [selectedLevel1, setSelectedLevel1] =
//     useState<CategorySummaryResponse | null>(null);
//   const [selectedLevel2, setSelectedLevel2] =
//     useState<CategorySummaryResponse | null>(null);
//   const [selectedLevel3, setSelectedLevel3] =
//     useState<CategorySummaryResponse | null>(null);
//   const [selectedLevel4, setSelectedLevel4] =
//     useState<CategorySummaryResponse | null>(null);
//   const [categorySearchText, setCategorySearchText] = useState<string>("");
//   const [loadingCategoryTree, setLoadingCategoryTree] = useState(false);
//   const optionNames = useMemo(
//     () =>
//       optionGroups.map((group, index) => {
//         const trimmed = group.name?.trim?.() || "";
//         return trimmed || `Phân loại ${index + 1}`;
//       }),
//     [optionGroups]
//   );

//   // Form data
//   const [formData, setFormData] = useState<Partial<CreateUserProductBulkDTO>>({
//     name: "",
//     description: "",
//     basePrice: 0,
//     categoryId: "",
//     active: true,
//     variants: [],
//     media: [],
//     options: [],
//     saveAsDraft: false,
//     validateOnly: false,
//   });

//   useEffect(() => {
//     fetchCategories();
//     loadCategoryTree();
//   }, []);

//   const createDefaultVariant = () => ({
//     sku: "",
//     corePrice: form.getFieldValue("basePrice") || 0,
//     price: form.getFieldValue("basePrice") || 0,
//     stockQuantity: 0,
//     lengthCm: undefined,
//     widthCm: undefined,
//     heightCm: undefined,
//     weightGrams: undefined,
//     optionValueNames: [],
//   });

//   const regenerateVariantsFromOptions = (
//     groups: OptionConfig[],
//     baseVariants?: any[]
//   ) => {
//     const normalizedGroups = groups
//       .map((group) => ({
//         ...group,
//         name: group.name.trim(),
//         values: group.values.map((value) => value.trim()).filter(Boolean),
//       }))
//       .filter((group) => group.name && group.values.length > 0);

//     const existingVariants =
//       baseVariants || form.getFieldValue("variants") || variants;

//     if (normalizedGroups.length === 0) {
//       if (existingVariants.length === 0) {
//         const defaultVariant = createDefaultVariant();
//         setVariants([defaultVariant]);
//         form.setFieldValue("variants", [defaultVariant]);
//       } else if (
//         existingVariants.length > 1 ||
//         (existingVariants[0]?.optionValueNames?.length || 0) > 0
//       ) {
//         const singleVariant = {
//           ...existingVariants[0],
//           optionValueNames: [],
//         };
//         setVariants([singleVariant]);
//         form.setFieldValue("variants", [singleVariant]);
//       }
//       return;
//     }

//     const combinations = cartesianProduct(
//       normalizedGroups.map((group) => group.values)
//     );
//     if (combinations.length === 0) {
//       setVariants([]);
//       form.setFieldValue("variants", []);
//       return;
//     }

//     const newVariants = combinations.map((combo) => {
//       const existingMatch = existingVariants.find(
//         (variant: any) =>
//           Array.isArray(variant.optionValueNames) &&
//           variant.optionValueNames.length === combo.length &&
//           combo.every((value, idx) => variant.optionValueNames[idx] === value)
//       );

//       if (existingMatch) {
//         return existingMatch;
//       }

//       // Auto-generate SKU with variant suffix
//       const skuSuffix = combo
//         .map((val) =>
//           val
//             .substring(0, 3)
//             .toUpperCase()
//             .replace(/[^A-Z0-9]/g, "")
//         )
//         .join("-");

//       return {
//         ...createDefaultVariant(),
//         optionValueNames: combo,
//         sku: skuSuffix || "VAR",
//       };
//     });

//     setVariants(newVariants);
//     form.setFieldValue("variants", newVariants);
//   };

//   const handleOptionNameChange = (index: number, value: string) => {
//     const trimmed = (value || "").trim();

//     // Không cho trùng tên option trong cùng sản phẩm
//     if (
//       trimmed &&
//       optionGroups.some(
//         (group, idx) => idx !== index && group.name.trim() === trimmed
//       )
//     ) {
//       message.warning(
//         "Tên nhóm phân loại phải khác nhau trong cùng một sản phẩm."
//       );
//       return;
//     }

//     const updated = optionGroups.map((group, idx) =>
//       idx === index ? { ...group, name: value } : group
//     );
//     setOptionGroups(updated);
//     regenerateVariantsFromOptions(updated);
//   };

//   const handleOptionValueChange = (
//     groupIndex: number,
//     valueIndex: number,
//     value: string
//   ) => {
//     const trimmed = (value || "").trim();

//     const updated = optionGroups.map((group, idx) => {
//       if (idx !== groupIndex) return group;

//       // Không cho trùng value trong cùng một nhóm phân loại
//       if (
//         trimmed &&
//         group.values.some(
//           (v, i) => i !== valueIndex && (v || "").trim() === trimmed
//         )
//       ) {
//         message.warning(
//           "Giá trị phân loại trong cùng một nhóm phải khác nhau."
//         );
//         return group;
//       }

//       const nextValues = [...group.values];
//       nextValues[valueIndex] = value;
//       return { ...group, values: nextValues };
//     });

//     setOptionGroups(updated);
//     regenerateVariantsFromOptions(updated);
//   };

//   const handleAddOptionValue = (groupIndex: number) => {
//     const targetGroup = optionGroups[groupIndex];
//     if (!targetGroup) return;
//     if (targetGroup.values.length >= MAX_OPTION_VALUES) {
//       message.warning(
//         `Mỗi phân loại chỉ được phép có tối đa ${MAX_OPTION_VALUES} tùy chọn.`
//       );
//       return;
//     }
//     const updated = optionGroups.map((group, idx) =>
//       idx === groupIndex ? { ...group, values: [...group.values, ""] } : group
//     );
//     setOptionGroups(updated);
//   };

//   const handleRemoveOptionValue = (groupIndex: number, valueIndex: number) => {
//     const updated = optionGroups.map((group, idx) => {
//       if (idx !== groupIndex) return group;
//       if (group.values.length === 1) {
//         const nextValues = [...group.values];
//         nextValues[0] = "";
//         return { ...group, values: nextValues };
//       }
//       const nextValues = group.values.filter((_, vIdx) => vIdx !== valueIndex);
//       return { ...group, values: nextValues.length ? nextValues : [""] };
//     });
//     setOptionGroups(updated);
//     regenerateVariantsFromOptions(updated);
//   };

//   // Update selectedCategoryPath when categoryId changes - build full path from tree
//   useEffect(() => {
//     const updatePath = () => {
//       const categoryId = form.getFieldValue("categoryId");
//       if (!categoryId) {
//         setSelectedCategoryPath("");
//         return;
//       }

//       // Find category in tree and build full path
//       const findCategoryPath = (
//         tree: CategorySummaryResponse[],
//         targetId: string,
//         path: string[] = []
//       ): string[] | null => {
//         for (const cat of tree) {
//           const currentPath = [...path, cat.name];
//           if (cat.id === targetId) {
//             return currentPath;
//           }
//           if (cat.children && cat.children.length > 0) {
//             const found = findCategoryPath(cat.children, targetId, currentPath);
//             if (found) return found;
//           }
//         }
//         return null;
//       };

//       if (categoryTree.length > 0) {
//         const path = findCategoryPath(categoryTree, categoryId);
//         if (path && path.length > 0) {
//           setSelectedCategoryPath(path.join(" > "));
//           return;
//         }
//       }

//       // Fallback to flat categories list
//       if (categories.length > 0) {
//         const selectedCat = categories.find((c) => c.id === categoryId);
//         if (selectedCat) {
//           const cleanName = selectedCat.name.replace(/^—+\s*/, "");
//           setSelectedCategoryPath(cleanName);
//         } else {
//           // If not found, show empty
//           setSelectedCategoryPath("");
//         }
//       }
//     };

//     updatePath();
//   }, [form, categoryTree, categories]);

//   // Load full category tree at once (faster, no API calls on each click)
//   // Only load if not already loaded
//   const loadCategoryTree = async () => {
//     if (categoryTree.length > 0) {
//       return; // Already loaded, skip
//     }
//     try {
//       setLoadingCategoryTree(true);
//       const response = await CategoryService.getCategoryTree();
//       const tree = response?.data || [];
//       setCategoryTree(tree);
//     } catch (err: any) {
//       console.error("Failed to load category tree:", err);
//       message.error("Không thể tải danh mục");
//     } finally {
//       setLoadingCategoryTree(false);
//     }
//   };

//   // Handle level 1 selection - get children from tree (no API call)
//   const handleSelectLevel1 = (category: CategorySummaryResponse) => {
//     setSelectedLevel1(category);
//     setSelectedLevel2(null);
//     setSelectedLevel3(null);
//     setSelectedLevel4(null);

//     // Get children from tree structure - chỉ hiển thị children của category này
//     const children = category.children || [];
//     setSecondLevelCategories(children);
//     setThirdLevelCategories([]);
//     setFourthLevelCategories([]);
//   };

//   // Handle level 2 selection - get children from tree (no API call)
//   const handleSelectLevel2 = (category: CategorySummaryResponse) => {
//     setSelectedLevel2(category);
//     setSelectedLevel3(null);
//     setSelectedLevel4(null);

//     // Get children from tree structure - chỉ hiển thị children của category này
//     const children = category.children || [];
//     setThirdLevelCategories(children);
//     setFourthLevelCategories([]);
//   };

//   // Handle level 3 selection - get children from tree (no API call)
//   const handleSelectLevel3 = (category: CategorySummaryResponse) => {
//     setSelectedLevel3(category);
//     setSelectedLevel4(null);

//     // Get children from tree structure
//     const children = category.children || [];
//     setFourthLevelCategories(children);
//   };

//   // Handle final category selection - chỉ cho phép chọn category cấp cuối (không có children)
//   const handleConfirmCategory = () => {
//     const finalCategory =
//       selectedLevel4 || selectedLevel3 || selectedLevel2 || selectedLevel1;
//     if (!finalCategory) {
//       message.warning("Vui lòng chọn ngành hàng");
//       return;
//     }

//     // Kiểm tra xem category có children không - bắt buộc phải chọn cấp cuối cùng
//     if (finalCategory.children && finalCategory.children.length > 0) {
//       message.warning(
//         "Vui lòng chọn đến cấp cuối cùng của ngành hàng (danh mục không có danh mục con)"
//       );
//       return;
//     }

//     // Build path
//     const pathParts: string[] = [];
//     if (selectedLevel1) pathParts.push(selectedLevel1.name);
//     if (selectedLevel2) pathParts.push(selectedLevel2.name);
//     if (selectedLevel3) pathParts.push(selectedLevel3.name);
//     if (selectedLevel4) pathParts.push(selectedLevel4.name);

//     form.setFieldValue("categoryId", finalCategory.id);
//     setSelectedCategoryPath(pathParts.join(" > "));
//     setCategoryModalOpen(false);
//     message.success("Đã chọn ngành hàng: " + pathParts.join(" > "));
//   };

//   // Open modal - tree đã được load khi component mount
//   const handleOpenCategoryModal = () => {
//     setCategoryModalOpen(true);
//     // Reset selections
//     setSelectedLevel1(null);
//     setSelectedLevel2(null);
//     setSelectedLevel3(null);
//     setSelectedLevel4(null);
//     setSecondLevelCategories([]);
//     setThirdLevelCategories([]);
//     setFourthLevelCategories([]);
//     setCategorySearchText("");
//   };

//   // Filter categories by search text
//   const filterCategories = (
//     cats: CategorySummaryResponse[],
//     searchText: string
//   ) => {
//     if (!searchText.trim()) return cats;
//     const lowerSearch = searchText.toLowerCase();
//     return cats.filter((cat) => cat.name.toLowerCase().includes(lowerSearch));
//   };

//   const showVariantErrors = (
//     errors: string[],
//     title = "❌ Thông tin biến thể chưa hợp lệ"
//   ) => {
//     modal.error({
//       title,
//       content: (
//         <div>
//           <p>Vui lòng kiểm tra lại các lỗi sau:</p>
//           <ul style={{ paddingLeft: 20 }}>
//             {errors.map((error, idx) => (
//               <li key={idx}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       ),
//       width: 520,
//     });
//   };

//   const validateVariantStructure = (variantList: any[]) => {
//     const structureErrors: string[] = [];
//     const hasOptionGroups = optionNames.length > 0;

//     if (!variantList || variantList.length === 0) {
//       structureErrors.push("Cần tạo ít nhất 1 biến thể trước khi tiếp tục.");
//       return structureErrors;
//     }

//     if (!hasOptionGroups) {
//       if (variantList.length !== 1) {
//         structureErrors.push(
//           "Sản phẩm không có phân loại → chỉ được phép có đúng 1 biến thể mặc định."
//         );
//       }

//       variantList.forEach((variant, idx) => {
//         const optionValues = (variant.optionValueNames || []).filter(
//           (val: string) => val && val.trim()
//         );
//         if (optionValues.length > 0) {
//           structureErrors.push(
//             `Biến thể #${
//               idx + 1
//             }: Không được chọn phân loại khi sản phẩm không có tùy chọn.`
//           );
//         }
//       });
//     } else {
//       variantList.forEach((variant, idx) => {
//         const optionValues = Array.isArray(variant.optionValueNames)
//           ? variant.optionValueNames
//           : [];

//         if (optionValues.length !== optionNames.length) {
//           structureErrors.push(
//             `Biến thể #${idx + 1}: Cần nhập đủ ${
//               optionNames.length
//             } giá trị phân loại.`
//           );
//           return;
//         }

//         optionValues.forEach((value: string, optIdx: number) => {
//           if (!value || !value.trim()) {
//             structureErrors.push(
//               `Biến thể #${idx + 1}: Giá trị "${
//                 optionNames[optIdx]
//               }" chưa được nhập.`
//             );
//           }
//         });
//       });
//     }

//     return structureErrors;
//   };

//   // Track form changes to detect unsaved data
//   useEffect(() => {
//     const values = form.getFieldsValue();
//     const hasData =
//       values.name ||
//       values.description ||
//       values.basePrice > 0 ||
//       fileList.length > 0 ||
//       videoList.length > 0 ||
//       variants.length > 0 ||
//       optionGroups.some((group) => {
//         const nameHasValue = (group.name || "").trim().length > 0;
//         const valueHasValue = group.values.some(
//           (value) => (value || "").trim().length > 0
//         );
//         return nameHasValue || valueHasValue;
//       });

//     setHasUnsavedChanges(Boolean(hasData));
//   }, [form, fileList, variants, optionGroups]);

//   // Warn before leaving page if there are unsaved changes
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (hasUnsavedChanges) {
//         e.preventDefault();
//         e.returnValue =
//           "Bạn có chắc muốn thoát? Dữ liệu chưa được lưu sẽ bị mất.";
//         return "Bạn có chắc muốn thoát? Dữ liệu chưa được lưu sẽ bị mất.";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [hasUnsavedChanges]);

//   // ============================== API CALLS ==============================

//   const fetchCategories = async () => {
//     try {
//       setCategoriesLoading(true);

//       // Fetch all parent categories (tree structure)
//       const response = await CategoryService.getAllParents();

//       console.log("📊 Categories Tree API Response:", response);

//       // Handle different response structures
//       let categoriesData: CategoryResponse[] = [];

//       if (
//         response &&
//         typeof response === "object" &&
//         "data" in response &&
//         Array.isArray((response as any).data)
//       ) {
//         categoriesData = (response as any).data;
//       } else if (Array.isArray(response)) {
//         categoriesData = response;
//       }

//       // Filter only active categories and flatten the tree
//       const flattenCategories = (
//         categories: CategoryResponse[],
//         level = 0
//       ): CategoryResponse[] => {
//         const result: CategoryResponse[] = [];

//         categories.forEach((cat) => {
//           if (cat.active) {
//             // Add prefix to show hierarchy
//             const prefix = "—".repeat(level);
//             result.push({
//               ...cat,
//               name: level > 0 ? `${prefix} ${cat.name}` : cat.name,
//             });

//             // Add children recursively
//             if (cat.children && cat.children.length > 0) {
//               result.push(...flattenCategories(cat.children, level + 1));
//             }
//           }
//         });

//         return result;
//       };

//       const flatCategories = flattenCategories(categoriesData);
//       setCategories(flatCategories);
//       console.log(
//         "✅ Loaded categories with hierarchy:",
//         flatCategories.length
//       );
//     } catch (err: any) {
//       console.error("Failed to fetch categories:", err);
//       message.error(err?.response?.data?.message || "Không thể tải danh mục");
//     } finally {
//       setCategoriesLoading(false);
//     }
//   };
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       const values = await form.validateFields();

//       // Build options payload directly from option groups configuration
//       const optionsForAPI: CreateUserProductOptionDTO[] = optionGroups
//               .map((group) => {
//                 const name = group.name.trim();
//                 const values = group.values
//                   .map((value) => value.trim())
//                   .filter((value) => value.length > 0);
      
//                 if (!name || values.length === 0) {
//                   return null;
//                 }
      
//                 return {
//                   name,
//                   values: values.map((value, order) => ({
//                     name: value,
//                     displayOrder: order + 1,
//                   })),
//                 } as CreateUserProductOptionDTO;
//               })
//               .filter((option): option is CreateUserProductOptionDTO =>
//                 option !== null
//               );

//       const variantsToUse =
//         variants.length > 0 ? variants : values.variants || [];

//       console.log(
//         "📊 Building payload - Variants from state:",
//         variants.length
//       );
//       console.log("📊 Building payload - Options:", optionsForAPI.length);

//       // Use variants state instead of values.variants (more reliable)
//       const variantsToSubmit =
//         variants.length > 0 ? variants : values.variants || [];
//       const structuralErrors = validateVariantStructure(variantsToSubmit);
//       if (structuralErrors.length > 0) {
//         showVariantErrors(structuralErrors);
//         return;
//       }

//       const finalData: CreateUserProductBulkDTO = {
//         ...formData,
//         ...values,
//         media: [
//           // Images
//           ...fileList
//             .filter((file) => file.status === "done" && (file as any).assetId)
//             .map(
//               (file, index) =>
//                 ({
//                   mediaAssetId: (file as any).assetId as string,
//                   type: "IMAGE" as const,
//                   displayOrder: index + 1,
//                   sortOrder: index + 1,
//                   isPrimary: index === 0,
//                 } as any)
//             ),
//           // Videos
//           ...videoList
//             .filter((file) => file.status === "done" && (file as any).assetId)
//             .map(
//               (file, index) =>
//                 ({
//                   mediaAssetId: (file as any).assetId as string,
//                   type: "VIDEO" as const,
//                   displayOrder: fileList.length + index + 1,
//                   sortOrder: fileList.length + index + 1,
//                   isPrimary: false,
//                 } as any)
//             ),
//         ],
//         options: optionsForAPI,
//         variants: variantsToSubmit.map((v: any) => {
//           const variantOptionValues = (v.optionValueNames || []).filter(
//             (val: string) => val && val.trim()
//           );
//           const options: Array<{
//             optionId?: string;
//             optionName: string;
//             value: string;
//           }> = [];

//           // Map optionValueNames to options array with optionName and value
//           if (optionNames.length > 0 && variantOptionValues.length > 0) {
//             optionNames.forEach((optionName, idx) => {
//               const value = variantOptionValues[idx];
//               if (value && value.trim()) {
//                 options.push({
//                   optionName: optionName,
//                   value: value.trim(),
//                 });
//               }
//             });
//           }

//           return {
//             sku: v.sku,
//             corePrice: v.corePrice,
//             price: v.price,
//             stockQuantity: v.stockQuantity,
//             lengthCm: v.lengthCm,
//             widthCm: v.widthCm,
//             heightCm: v.heightCm,
//             weightGrams: v.weightGrams,
//             options: options.length > 0 ? options : undefined,
//             imageAssetId: v.imageAssetId || undefined,
//           };
//         }),
//       };

//       const result: any = await userProductService.createBulk(finalData);

//       setHasUnsavedChanges(false);

//       // Handle response structure: result.data.product or result.product
//       const createdProduct = result?.data?.product || result?.product || result;
//       const productName = createdProduct?.name || values.name || "sản phẩm";
//       const productId = createdProduct?.id;

//       if (!productId) {
//         message.error("Không thể lấy ID sản phẩm. Vui lòng kiểm tra lại.");
//         return;
//       }

//       // Show detailed success notification with redirect info
//       const notificationKey = `product-created-${productId}`;
//       notification.success({
//         key: notificationKey,
//         message: "✅ Tạo sản phẩm thành công!",
//         description: (
//           <div>
//             <div style={{ marginBottom: 8, fontWeight: 500, fontSize: "14px" }}>
//               {productName}
//             </div>
//             <div style={{ color: "#666", fontSize: "12px" }}>
//               🔄 Đang chuyển hướng tới trang chi tiết sản phẩm...
//             </div>
//           </div>
//         ),
//         duration: 4,
//         placement: "topRight",
//       });

//       // Show loading message and redirect after a short delay to let user see the notification
//       setTimeout(() => {
//         // Update notification to show redirecting state
//         notification.info({
//           key: notificationKey,
//           message: "🔄 Đang chuyển hướng...",
//           description:
//             "Vui lòng đợi trong giây lát. Nếu không tự động chuyển, vui lòng click vào thông báo.",
//           duration: 3,
//           placement: "topRight",
//           onClick: () => {
//             router.push(`/shop/products/${productId}`);
//           },
//         });

//         // Redirect to product detail page
//         router.push(`/shop/products/${productId}`);
//       }, 2000);
//     } catch (err: any) {
//       message.error(err?.message || "Tạo sản phẩm thất bại");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };



//   // Derive public original path from presign path
//   const derivePublicOrigPath = (presignPath?: string | null) => {
//     if (!presignPath) return "";
//     const lastSlash = presignPath.lastIndexOf("/");
//     if (lastSlash < 0) return "";
//     const dir = presignPath.substring(0, lastSlash);
//     const file = presignPath.substring(lastSlash + 1);
//     const dot = file.lastIndexOf(".");
//     const name = dot >= 0 ? file.substring(0, dot) : file;
//     const ext = dot >= 0 ? file.substring(dot) : "";
//     return `public/${dir}/${name}_orig${ext}`;
//   };

 

//   const handleUpload = async (options: any) => {
//     const { file, onSuccess, onError } = options;
//     try {
//       setUploading(true);
//       // Create local preview immediately
//       const localUrl = URL.createObjectURL(file as File);
//       const tempUid = (file as any).uid;
//       setFileList((prev) => [
//         ...prev,
//         {
//           ...file,
//           url: localUrl,
//           status: "uploading",
//           name: (file as File).name,
//           uid: tempUid,
//           processing: true as any,
//         } as any,
//       ]);

//       // Upload via presigned flow
//       const res = await uploadPresigned(
//         file as File,
//         UploadContext.PRODUCT_IMAGE
//       );
//       if (!res.finalUrl) throw new Error("Xử lý ảnh chưa sẵn sàng");

//       setFileList((prev) =>
//         prev.map((f) => {
//           if (f.uid === tempUid) {
//             try {
//               if (f.url && String(f.url).startsWith("blob:"))
//                 URL.revokeObjectURL(String(f.url));
//             } catch {}
//             return {
//               ...f,
//               url: res.finalUrl,
//               status: "done",
//               processing: false,
//               assetId: res.assetId,
//             } as any;
//           }
//           return f;
//         })
//       );

//       onSuccess({ url: res.finalUrl });
//     } catch (err) {
//       onError(err);
//       message.error("Upload ảnh thất bại");
//       // Clean up temp preview if exists
//       setFileList((prev) => prev.filter((f) => f.uid !== (file as any).uid));
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemove = (file: UploadFile) => {
//     setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
//   };

//   const handleVideoUpload = async (options: any) => {
//     const { file, onSuccess, onError } = options;
//     try {
//       setUploadingVideo(true);
//       // Create local preview immediately
//       const localUrl = URL.createObjectURL(file as File);
//       const tempUid = (file as any).uid;
//       setVideoList((prev) => [
//         ...prev,
//         {
//           ...file,
//           url: localUrl,
//           status: "uploading",
//           name: (file as File).name,
//           uid: tempUid,
//           processing: true as any,
//         } as any,
//       ]);

//       // Upload via presigned flow
//       const res = await uploadPresigned(
//         file as File,
//         UploadContext.PRODUCT_VIDEO
//       );
//       if (!res.finalUrl) throw new Error("Xử lý video chưa sẵn sàng");

//       // Replace temp item with final URL and stop processing
//       setVideoList((prev) =>
//         prev.map((f) => {
//           if (f.uid === tempUid) {
//             // Revoke local blob
//             try {
//               if (f.url && String(f.url).startsWith("blob:"))
//                 URL.revokeObjectURL(String(f.url));
//             } catch {}
//             return {
//               ...f,
//               url: res.finalUrl,
//               status: "done",
//               processing: false,
//               assetId: res.assetId,
//             } as any;
//           }
//           return f;
//         })
//       );

//       onSuccess({ url: res.finalUrl });
//     } catch (err) {
//       onError(err);
//       message.error("Upload video thất bại");
//       // Clean up temp preview if exists
//       setVideoList((prev) => prev.filter((f) => f.uid !== (file as any).uid));
//     } finally {
//       setUploadingVideo(false);
//     }
//   };

//   const handleRemoveVideo = (file: UploadFile) => {
//     setVideoList((prev) => prev.filter((item) => item.uid !== file.uid));
//   };

//   // Option handlers
//   const handleAddOptionColumn = () => {
//     if (optionGroups.length >= MAX_OPTION_GROUPS) {
//       message.warning(`Đã đạt tối đa ${MAX_OPTION_GROUPS} nhóm phân loại.`);
//       return;
//     }
//     setNewOptionName("");
//     setAddOptionModalOpen(true);
//   };


//   const handleRemoveOptionColumn = (index: number) => {
//     const updatedGroups = optionGroups.filter((_, i) => i !== index);
//     setOptionGroups(updatedGroups);
//     regenerateVariantsFromOptions(updatedGroups);
//     message.success("Đã xóa phân loại");
//   };

 
//   const renderBasicTab = () => (
//     <Space direction="vertical" size="large" style={{ width: "100%" }}>
//       {/* Card 1: Tên sản phẩm & Danh mục */}
//       <Card className="shadow-sm rounded-lg border-gray-200">
//         <Title level={5} className="!mb-4">
//           Thông tin cơ bản
//         </Title>

//         {/* Hidden fields to ensure form state management */}
//         <Form.Item name="variants" style={{ display: "none" }}>
//           <Input type="hidden" />
//         </Form.Item>
//         <Form.Item name="options" style={{ display: "none" }}>
//           <Input type="hidden" />
//         </Form.Item>

//         {/* Tên sản phẩm - Full width */}
//         <Form.Item
//           name="name"
//           label={
//             <span>
//               Tên sản phẩm <Text type="danger">*</Text>
//             </span>
//           }
//           rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
//         >
//           <Input
//             placeholder="Nhập tên sản phẩm"
//             size="large"
//             maxLength={120}
//             showCount
//           />
//         </Form.Item>

//         {/* Ngành hàng - Full width */}
//         <Form.Item
//           name="categoryId"
//           label={
//             <span>
//               Ngành hàng <Text type="danger">*</Text>
//             </span>
//           }
//           rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
//         >
//           {/* Hidden input để lưu categoryId */}
//           <Input type="hidden" />
//           {/* Input hiển thị path (chỉ để hiển thị, không bind với form) */}
//           <Input
//             placeholder="Chọn ngành hàng"
//             size="large"
//             readOnly
//             allowClear={false}
//             value={selectedCategoryPath || ""}
//             onClick={handleOpenCategoryModal}
//             suffix={
//               <span
//                 style={{
//                   fontSize: 16,
//                   color: "#999",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleOpenCategoryModal();
//                 }}
//               >
//                 ✏️
//               </span>
//             }
//             style={{
//               cursor: "pointer",
//               backgroundColor: "#fff",
//               border: "1px solid #d9d9d9",
//               marginTop: 8,
//             }}
//           />
//         </Form.Item>

//         <Form.Item name="active" label="Trạng thái" valuePropName="checked">
//           <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
//         </Form.Item>
//       </Card>

//       {/* Card 2: Hình ảnh sản phẩm */}
//       <Card className="shadow-sm rounded-lg border-gray-200">
//         <Title level={5} className="!mb-4">
//           Hình ảnh sản phẩm <Text type="danger">*</Text>
//         </Title>

//         {/* Image Gallery */}
//         <div style={{ marginBottom: 16 }}>
//           <Row gutter={[16, 16]}>
//             {fileList.map((file, index) => (
//               <Col key={file.uid} xs={12} sm={8} md={6} lg={4}>
//                 <Card
//                   hoverable
//                   cover={
//                     <div
//                       style={{
//                         position: "relative",
//                         height: 120,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <img
//                         alt={file.name}
//                         src={file.url}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           cursor: "pointer",
//                           filter: (file as any).processing
//                             ? "grayscale(40%)"
//                             : undefined,
//                           opacity: (file as any).processing ? 0.85 : 1,
//                         }}
//                         onClick={() => {
//                           modal.info({
//                             title: file.name,
//                             content: (
//                               <img
//                                 src={file.url}
//                                 alt={file.name}
//                                 style={{ width: "100%", height: "auto" }}
//                               />
//                             ),
//                             width: "80%",
//                             style: { top: 20 },
//                           });
//                         }}
//                       />
//                       {(file as any).processing && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             inset: 0,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               background: "rgba(255,255,255,0.7)",
//                               padding: 8,
//                               borderRadius: 8,
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 8,
//                               border: "1px solid #eee",
//                             }}
//                           >
//                             <Spin size="small" />
//                             <span style={{ fontSize: 12, color: "#555" }}>
//                               Đang xử lý...
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                       {index === 0 && !(file as any).processing && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: 4,
//                             left: 4,
//                             background: "#52c41a",
//                             color: "white",
//                             padding: "2px 6px",
//                             borderRadius: 4,
//                             fontSize: 10,
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Ảnh chính
//                         </div>
//                       )}
//                       <Button
//                         type="text"
//                         danger
//                         icon={<Trash2 />}
//                         size="small"
//                         style={{
//                           position: "absolute",
//                           top: 4,
//                           right: 4,
//                           background: "rgba(255, 255, 255, 0.8)",
//                           border: "none",
//                         }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemove(file);
//                         }}
//                         disabled={(file as any).processing}
//                       />
//                     </div>
//                   }
//                   actions={[
//                     <Tooltip title="Đặt làm ảnh chính">
//                       <Button
//                         type={index === 0 ? "primary" : "text"}
//                         size="small"
//                         icon={<Check />}
//                         onClick={() => {
//                           if (index !== 0) {
//                             const newFileList = [...fileList];
//                             const [movedFile] = newFileList.splice(index, 1);
//                             newFileList.unshift(movedFile);
//                             setFileList(newFileList);
//                             message.success("Đã đặt làm ảnh chính");
//                           }
//                         }}
//                       >
//                         {index === 0 ? "Chính" : "Đặt chính"}
//                       </Button>
//                     </Tooltip>,
//                   ]}
//                   size="small"
//                 >
//                   <div style={{ padding: "4px 0" }}>
//                     <Text ellipsis style={{ fontSize: 12 }}>
//                       {file.name}
//                     </Text>
//                   </div>
//                 </Card>
//               </Col>
//             ))}

//             {/* Upload Button */}
//             {fileList.length < 9 && (
//               <Col xs={12} sm={8} md={6} lg={4}>
//                 <Upload
//                   customRequest={handleUpload}
//                   accept="image/png,image/jpeg,image/jpg"
//                   beforeUpload={(file) => {
//                     const allowedTypes = [
//                       "image/png",
//                       "image/jpeg",
//                       "image/jpg",
//                     ];
//                     const fileExtension = file.name
//                       .split(".")
//                       .pop()
//                       ?.toLowerCase();
//                     const allowedExtensions = ["png", "jpg", "jpeg"];

//                     const isValidType =
//                       allowedTypes.includes(file.type) ||
//                       (fileExtension &&
//                         allowedExtensions.includes(fileExtension));

//                     if (!isValidType) {
//                       message.error(
//                         "Chỉ được upload file hình ảnh định dạng PNG, JPG hoặc JPEG!"
//                       );
//                       return false;
//                     }
//                     const isLt2M = file.size / 1024 / 1024 < 2;
//                     if (!isLt2M) {
//                       message.error("Kích thước file không được vượt quá 2MB!");
//                       return false;
//                     }
//                     return true;
//                   }}
//                   showUploadList={false}
//                   multiple
//                 >
//                   <Card
//                     style={{
//                       height: 200,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       border: "2px dashed #d9d9d9",
//                       cursor: "pointer",
//                       background: "#fafafa",
//                       transition: "all 0.3s ease",
//                     }}
//                     hoverable
//                     className="upload-card-hover"
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.border = "2px dashed #1890ff";
//                       e.currentTarget.style.background = "#f0f9ff";
//                       e.currentTarget.style.transform = "scale(1.02)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.border = "2px dashed #d9d9d9";
//                       e.currentTarget.style.background = "#fafafa";
//                       e.currentTarget.style.transform = "scale(1)";
//                     }}
//                   >
//                     <ImageIcon style={{ fontSize: 40, color: "#1890ff" }} />
//                     <div
//                       style={{
//                         marginTop: 12,
//                         color: "#1890ff",
//                         fontWeight: 600,
//                         fontSize: 14,
//                       }}
//                     >
//                       Kéo thả hoặc click để tải ảnh
//                     </div>
//                     <div
//                       style={{ marginTop: 4, color: "#8c8c8c", fontSize: 12 }}
//                     >
//                       {fileList.length}/9 ảnh · PNG, JPG · Tối đa 2MB
//                     </div>
//                   </Card>
//                 </Upload>
//               </Col>
//             )}
//           </Row>
//         </div>
//       </Card>

//       {/* Card 4: Video sản phẩm */}
//       <Card className="shadow-sm rounded-lg border-gray-200">
//         <Title level={5} className="!mb-4">
//           Video sản phẩm
//         </Title>
//         <Text type="secondary" className="block mb-4">
//           Video giúp khách hàng hiểu rõ hơn về sản phẩm của bạn
//         </Text>

//         <div style={{ marginBottom: 16 }}>
//           <Row gutter={[16, 16]}>
//             {videoList.map((file, index) => (
//               <Col key={file.uid} xs={12} sm={8} md={6} lg={4}>
//                 <Card
//                   hoverable
//                   cover={
//                     <div
//                       style={{
//                         position: "relative",
//                         height: 120,
//                         overflow: "hidden",
//                         background: "#000",
//                       }}
//                     >
//                       <video
//                         src={file.url}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           cursor: "pointer",
//                           filter: (file as any).processing
//                             ? "grayscale(40%)"
//                             : undefined,
//                           opacity: (file as any).processing ? 0.85 : 1,
//                         }}
//                         onClick={() => {
//                           modal.info({
//                             title: file.name,
//                             content: (
//                               <video
//                                 src={file.url}
//                                 controls
//                                 style={{ width: "100%", height: "auto" }}
//                               />
//                             ),
//                             width: "80%",
//                             style: { top: 20 },
//                           });
//                         }}
//                       />
//                       {(file as any).processing && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             inset: 0,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               background: "rgba(255,255,255,0.7)",
//                               padding: 8,
//                               borderRadius: 8,
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 8,
//                               border: "1px solid #eee",
//                             }}
//                           >
//                             <Spin size="small" />
//                             <span style={{ fontSize: 12, color: "#555" }}>
//                               Đang xử lý...
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: "50%",
//                           left: "50%",
//                           transform: "translate(-50%, -50%)",
//                           color: "white",
//                           fontSize: 24,
//                           pointerEvents: "none",
//                         }}
//                       >
//                         <PlayCircle />
//                       </div>
//                       <Button
//                         type="text"
//                         danger
//                         icon={<Trash2 />}
//                         size="small"
//                         style={{
//                           position: "absolute",
//                           top: 4,
//                           right: 4,
//                           background: "rgba(255, 255, 255, 0.8)",
//                           border: "none",
//                         }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemoveVideo(file);
//                         }}
//                         disabled={(file as any).processing}
//                       />
//                     </div>
//                   }
//                   size="small"
//                 >
//                   <div style={{ padding: "4px 0" }}>
//                     <Text ellipsis style={{ fontSize: 12 }}>
//                       {file.name}
//                     </Text>
//                   </div>
//                 </Card>
//               </Col>
//             ))}

//             {/* Video Upload Button */}
//             {videoList.length < 3 && (
//               <Col xs={12} sm={8} md={6} lg={4}>
//                 <Upload
//                   customRequest={handleVideoUpload}
//                   accept="video/*"
//                   beforeUpload={(file:any) => {
//                     const isVideo = file.type.startsWith("video/");
//                     if (!isVideo) {
//                       message.error("Chỉ được upload file video!");
//                       return false;
//                     }
//                     const fileSizeMB = file.size / 1024 / 1024;
//                     const isLt30M = fileSizeMB <= 30;
//                     if (!isLt30M) {
//                       message.error(
//                         "Kích thước file video không được vượt quá 30MB!"
//                       );
//                       return false;
//                     }
//                     return true;
//                   }}
//                   showUploadList={false}
//                 >
//                   <Card
//                     style={{
//                       height: 200,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       border: "2px dashed #d9d9d9",
//                       cursor: "pointer",
//                       background: "#f0f9ff",
//                     }}
//                     hoverable
//                   >
//                     <PlayCircle style={{ fontSize: 32, color: "#1890ff" }} />
//                     <div
//                       style={{
//                         marginTop: 8,
//                         color: "#1890ff",
//                         fontWeight: 500,
//                       }}
//                     >
//                       Thêm video
//                     </div>
//                   </Card>
//                 </Upload>
//               </Col>
//             )}
//           </Row>
//         </div>

//         <Alert
//           message="Yêu cầu video:"
//           description={
//             <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
//               <li>Kích thước tối đa: 30MB</li>
//               <li>Định dạng: MP4</li>
//               <li>
//                 Lưu ý: sản phẩm có thể hiển thị trong khi video đang được xử lý.
//                 Video sẽ tự động hiển thị sau khi đã xử lý thành công.
//               </li>
//             </ul>
//           }
//           type="info"
//           showIcon
//           closable
//         />
//       </Card>
//     </Space>
//   );

//   // Tab 2: Chi tiết - Details (empty for now, classification moved to Sales tab)
//   const renderDetailsTab = () => {
//     return (
//       <Card className="shadow-sm rounded-lg border-gray-200">
//         <Title level={5} className="mb-4!">
//           Thông tin chi tiết
//         </Title>
//         <Text type="secondary" className="block mb-4">
//           Phần này dành cho các thông tin chi tiết và thuộc tính sản phẩm khác
//           (nếu có).
//         </Text>
//         <Alert
//           message="Thông tin"
//           description="Phân loại sản phẩm đã được chuyển sang tab 'Bán hàng' để quản lý cùng với biến thể."
//           type="info"
//           showIcon
//         />
//       </Card>
//     );
//   };

//   // Tab 3: Mô tả - Description
//   const renderDescriptionTab = () => <ProductDescription />;

//   const renderSalesTab = () => {
//     const hasOptionGroups = optionGroups.length > 0;
//     const handleUpdateVariants = (newVariants: any[]) => {
//       setVariants(newVariants);
//       form.setFieldValue("variants", newVariants);
//     };

//     // Hàm xử lý upload ảnh từ component con (chuyển logic cũ vào đây)
//     const handleUploadVariantImage = async (file: File, index: number) => {
//       try {
//         // 1. Set local preview & loading state
//         const localUrl = URL.createObjectURL(file);
//         const newVariants = [...variants];
//         newVariants[index] = {
//           ...newVariants[index],
//           imageUrl: localUrl, // Tạm thời dùng localUrl để hiển thị ngay
//           imageProcessing: true,
//         };
//         setVariants(newVariants);

//         // 2. Upload lên server
//         const res = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);

//         // 3. Update với URL thật
//         if (res.finalUrl && res.assetId) {
//           setVariants((prev) => {
//             const updated = [...prev];
//             updated[index] = {
//               ...updated[index],
//               imageUrl: res.finalUrl,
//               imageAssetId: res.assetId,
//               imageProcessing: false,
//             };
//             form.setFieldValue("variants", updated); // Sync với form
//             return updated;
//           });
//           message.success("Upload ảnh biến thể thành công");
//           URL.revokeObjectURL(localUrl); // Dọn dẹp
//         } else {
//           throw new Error("Không nhận được URL ảnh");
//         }
//       } catch (error) {
//         message.error("Lỗi upload ảnh biến thể");
//         // Revert loading state
//         setVariants((prev) => {
//           const updated = [...prev];
//           updated[index] = { ...updated[index], imageProcessing: false };
//           return updated;
//         });
//       }
//     };

//     return (
//       <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
//         <BasePriceSection
//           value={form.getFieldValue("basePrice")}
//           onChange={(val) => form.setFieldsValue({ basePrice: val })}
//         />

//         <ProductClassificationSection
//           optionGroups={optionGroups}
//           onAddGroup={handleAddOptionColumn}
//           onRemoveGroup={handleRemoveOptionColumn}
//           onUpdateGroupName={handleOptionNameChange}
//           onAddValue={handleAddOptionValue}
//           onRemoveValue={handleRemoveOptionValue}
//           onUpdateValue={handleOptionValueChange}
//         />

//         <ProductVariantsSection hasOptions={optionGroups.length > 0}>
//           <ProductVariantsTable
//             variants={variants}
//             optionNames={optionNames}
//             onUpdateVariants={handleUpdateVariants}
//             onUploadImage={handleUploadVariantImage}
//           />
//         </ProductVariantsSection>
//       </div>
//     );
//   };

//   const renderShippingTab = () => {
//     const handleUpdateVariant = (index: number, field: string, value: any) => {
//       const newVariants = [...variants];
//       newVariants[index] = { ...newVariants[index], [field]: value };
//       setVariants(newVariants);
//       form.setFieldValue("variants", newVariants);
//     };

//     return (
//       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
//         <div>
//           <h3 className="text-lg font-bold text-gray-800">Thông tin vận chuyển</h3>
//           <p className="text-gray-500 text-sm mt-1">
//             Nhập cân nặng và kích thước đóng gói cho từng biến thể để tính phí vận chuyển chính xác.
//           </p>
//         </div>

//         {variants.length === 0 ? (
//           <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
//             {/* <InfoCircleOutlined className="text-lg" /> */}
//             <div>
//               <p className="font-semibold text-sm">Chưa có biến thể</p>
//               <p className="text-xs">Vui lòng tạo biến thể ở tab 'Bán hàng' trước khi nhập thông tin này.</p>
//             </div>
//           </div>
//         ) : (
//           <ShippingTable 
//             variants={variants} 
//             optionNames={optionNames} 
//             onUpdateVariant={handleUpdateVariant} 
//           />
//         )}

//         <div className="p-4 bg-blue-50 rounded-lg flex gap-3 items-start">
//           {/* <InfoCircleOutlined className="mt-1 text-blue-500" /> */}
//           <p className="text-xs text-blue-700 leading-relaxed">
//             <strong>Lưu ý:</strong> Cân nặng được tính theo gram (g), kích thước tính theo centimet (cm). 
//             Đây là kích thước <strong>sau khi đóng gói</strong> kiện hàng.
//           </p>
//         </div>
//       </div>
//     );
//   };


//   const watchedValues = Form.useWatch([], form);
//   const firstVariant = variants[0] || {};
//   const previewImage = fileList.find((f) => f.status === "done")?.url;
//   const totalStock = variants.reduce(
//     (acc, curr) => acc + (curr.stockQuantity || 0),
//     0
//   );
//   const breadcrumbData = [
//     { title: "Trang chủ", href: "/" },
//     { title: "Giỏ hàng", href: "/cart" },
//     { title: "Thanh toán", href: "/checkout" },
//   ];
//   // ============================== RENDER ==============================

//   return (
//     <SectionPageComponents loading={loading} breadcrumbItems={breadcrumbData}>
//       <div className="flex justify-between items-center mt-4">
//         <h2 className="mb-0!">
//           Thêm sản phẩm mới
//         </h2>
//         <Space>
//           <Button
//             icon={<Save />}
//             size="large"
//             onClick={() => {
//               const currentData = form.getFieldsValue();
//               setFormData((prev) => ({
//                 ...prev,
//                 ...currentData,
//                 variants: variants,
//                 saveAsDraft: true,
//               }));
//               handleSubmit();
//             }}
//             loading={loading}
//           >
//             Lưu nháp
//           </Button>
//           <Button
//             type="primary"
//             icon={<Check />}
//             size="large"
//             onClick={handleSubmit}
//             loading={loading}
//           >
//             Lưu & đăng bán
//           </Button>
//         </Space>
//       </div>

//       <Form form={form} layout="vertical" initialValues={formData}>
//         <Card
//           className="mb-4 shadow-sm rounded-lg border-gray-200"
//           bodyStyle={{ padding: "12px 16px" }}
//         >
//           <Tabs
//             activeKey={activeTab}
//             onChange={setActiveTab}
//             items={[
//               {
//                 key: "basic",
//                 label: (
//                   <Space>
//                     <LayoutGrid />
//                     <span>Cơ bản</span>
//                   </Space>
//                 ),
//               },
//               {
//                 key: "details",
//                 label: (
//                   <Space>
//                     <Tags />
//                     <span>Chi tiết</span>
//                   </Space>
//                 ),
//                 disabled: true,
//               },
//               {
//                 key: "description",
//                 label: (
//                   <Space>
//                     <Info />
//                     <span>Mô tả</span>
//                   </Space>
//                 ),
//               },
//               {
//                 key: "sales",
//                 label: (
//                   <Space>
//                     <ShoppingBag />
//                     <span>Bán hàng</span>
//                   </Space>
//                 ),
//               },
//               {
//                 key: "shipping",
//                 label: (
//                   <Space>
//                     <ShoppingCart />
//                     <span>Vận chuyển</span>
//                   </Space>
//                 ),
//                 disabled: true,
//               },
//             ]}
//             size="large"
//             tabBarStyle={{ marginBottom: 0 }}
//           />
//         </Card>

//         {/* 2-Column Layout */}
//         <div
//           className="flex gap-6 items-start"
//           style={{ position: "relative" }}
//         >
//           {/* LEFT COLUMN: Main Form */}
//           <div className="flex-1 w-full lg:w-[65%] min-w-0">
//             <ProductFormTabs activeTab={activeTab} setActiveTab={setActiveTab}>
//               <div className={activeTab === "basic" ? "block" : "hidden"}>
//                 {renderBasicTab()}
//               </div>
//               <div className={activeTab === "details" ? "block" : "hidden"}>
//                 {renderDetailsTab()}
//               </div>
//               <div className={activeTab === "description" ? "block" : "hidden"}>
//                 {renderDescriptionTab()}
//               </div>
//               <div className={activeTab === "sales" ? "block" : "hidden"}>
//                 {renderSalesTab()}{" "}
//               </div>
//               <div className={activeTab === "shipping" ? "block" : "hidden"}>
//                 {renderShippingTab()}
//               </div>
//             </ProductFormTabs>
//           </div>
//           {/* RIGHT COLUMN: Preview Sidebar */}
//           <div className="w-full lg:w-[35%] lg:min-w-[320px]">
//             <ProductPreviewSidebar
//               previewImage={previewImage}
//               name={watchedValues?.name}
//               basePrice={watchedValues?.basePrice}
//               description={watchedValues?.description}
//               totalStock={totalStock}
//             />
//           </div>
//         </div>
//       </Form>

//       <AddOptionGroupModal
//         isOpen={addOptionModalOpen}
//         onClose={() => setAddOptionModalOpen(false)}
//         onConfirm={(name) => {
//           addOptionGroup(name);
//           setAddOptionModalOpen(false);
//         }}
//         existingGroups={optionNames}
//       />

//       <CategorySelectionModal
//         isOpen={categoryModalOpen}
//         onClose={() => setCategoryModalOpen(false)}
//         onConfirm={handleConfirmCategory}
//         categoryTree={categoryTree}
//         loading={loadingCategoryTree}
//         selectedLevel1={selectedLevel1}
//         selectedLevel2={selectedLevel2}
//         selectedLevel3={selectedLevel3}
//         selectedLevel4={selectedLevel4}
//         onSelectLevel1={handleSelectLevel1}
//         onSelectLevel2={handleSelectLevel2}
//         onSelectLevel3={handleSelectLevel3}
//         onSelectLevel4={setSelectedLevel4}
//       />
//     </SectionPageComponents>
//   );
// }
import React from 'react'

const ShopProductAddStepsFormScreen = () => {
  return (
    <div>
      ShopProductAddStepsFormScreen
    </div>
  )
}

export default ShopProductAddStepsFormScreen
