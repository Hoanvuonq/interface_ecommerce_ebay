import { useCallback, useState } from "react";
import { OptionConfig } from "./useOptionManagement";
import _ from "lodash";
import { Variant } from "../_components/Products/ProductVariantsTable/type";
const cartesianProduct = (arrays: string[][]): string[][] => {
  if (!arrays.length) return [];
  return arrays.reduce<string[][]>(
    (acc, curr) =>
      acc.flatMap((accItem) => curr.map((currItem) => [...accItem, currItem])),
    [[]],
  );
};

export const useVariantManagement = (
  optionNames: string[],
  basePrice: number,
) => {
  const [variants, setVariants] = useState<any[]>([]);

  const createDefaultVariant = useCallback(
    () => ({
      sku: "",
      corePrice: basePrice || 0,
      price: basePrice || 0,
      stockQuantity: 0,
      lengthCm: undefined,
      widthCm: undefined,
      heightCm: undefined,
      weightGrams: undefined,
      optionValueNames: [],
    }),
    [basePrice],
  );

  const regenerateVariantsFromOptions = useCallback(
    (groups: OptionConfig[], baseVariants?: any[]) => {
      const normalizedGroups = groups
        .map((group) => ({
          ...group,
          name: _.trim(group.name),
          values: group.values.map((value) => _.trim(value)).filter(Boolean),
        }))
        .filter((group) => group.name && group.values.length > 0);

      const existingVariants = baseVariants || variants;

      if (normalizedGroups.length === 0) {
        if (!Array.isArray(existingVariants) || existingVariants.length === 0) {
          const defaultVariant = createDefaultVariant();
          setVariants([defaultVariant]);
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
        }
        return;
      }

      const combinations = cartesianProduct(
        normalizedGroups.map((group) => group.values),
      );
      if (combinations.length === 0) {
        setVariants([]);
        return;
      }

      const newVariants = combinations.map((combo) => {
        const existingMatch = Array.isArray(existingVariants)
          ? existingVariants.find(
              (variant: any) =>
                Array.isArray(variant.optionValueNames) &&
                variant.optionValueNames.length === combo.length &&
                combo.every(
                  (value, idx) => variant.optionValueNames[idx] === value,
                ),
            )
          : undefined;

        if (existingMatch) {
          // Always preserve imageUrl, imageAssetId, and any custom fields from the old variant
          return {
            ...createDefaultVariant(),
            ...existingMatch,
            optionValueNames: combo,
          };
        }

        // Helper to remove Vietnamese tones and map đ/Đ
        function removeVietnameseTones(str: string) {
          return str
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
        }

        const skuSuffix = combo
          .map((val) =>
            removeVietnameseTones(val)
              .substring(0, 3)
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, ""),
          )
          .join("-");

        return {
          ...createDefaultVariant(),
          optionValueNames: combo,
          sku: skuSuffix || "VAR",
        };
      });

      setVariants(newVariants);
    },
    [variants, createDefaultVariant],
  );

  const validateVariantStructure = useCallback(
    (variantList: any[]): string[] => {
      const structureErrors: string[] = [];
      const hasOptionGroups = optionNames.length > 0;

      if (!variantList || variantList.length === 0) {
        structureErrors.push("Cần tạo ít nhất 1 biến thể trước khi tiếp tục.");
        return structureErrors;
      }

      if (!hasOptionGroups) {
        if (variantList.length !== 1) {
          structureErrors.push(
            "Sản phẩm không có phân loại → chỉ được phép có đúng 1 biến thể mặc định.",
          );
        }

        variantList.forEach((variant, idx) => {
          const optionValues = (variant.optionValueNames || []).filter(
            (val: string) => val && val.trim(),
          );
          if (optionValues.length > 0) {
            structureErrors.push(
              `Biến thể #${
                idx + 1
              }: Không được chọn phân loại khi sản phẩm không có tùy chọn.`,
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
              } giá trị phân loại.`,
            );
            return;
          }

          optionValues.forEach((value: string, optIdx: number) => {
            if (!value || !value.trim()) {
              structureErrors.push(
                `Biến thể #${idx + 1}: Giá trị "${
                  optionNames[optIdx]
                }" chưa được nhập.`,
              );
            }
          });
        });
      }

      return structureErrors;
    },
    [optionNames],
  );

  const handleUpdateVariants = useCallback((newVariants: any[]) => {
    setVariants(newVariants);
  }, []);

  const handleUpdateVariant = (
    index: number,
    field: keyof Variant,
    value: any,
  ) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
      return newVariants;
    });
  };

  const handleUploadVariantImage = useCallback(
    async (file: File, index: number) => {
      // This is a simplified wrapper. Full implementation requires:
      // - uploadPresigned function
      // - UploadContext
      // - onSuccess/onError callbacks
      // Should be called from component with full parameters
      return Promise.resolve();
    },
    [],
  );

  return {
    variants,
    setVariants,
    createDefaultVariant,
    regenerateVariantsFromOptions,
    validateVariantStructure,
    handleUpdateVariants,
    handleUpdateVariant,
    handleUploadVariantImage,
  };
};
