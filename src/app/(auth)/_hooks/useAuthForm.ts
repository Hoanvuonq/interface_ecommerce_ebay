import { useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast"; 

export interface AuthFormData {
  username?: string;
  password?: string;
  email?: string;
  confirmPassword?: string;
  [key: string]: any;
}

export const authValidation = {
  login: (values: AuthFormData) => {
    const errors: Partial<AuthFormData> = {};
    if (!values.username?.trim()) errors.username = "Tên đăng nhập là bắt buộc";
    if (!values.password?.trim()) errors.password = "Mật khẩu là bắt buộc";
    return Object.keys(errors).length > 0 ? errors : null;
  },

  register: (values: AuthFormData) => {
    const errors: Partial<AuthFormData> = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.username || values.username.trim().length < 3)
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    
    if (!values.email || !emailRegex.test(values.email))
      errors.email = "Email không hợp lệ";

    if (!values.password || values.password.length < 6)
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    else if (!passwordPattern.test(values.password))
      errors.password = "Mật khẩu phải chứa chữ hoa, thường và số";

    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";

    return Object.keys(errors).length > 0 ? errors : null;
  }
};

export const useAuthForm = <T extends AuthFormData>(
  initialValues: T,
  validateFn: (values: T) => Partial<T> | null
) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const { error: toastError } = useToast(); 

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleSubmit = (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFn(formData);
    
    if (validationErrors) {
      setErrors(validationErrors);
      const firstMessage = Object.values(validationErrors)[0] as string;
      toastError("Thông tin chưa hợp lệ", { description: firstMessage });
      return;
    }

    onSubmit(formData);
  };

  return {
    formData,
    errors,
    setFormData, 
    setErrors,
    handleChange,
    handleSubmit
  };
};