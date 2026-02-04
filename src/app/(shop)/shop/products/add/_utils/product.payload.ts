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
    
    // Đảm bảo có ít nhất 1 kênh vận chuyển
    allowedShippingChannels: formData.allowedShippingChannels?.length > 0 
      ? formData.allowedShippingChannels 
      : ["STANDARD"],
    
    regions: formData.regions || ["VIETNAM"],

    // 🟢 Wrap Options chuẩn Swagger
    options: {
      items: formData.optionGroups?.map((opt: any) => ({
        name: opt.name,
        values: opt.values
          .filter((v: string) => v.trim() !== "")
          .map((v: string, index: number) => ({
            name: v,
            displayOrder: index + 1,
          })),
      })) || [],
    },

    // 🟢 Wrap Variants chuẩn Swagger
    variants: {
      items: formData.variants?.map((v: any) => ({
        sku: v.sku,
        price: Number(v.price),
        stock: Number(v.stockQuantity || v.stock || 0), // BE dùng "stock"
        weightGrams: Number(v.weightGrams) || 0,
        lengthCm: Number(v.lengthCm) || 10,
        widthCm: Number(v.widthCm) || 10,
        heightCm: Number(v.heightCm) || 10,
        imageAssetId: v.imageAssetId || null,
        // 🟢 Map lại options dựa trên optionNames
        options: v.optionValueNames?.map((val: string, idx: number) => ({
          optionName: formData.optionNames[idx] || "",
          value: val
        })) || []
      })) || [],
    },

    // 🟢 Media ID nguyên thủy
    media: {
      imageIds: formData.fileList
        ?.filter((m: any) => m.status === "done")
        .map((m: any) => m.response?.data?.assetId || m.assetId)
        .filter(Boolean) || [],
      videoIds: formData.videoList
        ?.filter((m: any) => m.status === "done")
        .map((m: any) => m.response?.data?.assetId || m.assetId)
        .filter(Boolean) || [],
    },
  };
};