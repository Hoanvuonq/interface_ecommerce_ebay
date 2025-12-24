/**
 * Wallet Config Service - API calls cho admin quản lý cấu hình rút tiền
 */
import { request } from '@/utils/axios.customize';

import { WalletWithdrawalConfigResponse,WalletWithdrawalConfigRequest } from '@/types/wallet/walletConfig.types';
import type { ApiResponse } from '@/api/_types/api.types';
import type { PageDto } from '@/types/wallet/wallet.types';

const WALLET_CONFIG_API_BASE = '/v1/admin/wallets/withdrawal-configs';

class WalletConfigService {
    /**
     * Lấy tất cả cấu hình rút tiền (có phân trang)
     */
    async getAllConfigs(page: number = 0, size: number = 20): Promise<PageDto<WalletWithdrawalConfigResponse>> {
        const response = await request<ApiResponse<PageDto<WalletWithdrawalConfigResponse>>>({
            url: WALLET_CONFIG_API_BASE,
            method: 'GET',
            params: { page, size },
        });
        return (response as any).data;
    }

    /**
     * Lấy cấu hình theo wallet ID
     */
    async getConfigByWalletId(walletId: string): Promise<WalletWithdrawalConfigResponse> {
        const response = await request<ApiResponse<WalletWithdrawalConfigResponse>>({
            url: `${WALLET_CONFIG_API_BASE}/wallet/${walletId}`,
            method: 'GET',
        });
        return (response as any).data;
    }

    /**
     * Lấy cấu hình theo wallet type
     */
    async getConfigByWalletType(walletType: string): Promise<WalletWithdrawalConfigResponse> {
        const response = await request<ApiResponse<WalletWithdrawalConfigResponse>>({
            url: `${WALLET_CONFIG_API_BASE}/type/${walletType}`,
            method: 'GET',
        });
        return (response as any).data;
    }

    /**
     * Tạo cấu hình mới
     * Sẽ throw error nếu config cho wallet/wallet type đã tồn tại
     */
    async createConfig(requestData: WalletWithdrawalConfigRequest): Promise<WalletWithdrawalConfigResponse> {
        const response = await request<ApiResponse<WalletWithdrawalConfigResponse>>({
            url: WALLET_CONFIG_API_BASE,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Cập nhật cấu hình đã tồn tại
     */
    async updateConfig(configId: string, requestData: WalletWithdrawalConfigRequest): Promise<WalletWithdrawalConfigResponse> {
        const response = await request<ApiResponse<WalletWithdrawalConfigResponse>>({
            url: `${WALLET_CONFIG_API_BASE}/${configId}`,
            method: 'PUT',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Tạo hoặc cập nhật cấu hình (deprecated - giữ lại cho backward compatibility)
     * @deprecated Sử dụng createConfig hoặc updateConfig thay thế
     */
    async createOrUpdateConfig(requestData: WalletWithdrawalConfigRequest): Promise<WalletWithdrawalConfigResponse> {
        const response = await request<ApiResponse<WalletWithdrawalConfigResponse>>({
            url: WALLET_CONFIG_API_BASE,
            method: 'POST',
            data: requestData,
        });
        return (response as any).data;
    }

    /**
     * Xóa cấu hình
     */
    async deleteConfig(configId: string): Promise<void> {
        await request<ApiResponse<void>>({
            url: `${WALLET_CONFIG_API_BASE}/${configId}`,
            method: 'DELETE',
        });
    }
}

export const walletConfigService = new WalletConfigService();
export default walletConfigService;
