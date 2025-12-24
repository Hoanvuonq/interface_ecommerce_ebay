export interface ProductDimensions {
    length: number; // cm
    width: number;  // cm
    height: number; // cm
    weight: number; // kg
    quantity: number; // số lượng sản phẩm
}

export interface OptimizedPackage {
    length: number; // cm
    width: number;  // cm
    height: number; // cm
    weight: number; // kg (tổng weight của tất cả sản phẩm)
}

/**
 * Tính toán dimensions tối ưu cho nhiều sản phẩm
 * Sử dụng thuật toán First Fit Decreasing (FFD) với rotation
 * 
 * @param products Mảng các sản phẩm với dimensions và quantity
 * @returns Dimensions tối ưu (length, width, height) và tổng weight
 */
export function optimizePackageDimensions(
    products: ProductDimensions[]
): OptimizedPackage {
    if (products.length === 0) {
        // Default dimensions nếu không có sản phẩm
        return {
            length: 30,
            width: 30,
            height: 20,
            weight: 1,
        };
    }

    if (products.length === 1) {
        // Nếu chỉ có 1 sản phẩm, dùng dimensions của sản phẩm đó
        const product = products[0];
        return {
            length: product.length,
            width: product.width,
            height: product.height,
            weight: product.weight * product.quantity,
        };
    }

    // Nếu có nhiều sản phẩm, tính toán tối ưu
    // Mở rộng mảng để tính đến quantity
    const expandedProducts: Array<{
        length: number;
        width: number;
        height: number;
        weight: number;
        volume: number;
    }> = [];

    products.forEach((product) => {
        for (let i = 0; i < product.quantity; i++) {
            const dims = [product.length, product.width, product.height].sort(
                (a, b) => a - b
            );
            expandedProducts.push({
                length: dims[2], // longest
                width: dims[1],  // medium
                height: dims[0], // shortest
                weight: product.weight,
                volume: product.length * product.width * product.height,
            });
        }
    });

    // Sắp xếp theo volume giảm dần (First Fit Decreasing)
    expandedProducts.sort((a, b) => b.volume - a.volume);

    // Tính toán dimensions tối ưu
    // Strategy: Xếp các sản phẩm theo chiều dài, rộng, cao
    let totalWeight = 0;

    // Phương pháp 1: Xếp theo chiều dài (stack theo length)
    let maxLength = 0;
    let maxWidth = 0;
    let sumHeight = 0;

    expandedProducts.forEach((product) => {
        maxLength = Math.max(maxLength, product.length);
        maxWidth = Math.max(maxWidth, product.width);
        sumHeight += product.height;
        totalWeight += product.weight;
    });

    const option1 = {
        length: maxLength,
        width: maxWidth,
        height: sumHeight,
        volume: maxLength * maxWidth * sumHeight,
    };

    // Phương pháp 2: Xếp theo chiều rộng (stack theo width)
    let sumLength = 0;
    maxWidth = 0;
    let maxHeight = 0;

    expandedProducts.forEach((product) => {
        sumLength += product.length;
        maxWidth = Math.max(maxWidth, product.width);
        maxHeight = Math.max(maxHeight, product.height);
    });

    const option2 = {
        length: sumLength,
        width: maxWidth,
        height: maxHeight,
        volume: sumLength * maxWidth * maxHeight,
    };

    // Phương pháp 3: Xếp theo chiều cao (stack theo height)
    maxLength = 0;
    let sumWidth = 0;
    maxHeight = 0;

    expandedProducts.forEach((product) => {
        maxLength = Math.max(maxLength, product.length);
        sumWidth += product.width;
        maxHeight = Math.max(maxHeight, product.height);
    });

    const option3 = {
        length: maxLength,
        width: sumWidth,
        height: maxHeight,
        volume: maxLength * sumWidth * maxHeight,
    };

    // Chọn phương pháp có volume nhỏ nhất (tối ưu nhất)
    const options = [option1, option2, option3];
    options.sort((a, b) => a.volume - b.volume);
    const bestOption = options[0];

    // Đảm bảo dimensions hợp lý (tối thiểu 10cm, tối đa 200cm)
    const optimizedLength = Math.max(10, Math.min(200, Math.ceil(bestOption.length)));
    const optimizedWidth = Math.max(10, Math.min(200, Math.ceil(bestOption.width)));
    const optimizedHeight = Math.max(10, Math.min(200, Math.ceil(bestOption.height)));

    // Sắp xếp lại theo thứ tự: length >= width >= height (chuẩn đóng gói)
    const sortedDims = [optimizedLength, optimizedWidth, optimizedHeight].sort(
        (a, b) => b - a
    );

    return {
        length: sortedDims[0],
        width: sortedDims[1],
        height: sortedDims[2],
        weight: Math.max(0.1, totalWeight), // Tối thiểu 0.1kg
    };
}

/**
 * Lấy dimensions từ item trong checkout preview
 * Hỗ trợ nhiều format khác nhau của item data
 */
export function extractItemDimensions(item: any): ProductDimensions | null {
    // ✅ Priority 1: Lấy từ item trực tiếp (backend đã trả về trong PreviewItem)
    if (item.lengthCm != null || item.widthCm != null || item.heightCm != null || item.weightGrams != null) {
        const lengthCm = item.lengthCm;
        const widthCm = item.widthCm;
        const heightCm = item.heightCm;
        const weightGrams = item.weightGrams;

        // ✅ Kiểm tra tất cả dimensions phải có giá trị hợp lệ
        if (lengthCm != null && lengthCm > 0 &&
            widthCm != null && widthCm > 0 &&
            heightCm != null && heightCm > 0 &&
            weightGrams != null && weightGrams > 0) {

            // Convert grams to kg
            const weightKg = weightGrams / 1000;

            return {
                length: lengthCm,
                width: widthCm,
                height: heightCm,
                weight: weightKg,
                quantity: item.quantity || 1,
            };
        }
    }

    // ✅ Priority 2: Thử lấy từ variant (fallback cho các API khác)
    const variant = item.variant || item.variantData;
    if (variant) {
        const lengthCm = variant.lengthCm;
        const widthCm = variant.widthCm;
        const heightCm = variant.heightCm;
        const weightGrams = variant.weightGrams;

        // ✅ Kiểm tra tất cả dimensions phải có giá trị hợp lệ
        if (lengthCm != null && lengthCm > 0 &&
            widthCm != null && widthCm > 0 &&
            heightCm != null && heightCm > 0 &&
            weightGrams != null && weightGrams > 0) {

            // Convert grams to kg
            const weightKg = weightGrams / 1000;

            return {
                length: lengthCm,
                width: widthCm,
                height: heightCm,
                weight: weightKg,
                quantity: item.quantity || 1,
            };
        }
    }

    // ✅ Không tìm thấy dimensions hợp lệ, return null
    return null;
}

