/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(shop)/shop/products/_utils/product.payload.ts

export const mapCreateProductPayload = (formData: any): any => {
  return {
    name: formData.name,
    description: formData.description,
    basePrice: Number(formData.basePrice) || 0,
    categoryId: formData.categoryId,
    active: formData.active ?? true,
    saveAsDraft: formData.saveAsDraft ?? false,

    allowedShippingChannels: formData.allowedShippingChannels || [
      "STANDARD",
      "EXPRESS",
    ],
    regions: formData.regions || ["VIETNAM"],

    options: {
      items:
        formData.options?.map((opt: any) => ({
          name: opt.name,
          values: opt.values.map((v: any) => ({
            name: v.name,
            displayOrder: Number(v.displayOrder) || 1,
          })),
        })) || [],
    },

    variants: {
      items:
        formData.variants?.map((v: any) => ({
          sku: v.sku,
          price: Number(v.price),
          stock: Number(v.stockQuantity || v.stock),
          weightGrams: Number(v.weightGrams) || 0,
          lengthCm: Number(v.lengthCm) || 10,
          widthCm: Number(v.widthCm) || 10,
          heightCm: Number(v.heightCm) || 10,
          imageAssetId: v.imageAssetId,
          options:
            v.options?.map((o: any) => ({
              optionName: o.optionName,
              value: o.value,
            })) || [],
        })) || [],
    },

    media: {
      imageIds:
        formData.media
          ?.filter((m: any) => m.type === "IMAGE" || !m.type)
          .map((m: any) => m.mediaAssetId || m.id) || [],
      videoIds:
        formData.media
          ?.filter((m: any) => m.type === "VIDEO")
          .map((m: any) => m.mediaAssetId || m.id) || [],
    },
  };
};
