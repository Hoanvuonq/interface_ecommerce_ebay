export const mapApiToFormState = (apiData: any) => {
  if (!apiData) return { optionGroups: [], variants: [], version: 0 };

  const optionGroups =
    apiData.options?.map((opt: any) => ({
      id: opt.id || `opt-${Math.random()}`,
      name: opt.name,
      values: opt.values?.map((v: any) => v.name) || [],
    })) || [];

  const variants =
    apiData.variants?.map((v: any) => ({
      sku: v.sku,
      price: v.price,
      stockQuantity: v.inventory?.stock ?? v.stock ?? 0,
      lengthCm: v.lengthCm,
      widthCm: v.widthCm,
      heightCm: v.heightCm,
      weightGrams: v.weightGrams,
      imageAssetId: v.imageAssetId,
      imageUrl: v.imagePath,
      optionValueNames: v.optionValues?.map((ov: any) => ov.name) || [],
    })) || [];

  const version = apiData.version ?? 0;

  return { optionGroups, variants, version };
};
