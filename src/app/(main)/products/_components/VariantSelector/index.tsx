import {
  PublicProductOptionDTO,
  PublicProductVariantDTO,
} from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn";
import { resolveVariantImageUrl as resolveVariantImageUrlHelper } from "@/utils/products/media.helpers";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
interface VariantSelectorProps {
  variants: PublicProductVariantDTO[];
  options?: PublicProductOptionDTO[];
  onVariantChange: (variant: PublicProductVariantDTO | null) => void;
  className?: string;
  selectedVariant?: PublicProductVariantDTO | null;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  options,
  onVariantChange,
  className,
  selectedVariant: propSelectedVariant,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] =
    useState<PublicProductVariantDTO | null>(null);

  type NormalizedOption = {
    key: string;
    label: string;
    values: Array<{ id: string; label: string }>;
  };

  const normalizedOptions = React.useMemo<NormalizedOption[]>(() => {
    if (options?.length) {
      return options.map((option, index) => {
        const key = option.id || option.name || `option-${index}`;
        const label = option.name || `Option ${index + 1}`;
        const values =
          option.values?.map((value, valueIndex) => ({
            id: value.id || `${key}-value-${valueIndex}`,
            label: value.name || `Value ${valueIndex + 1}`,
          })) || [];
        return { key, label, values };
      });
    }
    const derivedMap: Record<
      string,
      {
        key: string;
        label: string;
        order: number;
        values: Record<string, string>;
      }
    > = {};
    variants.forEach((variant) => {
      (variant as any).optionValues?.forEach(
        (value: any, valueIndex: number) => {
          const optionLabel = value?.optionName || `Option ${valueIndex + 1}`;
          if (!derivedMap[optionLabel]) {
            derivedMap[optionLabel] = {
              key: optionLabel,
              label: optionLabel,
              order: valueIndex,
              values: {},
            };
          }
          const derivedKey = value.id || `${optionLabel}-${value.name}`;
          derivedMap[optionLabel].values[derivedKey] = value.name;
        }
      );
    });
    return Object.values(derivedMap)
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({
        key: item.key || `option-${index}`,
        label: item.label,
        values: Object.entries(item.values).map(([id, label]) => ({
          id,
          label,
        })),
      }));
  }, [options, variants]);

  const { valueToOptionKeyMap } = React.useMemo(() => {
    const optionKeyMap: Record<string, string> = {};
    normalizedOptions.forEach((option) => {
      option.values.forEach((value) => {
        optionKeyMap[value.id] = option.key;
      });
    });
    return { valueToOptionKeyMap: optionKeyMap };
  }, [normalizedOptions]);

  const normalizedVariants = useMemo(() => {
    return variants.map((variant) => {
      if (variant.attributes && Object.keys(variant.attributes).length > 0) {
        return variant;
      }
      const attributes: Record<string, string> = {};
      (variant as any).optionValues?.forEach(
        (optionValue: any, index: number) => {
          const optionKey = valueToOptionKeyMap[optionValue.id] || normalizedOptions[index]?.key;
          if (optionKey) {
            attributes[optionKey] = optionValue.id || optionValue.name;
          }
        }
      );
      return {
        ...variant,
        attributes,
      };
    });
  }, [variants, normalizedOptions, valueToOptionKeyMap]);

 useEffect(() => {
    if (propSelectedVariant) {
      const match = normalizedVariants.find(v => v.id === propSelectedVariant.id);
      
      if (match && match.attributes) {
         setSelectedAttributes(match.attributes);
      }
    }
  }, [propSelectedVariant, normalizedVariants]);
  useEffect(() => {
    const requiredKeys = normalizedOptions.map((option) => option.key);
    const selectedKeys = Object.keys(selectedAttributes).filter(
      (key) => selectedAttributes[key]
    );
    if (
      requiredKeys.length > 0 &&
      selectedKeys.length === requiredKeys.length
    ) {
      const matchingVariant = normalizedVariants.find((variant) => {
        return requiredKeys.every((key) => {
          const expectedValue = selectedAttributes[key];
          return expectedValue && variant.attributes?.[key] === expectedValue;
        });
      });
      const originalVariant = matchingVariant
        ? variants.find((v) => v.id === matchingVariant.id)
        : null;
      setSelectedVariant(originalVariant || null);
      onVariantChange(originalVariant || null);
    } else if (
      selectedKeys.length === 0 &&
      normalizedOptions.length === 0 &&
      variants.length === 1
    ) {
      setSelectedVariant(variants[0]);
      onVariantChange(variants[0]);
    } else {
      setSelectedVariant(null);
      onVariantChange(null);
    }
  }, [
    selectedAttributes,
    normalizedVariants,
    variants,
    normalizedOptions,
    onVariantChange,
  ]);

  useEffect(() => {
    if (normalizedVariants.length === 1 && normalizedVariants[0].attributes) {
      setSelectedAttributes(normalizedVariants[0].attributes);
    }
  }, [normalizedVariants]);

  const handleAttributeSelect = (optionKey: string, valueId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [optionKey]: valueId,
    }));
  };

  if (variants.length === 1) return null;

  const doesVariantMatchSelection = (
    variant: PublicProductVariantDTO & { attributes?: Record<string, string> },
    selection: Record<string, string | undefined>
  ) => {
    return Object.entries(selection).every(([key, value]) => {
      if (!value) return true;
      return variant.attributes?.[key] === value;
    });
  };

  const getValueImage = (optionKey: string, valueId: string) => {
    const variantWithImage = normalizedVariants.find(
      (v) =>
        v.attributes?.[optionKey] === valueId && (v.imageUrl || v.imageBasePath)
    );
    if (!variantWithImage) return null;

    return resolveVariantImageUrlHelper(variantWithImage as any, "_thumb");
  };

  return (
    <div className={cn("space-y-6", className)}>
      {normalizedOptions.map((option) => (
        <div key={option.key} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-gray-500 uppercase tracking-tight">
                {option.label}
              </span>
              {selectedAttributes[option.key] && (
                <span className="text-[13px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  {
                    option.values.find(
                      (v) => v.id === selectedAttributes[option.key]
                    )?.label
                  }
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(() => {
              const otherSelections = { ...selectedAttributes };
              delete otherSelections[option.key];
              const allowedValueIds = new Set<string>();
              normalizedVariants.forEach((variant) => {
                if (doesVariantMatchSelection(variant, otherSelections)) {
                  const variantValueId = variant.attributes?.[option.key];
                  if (variantValueId) allowedValueIds.add(variantValueId);
                }
              });

              return option.values.map((value) => {
                const valueId = value.id;
                const isSelected = selectedAttributes[option.key] === valueId;
                const isAvailable = allowedValueIds.has(valueId);
                const imgUrl = getValueImage(option.key, valueId);
                return (
                  <button
                    key={valueId}
                    onClick={() =>
                      isAvailable && handleAttributeSelect(option.key, valueId)
                    }
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border cursor-pointer",
                      isSelected
                        ? "border-orange-500 text-orange-600 bg-orange-50/50 ring-2 ring-orange-100"
                        : "border-gray-200 text-gray-700 hover:border-orange-300 bg-white"
                    )}
                  >
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-gray-100"
                      />
                    )}
                    <span className="px-1 uppercase">{value.label}</span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                        <CheckCircle className="w-2.5 h-2.5 text-white fill-current" />
                      </div>
                    )}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      ))}
    </div>
  );
};
