import { useForm, UseFormProps } from 'react-hook-form';
import * as Yup from 'yup';
import { LoginRequest } from '@/auth/_types/auth'; 

// =================================================================
// ĐỊNH NGHĨA LOGIN SCHEMA CHUẨN NEXT.JS/REACT (SỬ DỤNG STRING CHO PHONE)
// =================================================================

// Kiểu dữ liệu nhận vào từ form (luôn là string)
interface FormInput {
    username?: string;
    phone?: string;
    password: string;
}

export const loginSchema = Yup.object<FormInput>().shape({
    username: Yup.string().optional(),
    
    phone: Yup.string()
        .optional()
        .nullable() 
        .transform((value, originalValue) => {
            // Xử lý chuỗi rỗng/null/undefined thành undefined
            if (originalValue === '' || originalValue === null || originalValue === undefined) {
                return undefined;
            }
            return originalValue; // Giữ nguyên là string để validate
        })
        .test('is-number-valid', 'Số điện thoại phải là số hợp lệ', function (value) {
            if (value === undefined || value === null || value === '') {
                return true;
            }
            if (!/^\d+$/.test(value)) {
                return this.createError({ path: 'phone', message: 'Số điện thoại phải là số' });
            }
            return true;
        }),

    password: Yup.string().required('Mật khẩu là bắt buộc'),
}).test('atLeastOne', 'Vui lòng nhập Tên đăng nhập hoặc Số điện thoại', function (value) {
    // Nếu có username
    if (value.username && value.username.length > 0) {
        return true;
    }
    
    // Nếu có phone VÀ phone là số (đã qua kiểm tra is-number-valid)
    if (value.phone && /^\d+$/.test(value.phone)) {
        return true;
    }

    // Nếu cả hai đều rỗng/không hợp lệ
    return this.createError({
        path: 'username', 
        message: 'Vui lòng nhập Tên đăng nhập hoặc Số điện thoại' 
    });
});

// =================================================================

interface UseLoginFormProps extends UseFormProps<LoginRequest> {}

export const useLoginForm = (props?: UseFormProps<FormInput>) => {
    // Sử dụng FormInput cho useForm để khớp với schema
    return useForm<FormInput>({
        // KHÔNG CÓ RESOLVER
        mode: 'onSubmit', 
        defaultValues: {
            username: '',
            phone: '', 
            password: '',
        },
        ...props,
    });
};