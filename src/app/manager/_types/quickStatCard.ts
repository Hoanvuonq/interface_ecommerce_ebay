export interface QuickStatCardProps {
    title: string;
    value: number;
    growth?: number;
    format?: 'currency' | 'number';
    icon?: React.ReactNode;
    loading?: boolean;
    className?: string;
}