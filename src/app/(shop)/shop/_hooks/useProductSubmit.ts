import { useRouter } from 'next/navigation';
import { useProductStore } from '../_store/product.store';
import { userProductService } from "@/services/products/product.service";
import { CreateUserProductBulkDTO } from "@/types/product/user-product.dto";
import { useToast } from '@/hooks/useToast';

export const useProductSubmit = () => {
  const router = useRouter();
  const {success, warning, error} = useToast();
  const store = useProductStore();
  
  // Logic validate structure (giữ nguyên logic cũ của bạn nhưng tách ra hàm)
  const validateVariantStructure = (variants: any[], optionNames: string[]) => {
     const errors: string[] = [];
     const hasOptions = optionNames.length > 0;

     if (!variants.length) {
         errors.push("Cần tạo ít nhất 1 biến thể.");
         return errors;
     }

     if (!hasOptions) {
         if (variants.length !== 1) errors.push("Sản phẩm không phân loại chỉ được có 1 biến thể.");
     } else {
         variants.forEach((v, idx) => {
             const vals = v.optionValueNames || [];
             if (vals.length !== optionNames.length) errors.push(`Biến thể #${idx+1} thiếu giá trị phân loại.`);
             vals.forEach((val: string, i: number) => {
                 if(!val || !val.trim()) errors.push(`Biến thể #${idx+1}: Giá trị "${optionNames[i]}" chưa nhập.`);
             });
         });
     }
     return errors;
  };

  const handleSubmit = async (form: any, saveAsDraft = false) => {
    try {
      store.setLoading(true);
      
      // 1. Validate Form Antd (Basic fields)
      const formValues = await form.validateFields();
      
      // 2. Validate Variants Structure from Store
      const optionNames = store.optionGroups.map(g => g.name);
      const variantErrors = validateVariantStructure(store.variants, optionNames);
      
      if (variantErrors.length > 0) {
        modal.error({
            title: "Lỗi biến thể",
            content: <div>{variantErrors.map((e, i) => <div key={i}>{e}</div>)}</div>
        });
        return;
      }

      // 3. Build Payload
      const optionsForAPI = store.optionGroups.map(g => ({
          name: g.name.trim(),
          values: g.values.map((v, i) => ({ name: v.trim(), displayOrder: i + 1 })).filter(v => v.name)
      })).filter(g => g.name && g.values.length > 0);

      const finalData: CreateUserProductBulkDTO = {
          ...formValues,
          name: store.name, // Ưu tiên lấy từ store nếu có bind
          description: store.description,
          categoryId: store.categoryId,
          saveAsDraft: saveAsDraft,
          options: optionsForAPI,
          media: [
             ...store.fileList.filter(f => f.status === 'done' && (f as any).assetId).map((f, i) => ({
                 mediaAssetId: (f as any).assetId,
                 type: 'IMAGE' as const,
                 displayOrder: i + 1,
                 isPrimary: i === 0,
                 sortOrder: i + 1
             })),
             ...store.videoList.filter(f => f.status === 'done' && (f as any).assetId).map((f, i) => ({
                 mediaAssetId: (f as any).assetId,
                 type: 'VIDEO' as const,
                 displayOrder: store.fileList.length + i + 1,
                 isPrimary: false,
                 sortOrder: store.fileList.length + i + 1
             }))
          ],
          variants: store.variants.map(v => ({
             sku: v.sku,
             corePrice: v.corePrice,
             price: v.price,
             stockQuantity: v.stockQuantity,
             lengthCm: v.lengthCm,
             widthCm: v.widthCm,
             heightCm: v.heightCm,
             weightGrams: v.weightGrams,
             imageAssetId: v.imageAssetId,
             options: optionNames.length > 0 ? optionNames.map((name, i) => ({
                 optionName: name,
                 value: v.optionValueNames[i]
             })) : undefined
          }))
      };

      // 4. Call API
      const result: any = await userProductService.createBulk(finalData);
      
      const createdProduct = result?.data?.product || result?.product || result;
      const productId = createdProduct?.id;

      if (!productId) throw new Error("Không lấy được ID sản phẩm");

      notification.success({
          message: "Tạo sản phẩm thành công!",
          description: "Đang chuyển hướng...",
          duration: 2
      });

      setTimeout(() => router.push(`/shop/products/${productId}`), 1000);

    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Tạo sản phẩm thất bại");
    } finally {
      store.setLoading(false);
    }
  };

  return { handleSubmit };
};