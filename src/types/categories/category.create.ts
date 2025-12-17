import { ShippingRestrictionsDTO } from "./category.detail";

export type CreateCategoryRequest = {
  name: string;
  description?: string;
  parentId?: string;
  active?: boolean;
  imageAssetId?: string;
  defaultShippingRestrictions?: ShippingRestrictionsDTO;
};
