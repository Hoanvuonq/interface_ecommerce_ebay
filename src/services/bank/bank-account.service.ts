import { request } from "@/utils/axios.customize";

import {
  BankAccountResponse,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
  BankInfo,
  BankAccountType,
} from "@/types/bank/bank-account.types";
import type { ApiResponse } from "@/api/_types/api.types";

const BANK_API_BASE = "/v1/banks";

class BankAccountService {
  /**
   * Lấy danh sách tất cả ngân hàng
   */
  async getAllBanks(): Promise<BankInfo[]> {
    const response = await request<ApiResponse<BankInfo[]>>({
      url: BANK_API_BASE,
      method: "GET",
    });
    return (response as any)?.data || [];
  }

  /**
   * Lấy danh sách tên ngân hàng rút gọn
   */
  async getBankNames(): Promise<string[]> {
    const response = await request<ApiResponse<string[]>>({
      url: `${BANK_API_BASE}/names`,
      method: "GET",
    });
    return (response as any)?.data || [];
  }

  /**
   * Lấy danh sách tài khoản ngân hàng của user hiện tại
   * @param accountType - Nếu không truyền, sẽ lấy tất cả (cả SHOP và BUYER nếu có)
   */
  async getMyBankAccounts(
    accountType?: BankAccountType
  ): Promise<BankAccountResponse[]> {
    const params = accountType ? { type: accountType } : {};
    const response = await request<ApiResponse<BankAccountResponse[]>>({
      url: `${BANK_API_BASE}/accounts/me`,
      method: "GET",
      params,
    });
    return (response as any)?.data || [];
  }

  /**
   * Tạo tài khoản ngân hàng mới
   */
  async createBankAccount(
    requestData: CreateBankAccountRequest
  ): Promise<BankAccountResponse> {
    const response = await request<ApiResponse<BankAccountResponse>>({
      url: `${BANK_API_BASE}/accounts`,
      method: "POST",
      data: requestData,
    });
    return (response as any)?.data;
  }

  /**
   * Cập nhật tài khoản ngân hàng
   */
  async updateBankAccount(
    bankAccountId: string,
    requestData: UpdateBankAccountRequest
  ): Promise<BankAccountResponse> {
    const response = await request<ApiResponse<BankAccountResponse>>({
      url: `${BANK_API_BASE}/accounts/${bankAccountId}`,
      method: "PUT",
      data: requestData,
    });
    return (response as any)?.data;
  }

  /**
   * Xóa tài khoản ngân hàng
   */
  async deleteBankAccount(bankAccountId: string): Promise<void> {
    const response = await request<ApiResponse<void>>({
      url: `${BANK_API_BASE}/accounts/${bankAccountId}`,
      method: "DELETE",
    });
    return (response as any)?.data;
  }

  /**
   * Lấy chi tiết tài khoản ngân hàng
   */
  async getBankAccountById(
    bankAccountId: string
  ): Promise<BankAccountResponse> {
    const response = await request<ApiResponse<BankAccountResponse>>({
      url: `${BANK_API_BASE}/accounts/${bankAccountId}`,
      method: "GET",
    });
    return (response as any)?.data;
  }

  /**
   * Đặt tài khoản làm mặc định
   */
  async setAsDefault(bankAccountId: string): Promise<BankAccountResponse> {
    const response = await request<ApiResponse<BankAccountResponse>>({
      url: `${BANK_API_BASE}/accounts/${bankAccountId}/set-default`,
      method: "PUT",
    });
    return (response as any)?.data;
  }

  /**
   * Lấy tài khoản ngân hàng mặc định
   */
  async getDefaultBankAccount(): Promise<BankAccountResponse> {
    const response = await request<ApiResponse<BankAccountResponse>>({
      url: `${BANK_API_BASE}/accounts/default`,
      method: "GET",
    });
    return (response as any)?.data;
  }
}

export const bankAccountService = new BankAccountService();
export default bankAccountService;
