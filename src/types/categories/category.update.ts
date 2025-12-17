import { ShippingRestrictionsDTO } from "./category.detail";

export type UpdateCategoryRequest = {
    name: string; // required
    slug: string; // required in backend
    description?: string; // optional
    parentId?: string; // optional
    active: boolean; // required in backend
    imageAssetId?: string; // optional - MediaAsset ID
    defaultShippingRestrictions?: ShippingRestrictionsDTO; // optional - Shipping restrictions
};
