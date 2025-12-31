import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { voucherService } from '@/services/voucher/voucher.service';
import { toast } from 'sonner';
import _ from 'lodash';

export const useVoucherLogic = (props: any) => {
    const { shopId, context, forcePlatform, onSelectVoucher } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');

    const { data: vouchersData, isLoading, refetch } = useQuery({
        queryKey: ['vouchers', shopId, context, forcePlatform],
        queryFn: async () => {
            const fetchParams = {
                ...context,
                totalAmount: _.get(context, 'totalAmount', 0),
                shippingFee: _.get(context, 'shippingFee', 0),
                shopId: (!forcePlatform && shopId) ? shopId : undefined
            };

            return (!forcePlatform && shopId)
                ? await voucherService.getShopVouchersWithContext(fetchParams)
                : await voucherService.getPlatformVouchersWithContext(fetchParams);
        },
        enabled: modalOpen, 
    });

    const applyMutation = useMutation({
        mutationFn: async (code: string) => {
            if (!props.onApplyVoucher || !shopId) throw new Error('Invalid config');
            return await props.onApplyVoucher(shopId, code);
        },
        onSuccess: (success) => {
            if (success) {
                toast.success('Áp dụng voucher thành công!');
                setVoucherCode('');
                refetch();
            } else {
                toast.error('Mã voucher không hợp lệ');
            }
        },
        onError: () => toast.error('Không thể áp dụng voucher')
    });

    const handleConfirm = async (selected: any) => {
        setModalOpen(false);
        if (onSelectVoucher) await onSelectVoucher(selected || {});
    };

    const handleRemove = async (e?: React.MouseEvent) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        if (onSelectVoucher) {
            await onSelectVoucher({});
            toast.info('Đã gỡ bỏ voucher');
        }
    };

    return {
        modalOpen,
        setModalOpen,
        voucherCode,
        setVoucherCode,
        vouchersData,
        isLoading,
        applyMutation,
        handleConfirm,
        handleRemove
    };
};
