export interface ShippingRestrictionsDTO {
  restrictionType?: "NONE" | "LOCAL_RADIUS" | "COUNTRIES" | "REGIONS";
  maxShippingRadiusKm?: number;
  countryRestrictionType?: "ALLOW_ONLY" | "DENY_ONLY";
  restrictedCountries?: string[];
  restrictedRegions?: string[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  parentId?: string;
  imageBasePath?: string;
  imagePath?: string;
  imageAssetId?: string;
  imageExtension?: string;
  parent?: CategoryResponse;
  children?: CategoryResponse[];
  defaultShippingRestrictions?: ShippingRestrictionsDTO;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}
