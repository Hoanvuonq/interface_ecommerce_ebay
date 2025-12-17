// src/components/ButtonField/type.ts

import { ReactNode, MouseEvent } from "react";

export interface ButtonFieldProps {
    // Thuộc tính UI/Logic
    type?: "primary" | "secondary" | "danger" | "text"; // Thay thế Antd type bằng logic màu
    htmlType?: "button" | "submit" | "reset"; // Thuộc tính HTML hợp lệ
    size?: "small" | "middle" | "large"; // Thay thế Antd size bằng logic size
    block?: boolean; // Thay thế Antd block
    loading?: boolean;
    disabled?: boolean;
    
    // Icon và Nội dung
    icon?: ReactNode;
    children: ReactNode;
    
    // HTML Props
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}