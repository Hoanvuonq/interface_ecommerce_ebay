/**
 * Wallet Service - API calls cho wallet
 */

import { request } from '@/utils/axios.customize';
import type {
    WalletResponse,
    WalletTransactionResponse,
    WalletDepositResponse,
    WalletWithdrawalResponse,
    CreateWalletRequest,
    WalletDepositRequest,
    WalletWithdrawRequest,
    WalletWithdrawalCreateRequest,
    WalletPaymentRequest,
    WalletRefundRequest,
    WalletTransferRequest,
    ChangeWalletPasswordRequest,
    ResetWalletPasswordRequest,
    PageDto,
    WalletType,
} from '@/types/wallet/wallet.types';
import type { ApiResponse } from '@/api/_types/api.types';

const WALLET_API_BASE = '/v1/wallets';

class WalletService {
    // ========== Wallet Management ==========

    /**
     * Tạo wallet mới cho user hiện tại
     */
    async createWallet(requestData: CreateWalletRequest): Promise<WalletResponse> {
        const response = await request<ApiResponse<WalletResponse>>({
            url: WALLET_API_BASE,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Lấy wallet của user hiện tại theo type
     * @param type WalletType (SHOP, BUYER, PLATFORM). Bắt buộc phải truyền
     */
    async getMyWallet(type: WalletType): Promise<WalletResponse> {
        const response = await request<ApiResponse<WalletResponse[]>>({
            url: `${WALLET_API_BASE}/me`,
            method: 'GET',
            params: { type },
        });
        const wallets = (response as any).data;
        if (!wallets || wallets.length === 0) {
            throw new Error('Wallet not found');
        }
        // Lấy wallet đầu tiên từ list (vì mỗi user chỉ có 1 wallet cho mỗi type)
        return wallets[0];
    }

    /**
     * Lấy wallet theo user ID (admin only)
     */
    async getWalletByUserId(userId: string): Promise<WalletResponse> {
        const response = await request<ApiResponse<WalletResponse>>({
            url: `${WALLET_API_BASE}/user/${userId}`,
            method: 'GET',
        });
        return (response as any).data;
    }

    // ========== Transaction Operations ==========

    /**
     * Nạp tiền vào wallet qua PayOS
     * Trả về payment link và QR code
     */
    async deposit(requestData: WalletDepositRequest): Promise<WalletDepositResponse> {
        const response = await request<ApiResponse<WalletDepositResponse>>({
            url: `${WALLET_API_BASE}/deposit`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Rút tiền từ wallet (deprecated - dùng createWithdrawalRequest thay thế)
     * @deprecated
     */
    async withdraw(requestData: WalletWithdrawRequest): Promise<WalletTransactionResponse> {
        const response = await request<ApiResponse<WalletTransactionResponse>>({
            url: `${WALLET_API_BASE}/withdraw`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Tạo withdrawal request (yêu cầu rút tiền)
     * Request sẽ ở trạng thái PENDING và chờ admin duyệt
     * Tự động sử dụng tài khoản ngân hàng mặc định
     */
    async createWithdrawalRequest(requestData: WalletWithdrawalCreateRequest): Promise<WalletWithdrawalResponse> {
        const response = await request<ApiResponse<WalletWithdrawalResponse>>({
            url: `${WALLET_API_BASE}/withdrawal-requests`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Lấy danh sách withdrawal requests của user hiện tại
     */
    async getMyWithdrawalRequests(page: number = 0, size: number = 20, sortBy: string = 'createdDate', sortDir: string = 'desc'): Promise<PageDto<WalletWithdrawalResponse>> {
        const response = await request<ApiResponse<PageDto<WalletWithdrawalResponse>>>({
            url: `${WALLET_API_BASE}/withdrawal-requests`,
            method: 'GET',
            params: { page, size, sortBy, sortDir },
        });
        return (response as any).data;
    }

    /**
     * Thanh toán từ wallet
     */
    async payment(requestData: WalletPaymentRequest): Promise<WalletTransactionResponse> {
        const response = await request<ApiResponse<WalletTransactionResponse>>({
            url: `${WALLET_API_BASE}/payment`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Hoàn tiền vào wallet
     */
    async refund(requestData: WalletRefundRequest): Promise<WalletTransactionResponse> {
        const response = await request<ApiResponse<WalletTransactionResponse>>({
            url: `${WALLET_API_BASE}/refund`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Chuyển tiền giữa các wallet
     */
    async transfer(requestData: WalletTransferRequest): Promise<WalletTransactionResponse> {
        const response = await request<ApiResponse<WalletTransactionResponse>>({
            url: `${WALLET_API_BASE}/transfer`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    // ========== Transaction History ==========

    /**
     * Lấy lịch sử giao dịch của wallet hiện tại
     * @param page - Số trang (default: 0)
     * @param size - Số lượng items mỗi trang (default: 20)
     * @param walletType - WalletType (SHOP, BUYER, PLATFORM) - BẮT BUỘC
     * @param type - Filter theo loại transaction (DEPOSIT, WITHDRAW, v.v.) - Optional
     * @param sort - Sort string (default: 'createdDate,desc')
     */
    async getMyTransactions(page: number = 0, size: number = 20, walletType: WalletType, type?: string, sort: string = 'createdDate,desc'): Promise<PageDto<WalletTransactionResponse>> {
        const params: any = { page, size, sort, walletType };
        if (type) {
            params.type = type;
        }
        const response = await request<ApiResponse<PageDto<WalletTransactionResponse>>>({
            url: `${WALLET_API_BASE}/me/transactions`,
            method: 'GET',
            params,
        });
        return (response as any).data;
    }

    /**
     * Lấy lịch sử giao dịch theo user ID (admin only)
     */
    async getTransactionsByUserId(userId: string, page: number = 0, size: number = 20, sort: string = 'createdDate,desc'): Promise<PageDto<WalletTransactionResponse>> {
        const response = await request<ApiResponse<PageDto<WalletTransactionResponse>>>({
            url: `${WALLET_API_BASE}/user/${userId}/transactions`,
            method: 'GET',
            params: { page, size, sort },
        });
        return (response as any).data;
    }

    /**
     * Lấy chi tiết giao dịch
     */
    async getTransactionById(transactionId: string): Promise<WalletTransactionResponse> {
        const response = await request<ApiResponse<WalletTransactionResponse>>({
            url: `${WALLET_API_BASE}/transactions/${transactionId}`,
            method: 'GET',
        });
        return (response as any).data;
    }

    // ========== Password Management ==========

    /**
     * Đổi mật khẩu ví
     */
    async changePassword(requestData: ChangeWalletPasswordRequest): Promise<void> {
        await request<ApiResponse<void>>({
            url: `${WALLET_API_BASE}/password`,
            method: 'PUT',
            data: requestData,
        });
    }

    /**
     * Request OTP để lấy lại mật khẩu ví (Forgot password)
     */
    async forgotPassword(): Promise<void> {
        await request<ApiResponse<void>>({
            url: `${WALLET_API_BASE}/password/forgot`,
            method: 'POST',
        });
    }

    /**
     * Reset mật khẩu ví bằng OTP
     */
    async resetPassword(requestData: ResetWalletPasswordRequest): Promise<void> {
        await request<ApiResponse<void>>({
            url: `${WALLET_API_BASE}/password/reset`,
            method: 'POST',
            data: requestData,
        });
    }
}

export const walletService = new WalletService();
export default walletService;

