type CreateProductMediaRequest = {
  url: string;
  type: string;
  title?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
};

type CreateProductOptionValueRequest = {
  id?: string;
  name: string;
  displayOrder?: number;
};

type CreateProductOptionRequest = {
  id?: string;
  name: string;
  values: CreateProductOptionValueRequest[];
};

type CreateProductBulkRequest = {
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  active?: boolean;
  media?: CreateProductMediaRequest[];
  options?: CreateProductOptionRequest[];
  saveAsDraft?: boolean;
  validateOnly?: boolean;
};