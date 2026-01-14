import { useState } from "react";

export interface ProductFormFields {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  variants: any[];
  active: boolean;
}

export interface ProductFormHelper {
  getFieldValue: (field: string) => any;
  getFieldsValue: () => ProductFormFields;
  setFieldValue: (field: string, value: any) => void;
  setFieldsValue: (values: Partial<ProductFormFields>) => void;
  validateFields: () => Promise<ProductFormFields>;
}

export const useProductForm = (onValidationError: (message: string) => void) => {
  const [formFields, setFormFields] = useState<ProductFormFields>({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: "",
    variants: [],
    active: false,
  });

  const getFieldValue = (field: string) => {
    return formFields[field as keyof ProductFormFields];
  };

  const getFieldsValue = () => formFields;

  const setFieldValue = (field: string, value: any) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldsValue = (values: Partial<ProductFormFields>) => {
    setFormFields((prev) => ({ ...prev, ...values }));
  };

  const validateFields = async (): Promise<ProductFormFields> => {
    const errors: string[] = [];

    if (!formFields.name?.trim()) {
      errors.push("Tên sản phẩm không được để trống");
    }

    if (!formFields.categoryId) {
      errors.push("Vui lòng chọn danh mục sản phẩm");
    }

    if (formFields.basePrice <= 0) {
      errors.push("Giá sản phẩm phải lớn hơn 0");
    }

    if (errors.length > 0) {
      onValidationError("Vui lòng kiểm tra lại thông tin: " + errors.join(", "));
      throw new Error("Validation failed");
    }

    return formFields;
  };

  return {
    formFields,
    setFormFields,
    getFieldValue,
    getFieldsValue,
    setFieldValue,
    setFieldsValue,
    validateFields,
  };
};
