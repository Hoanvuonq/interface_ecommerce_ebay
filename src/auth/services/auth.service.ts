
import {
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  Oauth2LoginCallBackRequest,
  Oauth2LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  UpdateBuyerClientRequest,
  UpdateEmployeeClientRequest,
  UpdateUserClientRequest,
  VerifyPasswordRequest,
  RegisterRequest,
  VerifyRequest,
  ResendOtpRequest,
  ChangePasswordRequest,
} from "../_types/auth";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import { CreateImageRequest } from "@/types/employee/dto";

const API_ENDPOINT_AUTH = "/v1/auth";
const API_ENDPOINT_USERS = "/v1/users";
const API_ENDPOINT_EMPLOYEES = "/v1/employees";
const API_ENDPOINT_BUYERS = "/v1/buyers";
const API_ENDPOINT_STORAGE = "/v1/storage";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

class AuthService {
  /**
   * Đăng nhập (generic - giữ lại để backward compatibility)
   */
  async login(payload: LoginRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/login`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Đăng nhập cho người mua - yêu cầu phải có role BUYER
   */
  async loginBuyer(payload: LoginRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/login/buyer`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Đăng nhập cho người bán - yêu cầu phải có role SHOP
   */
  async loginShop(payload: LoginRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/login/shop`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Đăng nhập cho nhân viên - yêu cầu phải có role thuộc staff roles
   */
  async loginStaff(payload: LoginRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/login/staff`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Đăng ký tài khoản người mua
   */
  async registerBuyer(payload: RegisterRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/buyer`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Đăng ký tài khoản cửa hàng
   */
  async registerShop(payload: RegisterRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/shop`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Xác thực tài khoản bằng OTP
   */
  async verifyAccount(payload: VerifyRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/otp/verify`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Gửi lại OTP
   */
  async resendOtp(payload: ResendOtpRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/otp/resend`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Gửi email OTP
   */
  async sendMailOtp(payload: { email: string }): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/otp/send`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Kiểm tra username đã tồn tại chưa
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    const response = await request<ApiResponse<boolean>>({
      url: `${API_ENDPOINT_USERS}/exists/username`,
      method: "GET",
      params: { username },
    });
    return response as any;
  }

  /**
   * Kiểm tra email đã tồn tại chưa
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const response = await request<ApiResponse<boolean>>({
      url: `${API_ENDPOINT_USERS}/exists/email`,
      method: "GET",
      params: { email },
    });
    return response as any;
  }

  /**
   * Lấy thông tin user detail từ context (không cần userId)
   * ✅ Backend sẽ tự lấy từ UserContext dựa vào token trong cookies
   */
  async getCurrentUser(): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/me`,
      method: "GET",
    });
    return response as any;
  }

  /**
   * Lấy thông tin chi tiết user theo userId (dùng khi cần lấy user khác)
   */
  async getUserDetail(userId: string): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/${userId}`,
      method: "GET",
      params: { userId },
    });
    return response as any;
  }

  /**
   * Lấy thông tin chi tiết user theo ID
   */
  async getUserDetailById(userId: string): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/${userId}`,
      method: "GET",
    });
    return response as any;
  }

  /**
   * Quên mật khẩu
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/password/forgot`,
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response as any;
  }

  /**
   * Xác thực mật khẩu
   */
  async verifyPassword(payload: VerifyPasswordRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/password/verify`,
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response as any;
  }

  /**
   * Đặt lại mật khẩu
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/password/reset`,
      method: "POST",
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response as any;
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(
    userId: string,
    payload: ChangePasswordRequest
  ): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/${userId}/password`,
      method: "PATCH",
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return (response as any).data;
  }

  /**
   * Refresh token
   */
  async refreshToken(payload: RefreshTokenRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/refresh`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Đăng xuất
   */
  async logout(payload: LogoutRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/logout`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Cập nhật thông tin employee client
   */
  async updateEmployeeClient(
    employeeId: string,
    payload: UpdateEmployeeClientRequest
  ): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_EMPLOYEES}/${employeeId}/client`,
      method: "PUT",
      data: payload,
    });
    return response as any;
  }

  /**
   * Cập nhật thông tin buyer client
   */
  async updateBuyerClient(
    buyerId: string,
    payload: UpdateBuyerClientRequest
  ): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_BUYERS}/${buyerId}`,
      method: "PUT",
      data: payload,
    });
    return response as any;
  }

  /**
   * Cập nhật thông tin user client
   */
  async updateUserClient(
    userId: string,
    payload: UpdateUserClientRequest
  ): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_USERS}/${userId}/client`,
      method: "PUT",
      data: payload,
    });
    return response as any;
  }

  /**
   * Upload hình ảnh
   */
  async uploadImage(payload: CreateImageRequest): Promise<any> {
    const formData = new FormData();
    formData.append("file", payload.file);
    if (payload.path) {
      formData.append("path", payload.path);
    }

    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_STORAGE}/upload`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response as any;
  }

  /**
   * Đăng nhập bằng social (OAuth2)
   */
  async loginSocial(payload: Oauth2LoginRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/login/social`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Callback đăng nhập bằng social (OAuth2)
   */
  async loginSocialCallback(payload: Oauth2LoginCallBackRequest): Promise<any> {
    const response = await request<ApiResponse<any>>({
      url: `${API_ENDPOINT_AUTH}/login/social/callback`,
      method: "POST",
      data: payload,
    });
    return response as any;
  }

  /**
   * Lấy và lưu thông tin user detail vào localStorage
   * ✅ Dùng API /me để lấy từ backend context
   * ✅ Backend tự động lấy user từ UserContext dựa vào token trong cookies
   */
  async fetchAndStoreUserDetail(): Promise<any> {
    try {
      // ✅ Luôn dùng getCurrentUser() để lấy từ context
      const response = await this.getCurrentUser();

      if (response?.success && response?.data) {
        // Lưu user detail vào localStorage
        localStorage.setItem("users", JSON.stringify(response.data));
        return response.data;
      } else {
        return null;
      }
    } catch (error: any) {
      // Log error message để debug
      const errorMessage = error?.message || "Unknown error";
      console.error("Error fetching user detail:", errorMessage, error);
      return null;
    }
  }

  /**
   * Lưu user info từ login response vào localStorage
   * ✅ Được gọi ngay sau khi login thành công
   */
  storeUserInfoFromResponse(userData: any): void {
    if (userData) {
      try {
        localStorage.setItem("users", JSON.stringify(userData));
        console.log("✅ User info stored from login response");
      } catch (error) {
        console.error("Error storing user info:", error);
      }
    }
  }
}

export const authService = new AuthService();
export default authService;
