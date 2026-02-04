"use client";

import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { useToast } from "@/hooks/useToast";
import {
  productOptionService,
  productVariantService,
  userProductService,
} from "@/app/(shop)/shop/products/_services/product.service";
import { ProductOptionDTO } from "@/types/product/product-option.dto";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { UploadContext } from "@/types/storage/storage.types";
import {
  resolveMediaUrl,
  resolveVariantImageUrl,
} from "@/utils/products/media.helpers";
import { ProductMediaModal, RichTextEditorModal } from "../_components";
import { ProductSidebar } from "../_components/ProductSidebar";

import { SectionLoading } from "@/components/loading";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MediaLightbox } from "../_components/MediaLightbox";
import { ProductDetailHeader } from "../_components/ProductDetailHeader";
import { ProductGeneralInfo } from "../_components/ProductGeneralInfo";
import { ProductMediaGallery } from "../_components/ProductMediaGallery";
import { ProductVariantTable } from "../_components/ProductVariantTable";
import { VariantDetailModal } from "../_components/VariantDetailModal";
import { VariantManagementModal } from "../_components/VariantManagementModal";
import {
  COLOR_NAME_MAP,
  COLOR_OPTION_REGEX,
  HEX_COLOR_REGEX,
  sanitizeColorValue,
} from "../_constants/variant.color";
import {
  StatusEnumType,
  VariantFormValues,
  VariantRow,
} from "../_types/variant";

export const ProductDetailScreen = () => {
  const params = useParams();
  const router = useRouter();
  const { success, error, warning, info } = useToast();
  const [product, setProduct] = useState<UserProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [richTextModalOpen, setRichTextModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{
    url: string;
    type: "IMAGE" | "VIDEO";
    title?: string;
  } | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptionDTO[]>([]);
  const [temporaryOptions, setTemporaryOptions] = useState<string[]>([]);

  function buildOptionValueRecord(
    initial?: Record<string, string>
  ): Record<string, string> {
    const record: Record<string, string> = {};
    const allOptionNames = [
      ...productOptions.map((opt) => opt.name),
      ...temporaryOptions,
    ];
    allOptionNames.forEach((optName) => {
      record[optName] = initial?.[optName] ?? "";
    });
    if (initial) {
      Object.keys(initial).forEach((key) => {
        if (!(key in record)) {
          record[key] = initial[key];
        }
      });
    }
    return record;
  }

  const variantRows = useMemo<VariantRow[]>(() => {
    if (!product) return [];
    return (product.variants || []).map(mapVariantToRow);
  }, [product, productOptions, temporaryOptions]);

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantModalMode, setVariantModalMode] = useState<
    "create" | "edit" | null
  >(null);
  const [variantModalValues, setVariantModalValues] =
    useState<VariantFormValues | null>(null);
  const [variantModalSaving, setVariantModalSaving] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [manageRows, setManageRows] = useState<VariantRow[]>([]);
  const [manageSaving, setManageSaving] = useState(false);
  const [manageImageUploadingRow, setManageImageUploadingRow] = useState<
    string | null
  >(null);
  const [variantModalImageUploading, setVariantModalImageUploading] =
    useState(false);
  const [editingOptionName, setEditingOptionName] = useState<string | null>(
    null
  );
  const [editingOptionValue, setEditingOptionValue] = useState<string>("");
  const [newOptionName, setNewOptionName] = useState<string>("");
  const [isAddingNewOption, setIsAddingNewOption] = useState(false);

  const optionNames = useMemo(() => {
    const fromDb = productOptions.length
      ? productOptions.map((opt) => opt.name)
      : [];
    const fromTemporary = temporaryOptions;
    const allOptions = [...new Set([...fromDb, ...fromTemporary])];

    if (allOptions.length > 0) {
      return allOptions;
    }

    // Fallback: derive from variant rows
    const derived = new Set<string>();
    variantRows.forEach((row) => {
      Object.keys(row.optionValues || {}).forEach((key) => {
        if (key?.trim()) {
          derived.add(key);
        }
      });
    });
    return Array.from(derived);
  }, [productOptions, temporaryOptions, variantRows]);

  function mapVariantToRow(variant: any): VariantRow {
    const baseRecord: Record<string, string> = {};
    if (Array.isArray(variant.optionValues)) {
      variant.optionValues.forEach((opt: any) => {
        const valueId = opt?.id;
        const valueName = opt?.name || "";

        // Tìm option chứa value này bằng cách match valueId với productOptions
        let optionName: string | null = null;

        // Thử lấy từ opt.option trước (nếu có)
        if (opt?.option?.name) {
          optionName = opt.option.name;
        } else if (valueId) {
          // Tìm trong productOptions, option nào có value với id này
          for (const productOption of productOptions) {
            if (productOption.values && Array.isArray(productOption.values)) {
              const foundValue = productOption.values.find(
                (v: any) => v.id === valueId
              );
              if (foundValue) {
                optionName = productOption.name;
                break;
              }
            }
          }
        }

        // Fallback: nếu không tìm thấy, dùng tên value (không nên xảy ra)
        if (!optionName) {
          optionName = opt?.optionName || `Option ${valueName}`;
        }

        if (optionName) {
          baseRecord[optionName] = valueName;
        }
      });
    }

    const imageUrl =
      resolveVariantImageUrl(variant, "_thumb") ||
      resolveVariantImageUrl(variant, "_medium");

    return {
      rowKey: variant.id || `${variant.sku}-${Math.random()}`,
      variantId: variant.id,
      sku: variant.sku || "",
      imageAssetId: variant.imageAssetId,
      imageUrl,
      corePrice: Number(variant.corePrice ?? product?.basePrice ?? 0),
      price: Number(variant.price ?? 0),
      stockQuantity: Number(variant.inventory?.stock ?? variant.stock ?? 0),
      lengthCm: Number(variant.lengthCm ?? 1),
      widthCm: Number(variant.widthCm ?? 1),
      heightCm: Number(variant.heightCm ?? 1),
      weightGrams: Number(variant.weightGrams ?? 1),
      optionValues: buildOptionValueRecord(baseRecord),
      isNew: false,
    };
  }
  const { uploadFile: uploadPresigned } = usePresignedUpload();

  const productId = params?.id as string;
  const totalVariants = product?.variants?.length ?? 0;
  const productHasOptions = productOptions.length > 0;
  const singleVariantMode = !productHasOptions;

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
      // fetchProductOptions();
    }
  }, [productId]);

  const createEmptyVariantRow = (): VariantRow => ({
    rowKey: `new-${Date.now()}-${Math.random()}`,
    sku: "",
    imageAssetId: undefined,
    imageUrl: undefined,
    corePrice: Number(product?.basePrice ?? 0) || 0,
    price: Number(product?.basePrice ?? 0) || 0,
    stockQuantity: 0,
    lengthCm: 1,
    widthCm: 1,
    heightCm: 1,
    weightGrams: 1,
    optionValues: buildOptionValueRecord(),
    isNew: true,
  });

  const openManageModal = () => {
    const existingRows = variantRows.map((row) => ({
      ...row,
      optionValues: { ...row.optionValues },
      isNew: false,
    }));
    setManageRows(
      existingRows.length ? existingRows : [createEmptyVariantRow()]
    );
    setTemporaryOptions([]);
    setManageModalOpen(true);
  };

  const closeManageModal = () => {
    if (manageSaving) return;
    setManageModalOpen(false);
    setManageRows([]);
  };

  const handleManageFieldChange =
    (
      rowKey: string,
      field: keyof Omit<
        VariantRow,
        "rowKey" | "variantId" | "optionValues" | "imageUrl"
      >
    ) =>
    (value: string | number) => {
      setManageRows((prev) =>
        prev.map((row) =>
          row.rowKey === rowKey
            ? {
                ...row,
                [field]: typeof row[field] === "number" ? Number(value) : value,
              }
            : row
        )
      );
    };

  const handleManageOptionChange = (
    rowKey: string,
    optionName: string,
    value: string
  ) => {
    setManageRows((prev) =>
      prev.map((row) =>
        row.rowKey === rowKey
          ? {
              ...row,
              optionValues: {
                ...row.optionValues,
                [optionName]: value,
              },
            }
          : row
      )
    );
  };

  const handleManageImageUpload = async (
    rowKey: string,
    file?: File | null
  ) => {
    if (!file) return;
    try {
      setManageImageUploadingRow(rowKey);
      const result = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);
      const nextUrl = result.finalUrl || URL.createObjectURL(file);
      setManageRows((prev) =>
        prev.map((row) =>
          row.rowKey === rowKey
            ? {
                ...row,
                imageAssetId: result.assetId,
                imageUrl: nextUrl,
              }
            : row
        )
      );
    } catch (err: any) {
      console.error("Upload variant image failed:", err);
      error(err?.message || "Không thể tải ảnh biến thể.");
    } finally {
      setManageImageUploadingRow(null);
    }
  };

  const handleManageImageClear = (rowKey: string) => {
    setManageRows((prev) =>
      prev.map((row) =>
        row.rowKey === rowKey
          ? {
              ...row,
              imageAssetId: undefined,
              imageUrl: undefined,
            }
          : row
      )
    );
  };

  const handleVariantModalImageUpload = async (file?: File | null) => {
    if (!file || !variantModalValues) return;
    try {
      setVariantModalImageUploading(true);
      const result = await uploadPresigned(file, UploadContext.PRODUCT_IMAGE);
      const nextUrl = result.finalUrl || URL.createObjectURL(file);
      setVariantModalValues((prev) =>
        prev
          ? {
              ...prev,
              imageAssetId: result.assetId,
              imageUrl: nextUrl,
            }
          : prev
      );
    } catch (err: any) {
      console.error("Upload variant modal image failed:", err);
      error(err?.message || "Không thể tải ảnh biến thể.");
    } finally {
      setVariantModalImageUploading(false);
    }
  };

  const handleVariantModalImageClear = () => {
    setVariantModalValues((prev) =>
      prev
        ? {
            ...prev,
            imageAssetId: undefined,
            imageUrl: undefined,
          }
        : prev
    );
  };

  const handleAddManageRow = () => {
    if (singleVariantMode && manageRows.length >= 1) {
      // Bắn thông báo nhắc nhở nhưng vẫn thực hiện hành động
      warning("Lưu ý về phân loại", {
        description:
          "Sản phẩm không có option. Bạn nên thêm 'Màu sắc' hoặc 'Kích thước' để quản lý hiệu quả hơn.",
        duration: 5000, // Để lâu hơn chút cho người dùng đọc
      });
    }

    setManageRows((prev) => [...prev, createEmptyVariantRow()]);
  };

  const handleRemoveManageRow = (rowKey: string, isNew?: boolean) => {
    if (!isNew) {
      error("Không thể xoá biến thể đã tồn tại tại đây.");
      return;
    }
    setManageRows((prev) => prev.filter((row) => row.rowKey !== rowKey));
  };

  const closeVariantModal = () => {
    if (variantModalSaving) return;
    setVariantModalOpen(false);
    setVariantModalMode(null);
    setVariantModalValues(null);
  };

  const handleVariantModalFieldChange = <
    K extends keyof Omit<VariantFormValues, "optionValues">
  >(
    field: K,
    value: VariantFormValues[K]
  ) => {
    setVariantModalValues((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const handleVariantModalOptionChange = (
    optionName: string,
    value: string
  ) => {
    setVariantModalValues((prev) =>
      prev
        ? {
            ...prev,
            optionValues: {
              ...prev.optionValues,
              [optionName]: value,
            },
          }
        : prev
    );
  };

  const validateVariantForm = (values: VariantFormValues) => {
    if (!values.sku.trim()) {
      throw new Error("Vui lòng nhập SKU.");
    }
    if (values.corePrice <= 0) {
      throw new Error("Giá gốc phải lớn hơn 0.");
    }
    if (values.price <= 0) {
      throw new Error("Giá bán phải lớn hơn 0.");
    }
    if (values.stockQuantity < 0) {
      throw new Error("Tồn kho không hợp lệ.");
    }
    if (values.lengthCm <= 0 || values.widthCm <= 0 || values.heightCm <= 0) {
      throw new Error("Kích thước phải lớn hơn 0.");
    }
    if (values.weightGrams <= 0) {
      throw new Error("Trọng lượng phải lớn hơn 0.");
    }
    if (productOptions.length > 0) {
      const missingOptions = productOptions.filter(
        (opt) => !values.optionValues[opt.name]?.trim()
      );
      if (missingOptions.length) {
        throw new Error(
          `Thiếu giá trị cho các tùy chọn: ${missingOptions
            .map((opt) => opt.name)
            .join(", ")}.`
        );
      }
    } else {
      const hasOptionValues = Object.values(values.optionValues).some((val) =>
        val?.trim()
      );
      if (hasOptionValues) {
        throw new Error(
          "Sản phẩm không có phân loại nên không cần giá trị tùy chọn."
        );
      }
    }
  };

  const validateManageRow = (row: VariantRow, index: number): string[] => {
    const errors: string[] = [];
    const label = row.variantId
      ? `Biến thể #${index + 1}`
      : `Biến thể mới #${index + 1}`;

    if (!row.sku.trim()) {
      errors.push(`${label}: Vui lòng nhập SKU.`);
    }
    if (row.corePrice <= 0) {
      errors.push(`${label}: Giá gốc phải lớn hơn 0.`);
    }
    if (row.price <= 0) {
      errors.push(`${label}: Giá bán phải lớn hơn 0.`);
    }
    if (row.stockQuantity < 0) {
      errors.push(`${label}: Tồn kho không hợp lệ.`);
    }
    if (row.lengthCm <= 0 || row.widthCm <= 0 || row.heightCm <= 0) {
      errors.push(`${label}: Kích thước phải lớn hơn 0.`);
    }
    if (row.weightGrams <= 0) {
      errors.push(`${label}: Trọng lượng phải lớn hơn 0.`);
    }

    // Validate options: bao gồm cả options từ DB và temporary options
    const allOptionNames = optionNames; // Đã merge DB + temporary
    if (allOptionNames.length > 0) {
      const missingOptions = allOptionNames.filter(
        (optName) => !row.optionValues[optName]?.trim()
      );
      if (missingOptions.length) {
        errors.push(
          `${label}: Thiếu giá trị cho các tùy chọn: ${missingOptions.join(
            ", "
          )}.`
        );
      }
    } else {
      const hasOptionValues = Object.values(row.optionValues).some((val) =>
        val?.trim()
      );
      if (hasOptionValues) {
        errors.push(
          `${label}: Sản phẩm không có phân loại, không cần giá trị tùy chọn.`
        );
      }
    }

    return errors;
  };

  const buildRowPayload = (row: VariantRow) => {
    // Include cả options từ DB và temporary options
    const allOptionNames = optionNames; // Đã merge DB + temporary
    const optionsPayload =
      allOptionNames.length > 0
        ? allOptionNames.map((optName) => {
            const optionFromDb = productOptions.find(
              (opt) => opt.name === optName
            );
            return {
              optionId: optionFromDb?.id, // Có optionId nếu là option từ DB
              optionName: optName,
              value: (row.optionValues[optName] || "").trim(),
            };
          })
        : undefined;

    const basePayload = {
      sku: row.sku.trim(),
      imageAssetId: row.imageAssetId,
      corePrice: row.corePrice,
      price: row.price,
      stockQuantity: row.stockQuantity,
      lengthCm: row.lengthCm,
      widthCm: row.widthCm,
      heightCm: row.heightCm,
      weightGrams: row.weightGrams,
      options: optionsPayload,
    };

    if (row.variantId) {
      return {
        type: "update" as const,
        payload: { variantId: row.variantId, ...basePayload },
      };
    }

    return { type: "create" as const, payload: basePayload };
  };

  const handleVariantModalSubmit = async () => {
    if (!product || !variantModalValues || !variantModalMode) return;

    if (variantModalImageUploading) {
      error("Chưa thể lưu!", {
        description: "Vui lòng đợi quá trình tải ảnh hoàn tất.",
      });
      return;
    }

    if (
      variantModalMode === "create" &&
      singleVariantMode &&
      (product.variants?.length ?? 0) >= 1
    ) {
      warning("Nhắc nhở quản lý", {
        description:
          "Sản phẩm đang có nhiều biến thể nhưng thiếu nhóm phân loại (Màu sắc, Size...).",
      });
    }

    try {
      setVariantModalSaving(true);

      // --- PHẦN LOGIC TẠO PAYLOAD BỊ THIẾU ---
      // Gom dữ liệu từ modal values thành object để gửi lên API
      const basePayload = {
        sku: variantModalValues.sku.trim(),
        imageAssetId: variantModalValues.imageAssetId,
        corePrice: variantModalValues.corePrice,
        price: variantModalValues.price,
        stockQuantity: variantModalValues.stockQuantity,
        lengthCm: variantModalValues.lengthCm,
        widthCm: variantModalValues.widthCm,
        heightCm: variantModalValues.heightCm,
        weightGrams: variantModalValues.weightGrams,
        // Map options nếu có (Màu sắc, Size...)
        options:
          productOptions.length > 0
            ? productOptions.map((opt: any) => ({
                optionName: opt.name,
                value: (variantModalValues.optionValues[opt.name] || "").trim(),
              }))
            : undefined,
      };

      // Khai báo biến payload ở đây để fix lỗi ts(2304)
      const payload: any =
        variantModalMode === "edit" && variantModalValues.variantId
          ? {
              updateRequests: [
                {
                  variantId: variantModalValues.variantId,
                  ...basePayload,
                },
              ],
            }
          : {
              createRequests: [basePayload],
            };
      // -----------------------------------------

      // Bây giờ biến payload đã tồn tại để thực hiện lệnh này
      await productVariantService.upsert(product.id, payload);

      success(
        variantModalMode === "edit" ? "Cập nhật thành công" : "Thêm thành công"
      );

      closeVariantModal();
      await fetchProductDetail();
    } catch (err: any) {
      error("Lỗi hệ thống", {
        description: err?.message || "Không thể lưu biến thể.",
      });
    } finally {
      setVariantModalSaving(false);
    }
  };

  const handleSaveManageRows = async () => {
    if (!product) return;

    // 1. Kiểm tra trạng thái upload ảnh
    if (manageImageUploadingRow !== null) {
      error("Chưa thể lưu!", {
        description: "Vui lòng đợi quá trình tải ảnh hoàn tất.",
      });
      return;
    }

    // 2. Kiểm tra dữ liệu rỗng
    if (!manageRows.length) {
      error("Lỗi dữ liệu", { description: "Chưa có biến thể nào để lưu." });
      return;
    }

    // 3. Cảnh báo về phân loại (Thay thế Modal.confirm bằng Warning Toast)
    if (singleVariantMode && manageRows.length > 1) {
      warning("Lưu ý phân loại", {
        description: `Bạn đang lưu ${manageRows.length} biến thể nhưng chưa có nhóm phân loại. Bạn nên thêm 'Màu sắc/Kích thước' để quản lý tốt hơn.`,
        duration: 6000,
      });
      // Không return nữa, cho phép chạy tiếp xuống logic lưu
    }

    // 4. Validate tất cả rows
    const allErrors: string[] = [];
    manageRows.forEach((row, idx) => {
      const rowErrors = validateManageRow(row, idx);
      allErrors.push(...rowErrors);
    });

    if (allErrors.length > 0) {
      error("Cần sửa lỗi validation", {
        description:
          allErrors.length === 1
            ? allErrors[0]
            : `Có ${allErrors.length} lỗi cần sửa. Vui lòng kiểm tra lại các dòng biến thể.`,
      });
      return;
    }

    // 5. Build Payload và gọi API
    try {
      const createRequests: any[] = [];
      const updateRequests: any[] = [];

      manageRows.forEach((row) => {
        const result = buildRowPayload(row);
        if (result.type === "create") {
          createRequests.push(result.payload);
        } else {
          updateRequests.push(result.payload);
        }
      });

      if (!createRequests.length && !updateRequests.length) {
        info("Thông báo", {
          description: "Không có thay đổi nào mới để cập nhật.",
        });
        return;
      }

      setManageSaving(true);

      await productVariantService.upsert(product.id, {
        createRequests,
        updateRequests,
      });

      success("Thành công", { description: "Đã cập nhật danh sách biến thể." });

      // 6. Dọn dẹp và làm mới dữ liệu
      setTemporaryOptions([]);
      // await fetchProductOptions();
      closeManageModal();
      await fetchProductDetail();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể lưu biến thể.";
      error("Lỗi hệ thống", { description: errMsg });
    } finally {
      setManageSaving(false);
    }
  };

  const getColorPreview = (optionName: string, value?: string) => {
    if (!value) return null;
    if (
      !COLOR_OPTION_REGEX.test(optionName) &&
      !HEX_COLOR_REGEX.test(value.trim())
    ) {
      const normalized = value.trim().toLowerCase();
      if (!COLOR_NAME_MAP[normalized]) {
        return null;
      }
    }
    return sanitizeColorValue(value);
  };

  // const fetchProductOptions = async () => {
  //   try {
  //     const response = await productOptionService.list(productId);
  //     let data: ProductOptionDTO[] = [];

  //     if (response && typeof response === "object") {
  //       if ("data" in response && response.data) {
  //         // ApiResponseDTO<PageDTO<ProductOptionDTO>>
  //         if (
  //           "content" in response.data &&
  //           Array.isArray(response.data.content)
  //         ) {
  //           data = response.data.content;
  //         } else if (Array.isArray(response.data)) {
  //           data = response.data;
  //         }
  //       } else if (Array.isArray(response)) {
  //         data = response;
  //       }
  //     }

  //     setProductOptions(data);
  //   } catch (err: any) {
  //     console.error("Error fetching product options:", err);
  //     setProductOptions([]);
  //   }
  // };

  // ESC key to close preview
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewMedia) setPreviewMedia(null);
        if (mediaModalOpen) setMediaModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [previewMedia, mediaModalOpen]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await userProductService.getById(productId);
      const data =
        response && typeof response === "object" && "data" in response
          ? response.data
          : response;
      setProduct(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: StatusEnumType, active: boolean) => {
    const statusConfig: Record<
      StatusEnumType,
      { bg: string; text: string; icon: any }
    > = {
      DRAFT: {
        bg: "bg-gray-100 text-gray-700",
        text: "Bản nháp",
        icon: FileText,
      },
      PENDING: {
        bg: "bg-yellow-100 text-yellow-700",
        text: "Chờ duyệt",
        icon: Clock,
      },
      APPROVED: {
        bg: "bg-green-100 text-green-700",
        text: "Đã duyệt",
        icon: CheckCircle2,
      },
      REJECTED: {
        bg: "bg-red-100 text-red-700",
        text: "Bị từ chối",
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    const activeBg = active
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";
    const activeText = active ? "Đang hoạt động" : "Tạm dừng";
    const ActiveIcon = active ? CheckCircle2 : XCircle;

    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg}`}
        >
          <Icon className="w-4 h-4" />
          {config.text}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${activeBg}`}
        >
          <ActiveIcon className="w-4 h-4" />
          {activeText}
        </span>
      </div>
    );
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      setActionLoading(true);
      await userProductService.delete(product.id, product.version);

      success("Đã xóa sản phẩm thành công!", {
        description: `Sản phẩm "${product.name}" đã được gỡ khỏi hệ thống.`,
      });

      setTimeout(() => {
        router.push("/shop/products");
      }, 500);
    } catch (err: any) {
      error("Xóa sản phẩm thất bại!", {
        description: err?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <SectionLoading message="Đang tải thông tin sản phẩm..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600 mb-6">
            Sản phẩm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.push("/shop/products")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductDetailHeader
        product={product}
        getStatusBadge={getStatusBadge}
        onOpenMedia={() => setMediaModalOpen(true)}
        onOpenManage={openManageModal}
        onEdit={() => router.push(`/shop/products/edit/${product.id}`)}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <ProductGeneralInfo
            product={product}
            onOpenRichText={() => setRichTextModalOpen(true)}
          />

          <ProductMediaGallery
            media={product.media || []}
            onManage={() => setMediaModalOpen(true)}
            onPreview={(item) => {
              const isVideo =
                item.type === "VIDEO" || item.url?.includes("/videos/");
              const mediaUrl = resolveMediaUrl(item, "_medium");
              const largeUrl = resolveMediaUrl(item, "_large");

              setPreviewMedia({
                url: largeUrl || mediaUrl,
                type: isVideo ? "VIDEO" : "IMAGE",
                title: item.title || item.altText,
              });
            }}
          />
          <ProductVariantTable
            variantRows={variantRows}
            optionNames={optionNames}
            onOpenManage={openManageModal}
          />
        </div>

        <aside className="w-full lg:w-100 shrink-0">
          <ProductSidebar
            product={product}
            actionLoading={actionLoading}
            onDelete={handleDelete}
          />
        </aside>
      </div>  

      <VariantManagementModal
        isOpen={manageModalOpen}
        onClose={closeManageModal}
        productName={product.name}
        manageRows={manageRows}
        optionNames={optionNames}
        productOptions={productOptions}
        isAddingNewOption={isAddingNewOption}
        newOptionName={newOptionName}
        manageSaving={manageSaving}
        manageImageUploadingRow={manageImageUploadingRow}
        onFieldChange={handleManageFieldChange}
        onOptionChange={handleManageOptionChange}
        onImageUpload={handleManageImageUpload}
        onImageClear={handleManageImageClear}
        onAddRow={handleAddManageRow}
        onRemoveRow={handleRemoveManageRow}
        onSave={handleSaveManageRows}
        onStartAddOption={() => {
          setIsAddingNewOption(true);
          setNewOptionName("");
        }}
        setNewOptionName={setNewOptionName}
        onBlurNewOption={() => {
          if (
            newOptionName.trim() &&
            !optionNames.includes(newOptionName.trim())
          ) {
            setTemporaryOptions((p) => [...p, newOptionName.trim()]);
            setManageRows((p) =>
              p.map((row) => ({
                ...row,
                optionValues: {
                  ...row.optionValues,
                  [newOptionName.trim()]: "",
                },
              }))
            );
          }
          setNewOptionName("");
          setIsAddingNewOption(false);
        }}
        getColorPreview={getColorPreview}
      />

      <VariantDetailModal
        open={variantModalOpen}
        mode={variantModalMode}
        values={variantModalValues}
        onClose={closeVariantModal}
        onSubmit={handleVariantModalSubmit}
        saving={variantModalSaving}
        imageUploading={variantModalImageUploading}
        onFieldChange={handleVariantModalFieldChange}
        onOptionChange={handleVariantModalOptionChange}
        onImageUpload={handleVariantModalImageUpload}
        onImageClear={handleVariantModalImageClear}
        productOptions={productOptions}
        singleVariantMode={singleVariantMode}
        totalVariants={totalVariants}
      />

      <ProductMediaModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        productId={product.id}
        productName={product.name}
        productVersion={product.version}
        existingMedia={product.media || []}
        onSuccess={() => {
          fetchProductDetail();
        }}
      />

      <MediaLightbox
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />

      {product && (
        <RichTextEditorModal
          open={richTextModalOpen}
          productId={product.id}
          onClose={() => setRichTextModalOpen(false)}
        />
      )}
    </div>
  );
};
