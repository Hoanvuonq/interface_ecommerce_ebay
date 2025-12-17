/**
 * Product utility functions
 */

/**
 * Generate slug from product name
 * Converts Vietnamese characters, removes special chars, converts to lowercase
 */
export function generateSlugFromName(name: string): string {
    if (!name) return "";

    const vietnameseMap: Record<string, string> = {
        à: "a", á: "a", ạ: "a", ả: "a", ã: "a", â: "a", ầ: "a", ấ: "a", ậ: "a", ẩ: "a", ẫ: "a",
        ă: "a", ằ: "a", ắ: "a", ặ: "a", ẳ: "a", ẵ: "a",
        è: "e", é: "e", ẹ: "e", ẻ: "e", ẽ: "e", ê: "e", ề: "e", ế: "e", ệ: "e", ể: "e", ễ: "e",
        ì: "i", í: "i", ị: "i", ỉ: "i", ĩ: "i",
        ò: "o", ó: "o", ọ: "o", ỏ: "o", õ: "o", ô: "o", ồ: "o", ố: "o", ộ: "o", ổ: "o", ỗ: "o",
        ơ: "o", ờ: "o", ớ: "o", ợ: "o", ở: "o", ỡ: "o",
        ù: "u", ú: "u", ụ: "u", ủ: "u", ũ: "u", ư: "u", ừ: "u", ứ: "u", ự: "u", ử: "u", ữ: "u",
        ỳ: "y", ý: "y", ỵ: "y", ỷ: "y", ỹ: "y",
        đ: "d",
        À: "A", Á: "A", Ạ: "A", Ả: "A", Ã: "A", Â: "A", Ầ: "A", Ấ: "A", Ậ: "A", Ẩ: "A", Ẫ: "A",
        Ă: "A", Ằ: "A", Ắ: "A", Ặ: "A", Ẳ: "A", Ẵ: "A",
        È: "E", É: "E", Ẹ: "E", Ẻ: "E", Ẽ: "E", Ê: "E", Ề: "E", Ế: "E", Ệ: "E", Ể: "E", Ễ: "E",
        Ì: "I", Í: "I", Ị: "I", Ỉ: "I", Ĩ: "I",
        Ò: "O", Ó: "O", Ọ: "O", Ỏ: "O", Õ: "O", Ô: "O", Ồ: "O", Ố: "O", Ộ: "O", Ổ: "O", Ỗ: "O",
        Ơ: "O", Ờ: "O", Ớ: "O", Ợ: "O", Ở: "O", Ỡ: "O",
        Ù: "U", Ú: "U", Ụ: "U", Ủ: "U", Ũ: "U", Ư: "U", Ừ: "U", Ứ: "U", Ự: "U", Ử: "U", Ữ: "U",
        Ỳ: "Y", Ý: "Y", Ỵ: "Y", Ỷ: "Y", Ỹ: "Y",
        Đ: "D",
    };

    let slug = name.trim();

    // Replace Vietnamese characters
    Object.keys(vietnameseMap).forEach((key) => {
        const regex = new RegExp(key, "g");
        slug = slug.replace(regex, vietnameseMap[key]);
    });

    // Convert to lowercase and replace spaces with hyphens
    slug = slug
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    return slug;
}

/**
 * Format price to VND currency
 */
export const formatVND = (price?: number): string => {
    if (price === undefined || price === null) {
        return 'Không xác định';
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

/**
 * Generate SKU from product name and option values
 */
export function generateSKU(
    productName: string,
    optionValues: Array<{ name: string }> = [],
    timestamp: boolean = true
): string {
    if (!productName) return "";

    // Get first 2-3 words from product name
    const prefix = productName
        .split(" ")
        .slice(0, 2)
        .map((word) => word.substring(0, 3).toUpperCase())
        .join("");

    // Get first 2-3 chars from each option value
    const suffix = optionValues
        .map((v) => v.name.substring(0, 3).toUpperCase())
        .join("-");

    // Add timestamp for uniqueness
    const ts = timestamp ? `-${Date.now().toString().slice(-4)}` : "";

    return `${prefix}${suffix ? "-" + suffix : ""}${ts}`.replace(/\s+/g, "");
}

/**
 * Validate SKU format
 */
export function isValidSKU(sku: string): boolean {
    // SKU should be alphanumeric with hyphens, 3-100 characters
    const regex = /^[A-Z0-9-]{3,100}$/;
    return regex.test(sku);
}

/**
 * Generate combinations of option values
 */
export function generateOptionCombinations<T extends { name: string }>(
    options: Array<{ values: T[] }>
): T[][] {
    if (!options.length) return [];
    if (options.length === 1) return options[0].values.map((v) => [v]);

    const [first, ...rest] = options;
    const restCombinations = generateOptionCombinations(rest);

    return first.values.flatMap((v) =>
        restCombinations.map((combo) => [v, ...combo])
    );
}

/**
 * Validate product form data
 */
export interface ProductValidationError {
    field: string;
    message: string;
}

export function validateProductData(data: {
    name?: string;
    slug?: string;
    basePrice?: number;
    categoryId?: string;
    variants?: Array<{ sku?: string; price?: number; stockQuantity?: number }>;
}): ProductValidationError[] {
    const errors: ProductValidationError[] = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push({ field: "name", message: "Tên sản phẩm là bắt buộc" });
    }

    if (!data.slug || data.slug.trim().length === 0) {
        errors.push({ field: "slug", message: "Slug là bắt buộc" });
    }

    if (data.basePrice === undefined || data.basePrice < 0) {
        errors.push({ field: "basePrice", message: "Giá cơ bản phải >= 0" });
    }

    if (!data.categoryId) {
        errors.push({ field: "categoryId", message: "Danh mục là bắt buộc" });
    }

    // Validate variants
    if (data.variants && data.variants.length > 0) {
        data.variants.forEach((variant, index) => {
            if (!variant.sku || variant.sku.trim().length === 0) {
                errors.push({
                    field: `variants[${index}].sku`,
                    message: `SKU của biến thể ${index + 1} là bắt buộc`,
                });
            }

            if (variant.price === undefined || variant.price < 0) {
                errors.push({
                    field: `variants[${index}].price`,
                    message: `Giá của biến thể ${index + 1} phải >= 0`,
                });
            }

            if (variant.stockQuantity === undefined || variant.stockQuantity < 0) {
                errors.push({
                    field: `variants[${index}].stockQuantity`,
                    message: `Số lượng kho của biến thể ${index + 1} phải >= 0`,
                });
            }
        });

        // Check for duplicate SKUs
        const skus = data.variants.map((v) => v.sku).filter(Boolean);
        const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
        if (duplicates.length > 0) {
            errors.push({
                field: "variants",
                message: `SKU bị trùng: ${[...new Set(duplicates)].join(", ")}`,
            });
        }
    }

    return errors;
}

/**
 * Calculate total inventory from variants
 */
export function calculateTotalInventory(
    variants: Array<{ stockQuantity: number }>
): number {
    return variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
}

/**
 * Find price range from variants
 */
export function getPriceRange(
    variants: Array<{ price: number }>
): { min: number; max: number } | null {
    if (!variants || variants.length === 0) return null;

    const prices = variants.map((v) => v.price).filter((p) => p !== undefined);
    if (prices.length === 0) return null;

    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
}

/**
 * Check if product is currently promoted (boosted)
 * Returns true if promotedUntil is not null and is in the future
 */
export function isProductPromoted(promotedUntil?: string | null): boolean {
    if (!promotedUntil) return false;
    
    try {
        const promotedDate = new Date(promotedUntil);
        const now = new Date();
        return promotedDate > now;
    } catch {
        return false;
    }
}

/**
 * Check if product is featured
 * Handles both boolean true and string "true" cases
 */
export function isProductFeatured(isFeatured?: boolean | string | null): boolean {
    if (isFeatured === null || isFeatured === undefined) {
        return false;
    }
    // Handle boolean
    if (typeof isFeatured === 'boolean') {
        return isFeatured === true;
    }
    // Handle string (in case API returns string)
    if (typeof isFeatured === 'string') {
        return isFeatured.toLowerCase() === 'true' || isFeatured === '1';
    }
    return false;
}

