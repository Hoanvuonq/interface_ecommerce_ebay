'use client';

import walletService from '@/services/wallet/wallet.service';
import type { WalletWithdrawalCreateRequest } from '@/types/wallet/wallet.types';
import React, { useEffect, useState } from 'react';
import { WithdrawalRequestModalProps } from '../../_types/wallet';

export const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
    visible,
    onClose,
    onSuccess,
    availableBalance,
    walletType,
}) => {
    // --- State Management ---
    const [amount, setAmount] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [errors, setErrors] = useState<{ amount?: string; password?: string }>({});
    
    const [loading, setLoading] = useState(false);

    // Reset form khi đóng/mở modal
    useEffect(() => {
        if (visible) {
            setAmount('');
            setPassword('');
            setNote('');
            setErrors({});
        }
    }, [visible]);

    const handleClose = () => {
        setAmount('');
        setPassword('');
        setNote('');
        setErrors({});
        onClose();
    };

    // --- Validation Logic ---
    const validateForm = () => {
        const newErrors: { amount?: string; password?: string } = {};
        let isValid = true;
        const numAmount = parseInt(amount.replace(/,/g, ''), 10);

        // Validate Amount
        if (!amount) {
            newErrors.amount = 'Vui lòng nhập số tiền rút';
            isValid = false;
        } else if (isNaN(numAmount)) {
            newErrors.amount = 'Số tiền không hợp lệ';
            isValid = false;
        } else if (numAmount < 1000) {
            newErrors.amount = 'Số tiền rút tối thiểu 1,000 VND';
            isValid = false;
        } else if (numAmount > availableBalance) {
            newErrors.amount = 'Số dư không đủ để thực hiện giao dịch';
            isValid = false;
        }

        // Validate Password
        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu ví để xác thực';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setLoading(true);
            const numAmount = parseInt(amount.replace(/,/g, ''), 10);

            const request: WalletWithdrawalCreateRequest = {
                amount: numAmount,
                password: password,
                note: note,
                walletType,
            };

            const withdrawal = await walletService.createWithdrawalRequest(request);
            
            // Thông báo thành công (dùng alert hoặc toast library của bạn)
            window.alert('Tạo yêu cầu rút tiền thành công! Đang chờ admin duyệt.');
            
            onSuccess?.(withdrawal);
            handleClose();
        } catch (error: any) {
            window.alert(error.message || 'Tạo yêu cầu rút tiền thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Format input số tiền (thêm dấu phẩy)
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '');
        if (!isNaN(Number(value))) {
            const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            setAmount(formatted);
            // Clear error khi user đang nhập lại
            if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
        }
    };

    if (!visible) return null;

    return (
        // Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            {/* Modal Container */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Tạo yêu cầu rút tiền
                    </h3>
                    <button 
                        onClick={handleClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p className="font-semibold mb-1">Lưu ý quan trọng</p>
                                <p>• Tiền sẽ được chuyển vào <strong>tài khoản ngân hàng mặc định</strong>.</p>
                                <p>• Yêu cầu rút tiền sẽ chờ <strong>admin duyệt</strong>.</p>
                                <p>• Số tiền rút tối thiểu: <strong>1,000 VND</strong>.</p>
                                <p className="pt-1 text-blue-900">
                                    • Số dư khả dụng: <span className="font-bold text-base">{availableBalance.toLocaleString('vi-VN')} VND</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số tiền rút <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Nhập số tiền rút"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                    VND
                                </span>
                            </div>
                            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu ví <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if(errors.password) setErrors(prev => ({...prev, password: undefined}));
                                }}
                                placeholder="Nhập mật khẩu ví để xác thực"
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        {/* Note Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú (tùy chọn)
                            </label>
                            <div className="relative">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Nhập ghi chú (nếu có)"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                                />
                                <div className="text-right text-xs text-gray-400 mt-1">
                                    {note.length}/1000
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Tạo yêu cầu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};