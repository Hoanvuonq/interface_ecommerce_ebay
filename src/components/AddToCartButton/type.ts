export interface IButtonProps {
    variantId: string;
    productName?: string;
    maxQuantity?: number;
    size?: 'small' | 'middle' | 'large';
    block?: boolean;
    type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
    icon?: React.ReactNode;
    showQuantityInput?: boolean;
    defaultQuantity?: number;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    className?: string;
    disabled?: boolean;
}

export interface IInputProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number | null) => void;
    size: 'small' | 'middle' | 'large';
    disabled?: boolean;
}
