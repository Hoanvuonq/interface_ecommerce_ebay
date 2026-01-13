"use client";

import { CategoryService } from "@/app/(main)/category/_service/category.service";
import { UploadFile } from "@/app/(main)/orders/_types/review";
import { ButtonField, CustomVideoModal } from "@/components";
import { Button } from "@/components/button/button";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import { userProductService } from "@/services/products/product.service";
import { CategoryResponse } from "@/types/categories/category.detail";
import { CategorySummaryResponse } from "@/types/categories/category.summary";
import type {
  CreateUserProductBulkDTO,
  CreateUserProductOptionDTO,
} from "@/types/product/user-product.dto";
import { UploadContext } from "@/types/storage/storage.types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AddOptionGroupModal,
  CategorySelectionModal,
} from "../../_components/Modal";
import { BasePriceSection } from "../../_components/Products/BasePriceSection";
import { ProductClassificationSection } from "../../_components/Products/ProductClassificationSection";
import { ProductDescription } from "../../_components/Products/ProductDescription";
import { ProductPreviewSidebar } from "../../_components/Products/ProductPreviewSidebar";
import { ProductVariantsSection } from "../../_components/Products/ProductVariantsSection";
import { ProductVariantsTable } from "../../_components/Products/ProductVariantsTable";
import { useProductStore } from "../../_store/product.store";
import {
  ProductBasicTabs,
  ProductDetailsTabs,
  ProductFormTabs,
  ProductShippingTabs,
  TabType,
} from "../../products/add/_components";

type OptionConfig = {
  id: string;
  name: string;
  values: string[];
};

const MAX_OPTION_GROUPS = 2;
const MAX_OPTION_VALUES = 20;

const cartesianProduct = (arrays: string[][]): string[][] => {
  if (!arrays.length) return [];
  return arrays.reduce<string[][]>(
    (acc, curr) =>
      acc.flatMap((accItem) => curr.map((currItem) => [...accItem, currItem])),
    [[]]
  );
};

export default function ShopProductAddStepsFormScreen() {
  const {
    name,
    basePrice,
    variants,
    setBasicInfo,
    setVariants,
    addOptionGroup,
    updateOptionValue,
  } = useProductStore();
  const [optionGroups, setOptionGroups] = useState<OptionConfig[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();

  // Replace Form.useForm() with custom form state
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: "",
    variants: [] as any[],
    active: false,
  });

  const router = useRouter();
  const { uploadFile: uploadPresigned } = usePresignedUpload();
  const [mediaModal, setMediaModal] = useState<{
    type: "image" | "video";
    file: any;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [videoList, setVideoList] = useState<UploadFile[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>("");
  const [categoryTree, setCategoryTree] = useState<CategorySummaryResponse[]>(
    []
  );
  const [secondLevelCategories, setSecondLevelCategories] = useState<
    CategorySummaryResponse[]
  >([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState<
    CategorySummaryResponse[]
  >([]);
  const [fourthLevelCategories, setFourthLevelCategories] = useState<
    CategorySummaryResponse[]
  >([]);
  const [selectedLevel1, setSelectedLevel1] =
    useState<CategorySummaryResponse | null>(null);
  const [selectedLevel2, setSelectedLevel2] =
    useState<CategorySummaryResponse | null>(null);
  const [selectedLevel3, setSelectedLevel3] =
    useState<CategorySummaryResponse | null>(null);
  const [selectedLevel4, setSelectedLevel4] =
    useState<CategorySummaryResponse | null>(null);
  const [categorySearchText, setCategorySearchText] = useState<string>("");
  const [loadingCategoryTree, setLoadingCategoryTree] = useState(false);

  const optionNames = useMemo(
    () =>
      optionGroups.map((group, index) => {
        const trimmed = group.name?.trim?.() || "";
        return trimmed || `Phân loại ${index + 1}`;
      }),
    [optionGroups]
  );

  // Form data
  const [formData, setFormData] = useState<Partial<CreateUserProductBulkDTO>>({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: "",
    active: false,
    variants: [],
    media: [],
    options: [],
    saveAsDraft: false,
  });

  // Custom form helper functions
  const getFieldValue = (field: string) => {
    return formFields[field as keyof typeof formFields];
  };

  const getFieldsValue = () => formFields;

  const setFieldValue = (field: string, value: any) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldsValue = (values: Partial<typeof formFields>) => {
    setFormFields((prev) => ({ ...prev, ...values }));
  };

  const validateFields = async () => {
    // Basic validation - you can expand this
    const errors: string[] = [];

    if (!formFields.name?.trim()) {
      errors.push("Tên sản phẩm không được để trống");
    }

    if (!formFields.categoryId) {
      errors.push("Vui lòng chọn danh mục sản phẩm");
    }

    if (formFields.basePrice <= 0) {
      errors.push("Giá sản phẩm phải lớn hơn 0");
    }

    if (errors.length > 0) {
      toastError("Vui lòng kiểm tra lại thông tin: " + errors.join(", "));
      throw new Error("Validation failed");
    }

    return formFields;
  };

  // Custom form object to replace Ant Design Form
  const form = {
    getFieldValue,
    getFieldsValue,
    setFieldValue,
    setFieldsValue,
    validateFields,
  };

  useEffect(() => {
    fetchCategories();
    loadCategoryTree();
  }, []);

  const createDefaultVariant = () => ({
    sku: "",
    corePrice: Number(getFieldValue("basePrice")) || 0,
    price: Number(getFieldValue("basePrice")) || 0,
    stockQuantity: 0,
    lengthCm: undefined,
    widthCm: undefined,
    heightCm: undefined,
    weightGrams: undefined,
    optionValueNames: [],
  });

  const regenerateVariantsFromOptions = (
    groups: OptionConfig[],
    baseVariants?: any[]
  ) => {
    const normalizedGroups = groups
      .map((group) => ({
        ...group,
        name: group.name.trim(),
        values: group.values.map((value) => value.trim()).filter(Boolean),
      }))
      .filter((group) => group.name && group.values.length > 0);

    const existingVariants =
      baseVariants || getFieldValue("variants") || variants;

    if (normalizedGroups.length === 0) {
      if (!Array.isArray(existingVariants) || existingVariants.length === 0) {
        const defaultVariant = createDefaultVariant();
        setVariants([defaultVariant]);
        setFieldValue("variants", [defaultVariant]);
      } else if (
        Array.isArray(existingVariants) &&
        (existingVariants.length > 1 ||
          (Array.isArray(existingVariants[0]?.optionValueNames)
            ? existingVariants[0].optionValueNames.length
            : 0) > 0)
      ) {
        const singleVariant = {
          ...existingVariants[0],
          optionValueNames: [],
        };
        setVariants([singleVariant]);
        setFieldValue("variants", [singleVariant]);
      }
      return;
    }

    const combinations = cartesianProduct(
      normalizedGroups.map((group) => group.values)
    );
    if (combinations.length === 0) {
      setVariants([]);
      setFieldValue("variants", []);
      return;
    }

    const newVariants = combinations.map((combo) => {
      const existingMatch = Array.isArray(existingVariants)
        ? existingVariants.find(
            (variant: any) =>
              Array.isArray(variant.optionValueNames) &&
              variant.optionValueNames.length === combo.length &&
              combo.every(
                (value, idx) => variant.optionValueNames[idx] === value
              )
          )
        : undefined;

      if (existingMatch) {
        return existingMatch;
      }

      const skuSuffix = combo
        .map((val) =>
          val
            .substring(0, 3)
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
        )
        .join("-");

      return {
        ...createDefaultVariant(),
        optionValueNames: combo,
        sku: skuSuffix || "VAR",
      };
    });

    setVariants(newVariants);
    setFieldValue("variants", newVariants);
  };

  const handleOptionNameChange = (index: number, value: string) => {
    const trimmed = (value || "").trim();

    if (
      trimmed &&
      optionGroups.some(
        (group, idx) => idx !== index && group.name.trim() === trimmed
      )
    ) {
      toastWarning(
        "Tên nhóm phân loại phải khác nhau trong cùng một sản phẩm."
      );
      return;
    }

    const updated = optionGroups.map((group, idx) =>
      idx === index ? { ...group, name: value } : group
    );
    setOptionGroups(updated);
    regenerateVariantsFromOptions(updated);
  };

  const handleOptionValueChange = (
    groupIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const trimmed = (value || "").trim();

    const updated = optionGroups.map((group, idx) => {
      if (idx !== groupIndex) return group;

      if (
        trimmed &&
        group.values.some(
          (v, i) => i !== valueIndex && (v || "").trim() === trimmed
        )
      ) {
        toastWarning("Giá trị phân loại trong cùng một nhóm phải khác nhau.");
        return group;
      }

      const nextValues = [...group.values];
      nextValues[valueIndex] = value;
      return { ...group, values: nextValues };
    });

    setOptionGroups(updated);
    regenerateVariantsFromOptions(updated);
  };

  const handleAddOptionValue = (groupIndex: number) => {
    const targetGroup = optionGroups[groupIndex];
    if (!targetGroup) return;
    if (targetGroup.values.length >= MAX_OPTION_VALUES) {
      toastWarning(
        `Mỗi phân loại chỉ được phép có tối đa ${MAX_OPTION_VALUES} tùy chọn.`
      );
      return;
    }
    const updated = optionGroups.map((group, idx) =>
      idx === groupIndex ? { ...group, values: [...group.values, ""] } : group
    );
    setOptionGroups(updated);
  };

  const handleRemoveOptionValue = (groupIndex: number, valueIndex: number) => {
    const updated = optionGroups.map((group, idx) => {
      if (idx !== groupIndex) return group;
      if (group.values.length === 1) {
        const nextValues = [...group.values];
        nextValues[0] = "";
        return { ...group, values: nextValues };
      }
      const nextValues = group.values.filter((_, vIdx) => vIdx !== valueIndex);
      return { ...group, values: nextValues.length ? nextValues : [""] };
    });
    setOptionGroups(updated);
    regenerateVariantsFromOptions(updated);
  };

  // Update selectedCategoryPath when categoryId changes
  useEffect(() => {
    const updatePath = () => {
      const categoryId = getFieldValue("categoryId");
      if (!categoryId) {
        setSelectedCategoryPath("");
        return;
      }

      const findCategoryPath = (
        tree: CategorySummaryResponse[],
        targetId: string,
        path: string[] = []
      ): string[] | null => {
        for (const cat of tree) {
          const currentPath = [...path, cat.name];
          if (cat.id === targetId) {
            return currentPath;
          }
          if (cat.children && cat.children.length > 0) {
            const found = findCategoryPath(cat.children, targetId, currentPath);
            if (found) return found;
          }
        }
        return null;
      };

      if (categoryTree.length > 0) {
        const path = findCategoryPath(categoryTree, String(categoryId));
        if (path && path.length > 0) {
          setSelectedCategoryPath(path.join(" > "));
          return;
        }
      }

      if (categories.length > 0) {
        const selectedCat = categories.find((c) => c.id === String(categoryId));
        if (selectedCat) {
          const cleanName = selectedCat.name.replace(/^—+\s*/, "");
          setSelectedCategoryPath(cleanName);
        } else {
          setSelectedCategoryPath("");
        }
      }
    };

    updatePath();
  }, [formFields.categoryId, categoryTree, categories]);

  const loadCategoryTree = async () => {
    if (categoryTree.length > 0) {
      return;
    }
    try {
      setLoadingCategoryTree(true);
      const response = await CategoryService.getCategoryTree();
      const tree = response?.data || [];
      setCategoryTree(tree);
    } catch (err: any) {
      console.error("Failed to load category tree:", err);
      toastError("Không thể tải danh mục");
    } finally {
      setLoadingCategoryTree(false);
    }
  };

  const handleSelectLevel1 = (category: CategorySummaryResponse) => {
    setSelectedLevel1(category);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);

    const children = category.children || [];
    setSecondLevelCategories(children);
    setThirdLevelCategories([]);
    setFourthLevelCategories([]);
  };

  const handleSelectLevel2 = (category: CategorySummaryResponse) => {
    setSelectedLevel2(category);
    setSelectedLevel3(null);
    setSelectedLevel4(null);

    const children = category.children || [];
    setThirdLevelCategories(children);
    setFourthLevelCategories([]);
  };

  const handleSelectLevel3 = (category: CategorySummaryResponse) => {
    setSelectedLevel3(category);
    setSelectedLevel4(null);

    const children = category.children || [];
    setFourthLevelCategories(children);
  };

  const handleConfirmCategory = () => {
    const finalCategory =
      selectedLevel4 || selectedLevel3 || selectedLevel2 || selectedLevel1;
    if (!finalCategory) {
      toastWarning("Vui lòng chọn ngành hàng");
      return;
    }

    if (finalCategory.children && finalCategory.children.length > 0) {
      toastWarning(
        "Vui lòng chọn đến cấp cuối cùng của ngành hàng (danh mục không có danh mục con)"
      );
      return;
    }

    const pathParts: string[] = [];
    if (selectedLevel1) pathParts.push(selectedLevel1.name);
    if (selectedLevel2) pathParts.push(selectedLevel2.name);
    if (selectedLevel3) pathParts.push(selectedLevel3.name);
    if (selectedLevel4) pathParts.push(selectedLevel4.name);

    setFieldValue("categoryId", finalCategory.id);
    setSelectedCategoryPath(pathParts.join(" > "));
    setCategoryModalOpen(false);
    toastSuccess("Đã chọn ngành hàng: " + pathParts.join(" > "));
  };

  const handleOpenCategoryModal = () => {
    setCategoryModalOpen(true);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setSecondLevelCategories([]);
    setThirdLevelCategories([]);
    setFourthLevelCategories([]);
    setCategorySearchText("");
  };

  const filterCategories = (
    cats: CategorySummaryResponse[],
    searchText: string
  ) => {
    if (!searchText.trim()) return cats;
    const lowerSearch = searchText.toLowerCase();
    return cats.filter((cat) => cat.name.toLowerCase().includes(lowerSearch));
  };

  const showVariantErrors = (errors: string[]) => {
    toastError("Thông tin biến thể chưa hợp lệ: " + errors.join("; "));
  };

  const validateVariantStructure = (variantList: any[]) => {
    const structureErrors: string[] = [];
    const hasOptionGroups = optionNames.length > 0;

    if (!variantList || variantList.length === 0) {
      structureErrors.push("Cần tạo ít nhất 1 biến thể trước khi tiếp tục.");
      return structureErrors;
    }

    if (!hasOptionGroups) {
      if (variantList.length !== 1) {
        structureErrors.push(
          "Sản phẩm không có phân loại → chỉ được phép có đúng 1 biến thể mặc định."
        );
      }

      variantList.forEach((variant, idx) => {
        const optionValues = (variant.optionValueNames || []).filter(
          (val: string) => val && val.trim()
        );
        if (optionValues.length > 0) {
          structureErrors.push(
            `Biến thể #${
              idx + 1
            }: Không được chọn phân loại khi sản phẩm không có tùy chọn.`
          );
        }
      });
    } else {
      variantList.forEach((variant, idx) => {
        const optionValues = Array.isArray(variant.optionValueNames)
          ? variant.optionValueNames
          : [];

        if (optionValues.length !== optionNames.length) {
          structureErrors.push(
            `Biến thể #${idx + 1}: Cần nhập đủ ${
              optionNames.length
            } giá trị phân loại.`
          );
          return;
        }

        optionValues.forEach((value: string, optIdx: number) => {
          if (!value || !value.trim()) {
            structureErrors.push(
              `Biến thể #${idx + 1}: Giá trị "${
                optionNames[optIdx]
              }" chưa được nhập.`
            );
          }
        });
      });
    }

    return structureErrors;
  };

  // Track form changes to detect unsaved data
  useEffect(() => {
    const values = getFieldsValue();
    const hasData =
      values.name ||
      values.description ||
      values.basePrice > 0 ||
      fileList.length > 0 ||
      videoList.length > 0 ||
      variants.length > 0 ||
      optionGroups.some((group) => {
        const nameHasValue = (group.name || "").trim().length > 0;
        const valueHasValue = group.values.some(
          (value) => (value || "").trim().length > 0
        );
        return nameHasValue || valueHasValue;
      });

    setHasUnsavedChanges(Boolean(hasData));
  }, [formFields, fileList, variants, optionGroups]);

  // Warn before leaving page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Bạn có chắc muốn thoát? Dữ liệu chưa được lưu sẽ bị mất.";
        return "Bạn có chắc muốn thoát? Dữ liệu chưa được lưu sẽ bị mất.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await CategoryService.getAllParents();

      console.log("📊 Categories Tree API Response:", response);

      let categoriesData: CategoryResponse[] = [];

      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray((response as any).data)
      ) {
        categoriesData = (response as any).data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }

      const flattenCategories = (
        categories: CategoryResponse[],
        level = 0
      ): CategoryResponse[] => {
        const result: CategoryResponse[] = [];

        categories.forEach((cat) => {
          if (cat.active) {
            const prefix = "—".repeat(level);
            result.push({
              ...cat,
              name: level > 0 ? `${prefix} ${cat.name}` : cat.name,
            });

            if (cat.children && cat.children.length > 0) {
              result.push(...flattenCategories(cat.children, level + 1));
            }
          }
        });

        return result;
      };

      const flatCategories = flattenCategories(categoriesData);
      setCategories(flatCategories);
      console.log(
        "✅ Loaded categories with hierarchy:",
        flatCategories.length
      );
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      toastError(err?.response?.data?.message || "Không thể tải danh mục");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values = await form.validateFields();

      const optionsForAPI: CreateUserProductOptionDTO[] = optionGroups
        .map((group) => {
          const name = group.name.trim();
          const values = group.values
            .map((value) => value.trim())
            .filter((value) => value.length > 0);

          if (!name || values.length === 0) {
            return null;
          }

          return {
            name,
            values: values.map((value, order) => ({
              name: value,
              displayOrder: order + 1,
            })),
          } as CreateUserProductOptionDTO;
        })
        .filter(
          (option): option is CreateUserProductOptionDTO => option !== null
        );

      const variantsToUse =
        variants.length > 0 ? variants : values.variants || [];

      console.log(
        "📊 Building payload - Variants from state:",
        variants.length
      );
      console.log("📊 Building payload - Options:", optionsForAPI.length);

      const variantsToSubmit =
        variants.length > 0 ? variants : values.variants || [];
      const structuralErrors = validateVariantStructure(variantsToSubmit);
      if (structuralErrors.length > 0) {
        showVariantErrors(structuralErrors);
        return;
      }

      const finalData: CreateUserProductBulkDTO = {
        ...formData,
        ...values,
        active: values.active ?? false,
        media: [
          ...fileList
            .filter((file) => file.status === "done" && (file as any).assetId)
            .map(
              (file, index) =>
                ({
                  mediaAssetId: (file as any).assetId as string,
                  type: "IMAGE" as const,
                  displayOrder: index + 1,
                  sortOrder: index + 1,
                  isPrimary: index === 0,
                } as any)
            ),
          ...videoList
            .filter((file) => file.status === "done" && (file as any).assetId)
            .map(
              (file, index) =>
                ({
                  mediaAssetId: (file as any).assetId as string,
                  type: "VIDEO" as const,
                  displayOrder: fileList.length + index + 1,
                  sortOrder: fileList.length + index + 1,
                  isPrimary: false,
                } as any)
            ),
        ],
        options: optionsForAPI,
        variants: variantsToSubmit.map((v: any) => {
          const variantOptionValues = (v.optionValueNames || []).filter(
            (val: string) => val && val.trim()
          );
          const options: Array<{
            optionId?: string;
            optionName: string;
            value: string;
          }> = [];

          if (optionNames.length > 0 && variantOptionValues.length > 0) {
            optionNames.forEach((optionName, idx) => {
              const value = variantOptionValues[idx];
              if (value && value.trim()) {
                options.push({
                  optionName: optionName,
                  value: value.trim(),
                });
              }
            });
          }

          return {
            sku: v.sku,
            corePrice: v.corePrice,
            price: v.price,
            stockQuantity: v.stockQuantity,
            lengthCm: v.lengthCm,
            widthCm: v.widthCm,
            heightCm: v.heightCm,
            weightGrams: v.weightGrams,
            options: options.length > 0 ? options : undefined,
            imageAssetId: v.imageAssetId || undefined,
          };
        }),
      };

      const result: any = await userProductService.createBulk(finalData);

      setHasUnsavedChanges(false);

      const createdProduct = result?.data?.product || result?.product || result;
      const productName = createdProduct?.name || values.name || "sản phẩm";
      const productId = createdProduct?.id;

      if (!productId) {
        toastError("Không thể lấy ID sản phẩm. Vui lòng kiểm tra lại.");
        return;
      }

      // Show success message
      toastSuccess(
        `✅ Tạo sản phẩm thành công! "${productName}" - Đang chuyển hướng...`
      );

      // Redirect after delay
      setTimeout(() => {
        router.push(`/shop/products/${productId}`);
      }, 2000);
    } catch (err: any) {
      toastError(err?.message || "Tạo sản phẩm thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const derivePublicOrigPath = (presignPath?: string | null) => {
    if (!presignPath) return "";
    const lastSlash = presignPath.lastIndexOf("/");
    if (lastSlash < 0) return "";
    const dir = presignPath.substring(0, lastSlash);
    const file = presignPath.substring(lastSlash + 1);
    const dot = file.lastIndexOf(".");
    const name = dot >= 0 ? file.substring(0, dot) : file;
    const ext = dot >= 0 ? file.substring(dot) : "";
    return `public/${dir}/${name}_orig${ext}`;
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const localUrl = URL.createObjectURL(file);
      const tempUid = `temp-${Date.now()}-${Math.random()}`;

      setFileList((prev) => [
        ...prev,
        {
          uid: tempUid,
          name: file.name,
          url: localUrl,
          status: "uploading",
          processing: true,
        } as any,
      ]);

      const res = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);
      if (!res.finalUrl) throw new Error("Xử lý ảnh chưa sẵn sàng");

      setFileList((prev) =>
        prev.map((f) => {
          if (f.uid === tempUid) {
            try {
              if (f.url && String(f.url).startsWith("blob:"))
                URL.revokeObjectURL(String(f.url));
            } catch {}
            return {
              ...f,
              url: res.finalUrl,
              status: "done",
              processing: false,
              assetId: res.assetId,
            } as any;
          }
          return f;
        })
      );
    } catch (err) {
      console.error("Upload failed:", err);
      toastError("Upload ảnh thất bại");
      setFileList((prev) =>
        prev.filter((f) => f.uid !== `temp-${Date.now()}-${Math.random()}`)
      );
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    const tempUid = `temp-video-${Date.now()}-${Math.random()}`;
    try {
      setUploadingVideo(true);
      const localUrl = URL.createObjectURL(file);

      setVideoList((prev) => [
        ...prev,
        {
          uid: tempUid,
          name: file.name,
          url: localUrl,
          status: "uploading",
          processing: true,
        } as any,
      ]);

      const res = await uploadPresigned(file, UploadContext.PRODUCT_VIDEO);
      if (!res.finalUrl) throw new Error("Xử lý video chưa sẵn sàng");

      setVideoList((prev) =>
        prev.map((f) => {
          if (f.uid === tempUid) {
            try {
              if (f.url && String(f.url).startsWith("blob:"))
                URL.revokeObjectURL(String(f.url));
            } catch {}
            return {
              ...f,
              url: res.finalUrl,
              status: "done",
              processing: false,
              assetId: res.assetId,
            } as any;
          }
          return f;
        })
      );
    } catch (err) {
      console.error("Video upload failed:", err);
      toastError("Upload video thất bại");
      setVideoList((prev) => prev.filter((f) => f.uid !== tempUid));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemoveVideo = (file: UploadFile) => {
    setVideoList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const handleAddOptionColumn = () => {
    if (optionGroups.length >= MAX_OPTION_GROUPS) {
      toastWarning(`Đã đạt tối đa ${MAX_OPTION_GROUPS} nhóm phân loại.`);
      return;
    }
    setNewOptionName("");
    setAddOptionModalOpen(true);
  };

  const handleRemoveOptionColumn = (index: number) => {
    const updatedGroups = optionGroups.filter((_, i) => i !== index);
    setOptionGroups(updatedGroups);
    regenerateVariantsFromOptions(updatedGroups);
    toastSuccess("Đã xóa phân loại");
  };

  const renderBasicTab = () => (
    <ProductBasicTabs
      form={form}
      onOpenCategoryModal={handleOpenCategoryModal}
      onUploadImage={handleUpload}
      onUploadVideo={handleVideoUpload}
      onShowImageModal={(file) => {
        setMediaModal({ type: "image", file });
      }}
      onShowVideoModal={(file) => {
        setMediaModal({ type: "video", file });
      }}
    />
  );

  const renderDetailsTab = () => <ProductDetailsTabs />;

  const renderDescriptionTab = () => {
    const { description, setBasicInfo } = useProductStore();

    return (
      <ProductDescription
        value={description}
        onChange={(val) => {
          setBasicInfo("description", val);
          form.setFieldValue("description", val);
        }}
        // error={form.getFieldError('description')} // Nếu bạn có validator
      />
    );
  };

  const renderSalesTab = () => {
    const handleUpdateVariants = (newVariants: any[]) => {
      setVariants(newVariants);
      setFieldValue("variants", newVariants);
    };

    const handleUploadVariantImage = async (file: File, index: number) => {
      try {
        const localUrl = URL.createObjectURL(file);
        const newVariants = [...variants];
        newVariants[index] = {
          ...newVariants[index],
          imageUrl: localUrl,
          imageProcessing: true,
        };
        setVariants(newVariants);

        const res = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);

        if (res.finalUrl && res.assetId) {
          const updatedVariants = [...variants];
          updatedVariants[index] = {
            ...updatedVariants[index],
            imageUrl: res.finalUrl,
            imageAssetId: res.assetId,
            imageProcessing: false,
          };

          setVariants(updatedVariants);
          setFieldValue("variants", updatedVariants);

          toastSuccess("Upload ảnh biến thể thành công");
          URL.revokeObjectURL(localUrl);
        } else {
          throw new Error("Không nhận được URL ảnh");
        }
      } catch (error) {
        toastError("Lỗi upload ảnh biến thể");
        const revertedVariants = [...variants];
        revertedVariants[index] = {
          ...revertedVariants[index],
          imageProcessing: false,
        };
        setVariants(revertedVariants);
      }
    };

    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <BasePriceSection
          value={Number(getFieldValue("basePrice")) || undefined}
          onChange={(val) => setFieldsValue({ basePrice: val })}
        />

        <ProductClassificationSection
          optionGroups={optionGroups}
          onAddGroup={handleAddOptionColumn}
          onRemoveGroup={handleRemoveOptionColumn}
          onUpdateGroupName={handleOptionNameChange}
          onAddValue={handleAddOptionValue}
          onRemoveValue={handleRemoveOptionValue}
          onUpdateValue={handleOptionValueChange}
        />

        <ProductVariantsSection hasOptions={optionGroups.length > 0}>
          <ProductVariantsTable
            variants={variants}
            optionNames={optionNames}
            onUpdateVariants={handleUpdateVariants}
            onUploadImage={handleUploadVariantImage}
          />
        </ProductVariantsSection>
      </div>
    );
  };

  const renderShippingTab = () => {
    const handleUpdateVariant = (index: number, field: string, value: any) => {
      const newVariants = [...variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      setVariants(newVariants);
      setFieldValue("variants", newVariants);
    };

    return (
      <ProductShippingTabs
        variants={variants}
        optionNames={optionNames}
        onUpdateVariant={handleUpdateVariant}
      />
    );
  };

  const watchedValues = formFields;
  const firstVariant = variants[0] || {};
  const previewImage = fileList.find((f) => f.status === "done")?.url;
  const totalStock = variants.reduce(
    (acc, curr) => acc + (curr.stockQuantity || 0),
    0
  );

  return (
    <div className="min-h-screen shadow-custom rounded-3xl bg-gray-50 p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center py-3 w-full">
        <h1 className="text-3xl font-semibold text-gray-900 italic uppercase">
          Thêm sản phẩm mới
        </h1>
        <div className="flex  gap-3 pt-2">
          <Button
            variant="edit"
            className="w-50! h-10!"
            onClick={() => {
              const currentData = getFieldsValue();
              setFormData((prev) => ({
                ...prev,
                ...currentData,
                variants: variants,
                saveAsDraft: true,
              }));
              handleSubmit();
            }}
            loading={loading}
          >
            Lưu nháp
          </Button>
          <ButtonField
            form="product-form"
            className="w-50! h-10!"
            htmlType="submit"
            type="login"
            onClick={handleSubmit}
            loading={loading}
          >
            Lưu & đăng bán
          </ButtonField>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div
          className="flex gap-6 items-start"
          style={{ position: "relative" }}
        >
          <div className="flex-1 w-full lg:w-[65%] min-w-0">
            <ProductFormTabs activeTab={activeTab} setActiveTab={setActiveTab}>
              <div className={activeTab === "basic" ? "block" : "hidden"}>
                {renderBasicTab()}
              </div>
              <div className={activeTab === "details" ? "block" : "hidden"}>
                {renderDetailsTab()}
              </div>
              <div className={activeTab === "description" ? "block" : "hidden"}>
                {renderDescriptionTab()}
              </div>
              <div className={activeTab === "sales" ? "block" : "hidden"}>
                {renderSalesTab()}
              </div>
              <div className={activeTab === "shipping" ? "block" : "hidden"}>
                {renderShippingTab()}
              </div>
            </ProductFormTabs>
          </div>

          <div className="w-full lg:w-[35%] lg:min-w-[320px]">
            <ProductPreviewSidebar
              previewImage={previewImage}
              name={watchedValues?.name}
              basePrice={watchedValues?.basePrice}
              description={watchedValues?.description}
              totalStock={totalStock}
            />
          </div>
        </div>
      </form>

      {mediaModal?.type === "image" && (
        <div
          className="fixed inset-0 bg-black/90 z-9999 flex justify-center items-center p-4 animate-in fade-in duration-200"
          onClick={() => setMediaModal(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full flex flex-col">
            <button
              onClick={() => setMediaModal(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2"
              aria-label="Đóng ảnh"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center">
              <h3 className="text-white font-semibold mb-4 text-lg truncate max-w-96">
                {mediaModal.file.name}
              </h3>
              <img
                src={mediaModal.file.url}
                alt={mediaModal.file.name}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      <CustomVideoModal
        open={mediaModal?.type === "video"}
        videoUrl={mediaModal?.file?.url}
        onCancel={() => setMediaModal(null)}
      />

      <AddOptionGroupModal
        isOpen={addOptionModalOpen}
        onClose={() => setAddOptionModalOpen(false)}
        onConfirm={(name) => {
          const newGroup: OptionConfig = {
            id: `group-${Date.now()}`,
            name: name,
            values: [""],
          };
          const updatedGroups = [...optionGroups, newGroup];
          setOptionGroups(updatedGroups);
          addOptionGroup(name);
          regenerateVariantsFromOptions(updatedGroups);
          setAddOptionModalOpen(false);
          toastSuccess(`Đã thêm nhóm: ${name}`);
        }}
        existingGroups={optionNames}
      />

      <CategorySelectionModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onConfirm={handleConfirmCategory}
        categoryTree={categoryTree}
        loading={loadingCategoryTree}
        selectedLevel1={selectedLevel1}
        selectedLevel2={selectedLevel2}
        selectedLevel3={selectedLevel3}
        selectedLevel4={selectedLevel4}
        onSelectLevel1={handleSelectLevel1}
        onSelectLevel2={handleSelectLevel2}
        onSelectLevel3={handleSelectLevel3}
        onSelectLevel4={setSelectedLevel4}
      />
    </div>
  );
}
