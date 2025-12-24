/**
 * Admin Wallet Service - API calls cho admin quản lý ví
 */

import { request } from '@/utils/axios.customize';
import type {
    WalletResponse,
    WalletTransactionResponse,
    WalletWithdrawalResponse,
    PageDto,
} from '@/types/wallet/wallet.types';
import type { ApiResponse } from '@/api/_types/api.types';

const ADMIN_WALLET_API_BASE = '/v1/admin/wallets';

// ========== Request Types ==========

export interface AdminApproveWithdrawalRequest {
    reason?: string; // Lý do approve/reject
}

export interface FreezeWalletRequest {
    reason: string; // Lý do freeze
}

export interface UnfreezeWalletRequest {
    reason?: string; // Lý do unfreeze
}

export interface AdjustBalanceRequest {
    amount: number; // Số tiền điều chỉnh (+ hoặc -)
    description: string; // Mô tả lý do
}

export interface WalletStatisticsResponse {
    totalWallets: number;
    totalBalance: number;
    totalDeposited: number;
    totalWithdrawn: number;
    walletsByType: Record<string, number>; // Số ví theo loại
    walletsByStatus: Record<string, number>; // Số ví theo trạng thái
    balanceByType: Record<string, number>; // Tổng số dư theo loại
}

class AdminWalletService {
    // ========== Withdrawal Request Management ==========

    /**
     * Lấy tất cả withdrawal requests (có filter theo status)
     */
    async getAllWithdrawalRequests(
        page: number = 0,
        size: number = 20,
        status?: string
    ): Promise<PageDto<WalletWithdrawalResponse>> {
        const response = await request<ApiResponse<PageDto<WalletWithdrawalResponse>>>({
            url: `${ADMIN_WALLET_API_BASE}/withdrawal-requests`,
            method: 'GET',
            params: { page, size, status },
        });
        return (response as any).data;
    }

    /**
     * Duyệt withdrawal request
     */
    async approveWithdrawalRequest(
        withdrawalRequestId: string,
        requestData?: AdminApproveWithdrawalRequest
    ): Promise<WalletWithdrawalResponse> {
        const response = await request<ApiResponse<WalletWithdrawalResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/withdrawal-requests/${withdrawalRequestId}/approve`,
            method: 'POST',
            data: requestData || {},
        });
        return (response as any).data;
    }

    /**
     * Từ chối withdrawal request
     */
    async rejectWithdrawalRequest(
        withdrawalRequestId: string,
        requestData: AdminApproveWithdrawalRequest
    ): Promise<WalletWithdrawalResponse> {
        const response = await request<ApiResponse<WalletWithdrawalResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/withdrawal-requests/${withdrawalRequestId}/reject`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Xác nhận đã chuyển khoản thành công
     */
    async confirmWithdrawalTransfer(
        withdrawalRequestId: string,
        requestData?: AdminApproveWithdrawalRequest
    ): Promise<WalletWithdrawalResponse> {
        const response = await request<ApiResponse<WalletWithdrawalResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/withdrawal-requests/${withdrawalRequestId}/confirm-transfer`,
            method: 'POST',
            data: requestData || {},
        });
        return (response as any).data;
    }

    // ========== Wallet Management ==========

    /**
     * Admin lấy tất cả transactions (có filter theo type)
     */
    async getAllTransactions(
        page: number = 0,
        size: number = 20,
        type?: string
    ): Promise<PageDto<WalletTransactionResponse>> {
        const response = await request<ApiResponse<PageDto<WalletTransactionResponse>>>({
            url: `${ADMIN_WALLET_API_BASE}/transactions`,
            method: 'GET',
            params: { page, size, type },
        });
        return (response as any).data;
    }

    /**
     * Admin lấy tất cả wallets (có filter)
     */
    async getAllWallets(
        page: number = 0,
        size: number = 20,
        status?: string,
        type?: string
    ): Promise<PageDto<WalletResponse>> {
        const response = await request<ApiResponse<PageDto<WalletResponse>>>({
            url: ADMIN_WALLET_API_BASE,
            method: 'GET',
            params: { page, size, status, type },
        });
        return (response as any).data;
    }

    /**
     * Freeze wallet (đóng băng ví)
     */
    async freezeWallet(walletId: string, requestData: FreezeWalletRequest): Promise<WalletResponse> {
        const response = await request<ApiResponse<WalletResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/${walletId}/freeze`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Unfreeze wallet (mở khóa ví)
     */
    async unfreezeWallet(walletId: string, requestData: UnfreezeWalletRequest): Promise<WalletResponse> {
        const response = await request<ApiResponse<WalletResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/${walletId}/unfreeze`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Điều chỉnh số dư ví
     */
    async adjustBalance(
        walletId: string,
        requestData: AdjustBalanceRequest
    ): Promise<WalletTransactionResponse> {
        const response = await request<ApiResponse<WalletTransactionResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/${walletId}/adjust`,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Lấy thống kê wallet system
     */
    async getStatistics(): Promise<WalletStatisticsResponse> {
        const response = await request<ApiResponse<WalletStatisticsResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/statistics`,
            method: 'GET',
        });
        return (response as any).data;
    }

    /**
     * Lấy transactions của một wallet
     */
    async getWalletTransactions(
        walletId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageDto<WalletTransactionResponse>> {
        const response = await request<ApiResponse<PageDto<WalletTransactionResponse>>>({
            url: `${ADMIN_WALLET_API_BASE}/${walletId}/transactions`,
            method: 'GET',
            params: { page, size },
        });
        return (response as any).data;
    }

    /**
     * Tạo platform wallet (chỉ admin mới có quyền)
     */
    async createPlatformWallet(): Promise<WalletResponse> {
        const response = await request<ApiResponse<WalletResponse>>({
            url: `${ADMIN_WALLET_API_BASE}/platform`,
            method: 'POST',
        });
        return (response as any).data;
    }
}

export const adminWalletService = new AdminWalletService();
export default adminWalletService;
