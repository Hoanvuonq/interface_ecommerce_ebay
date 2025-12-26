import { useMutation } from "@tanstack/react-query";
import { LoginRequest, RoleEnum } from "@/auth/_types/auth";
import authService from "@/auth/services/auth.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { getRedirectPath, getStoredUserDetail, hasRole } from "@/utils/jwt";

export const useAuthMutation = (mode: "BUYER" | "SHOP") => {
  const router = useRouter();
  const { success, error, warning, info } = useToast();

  return useMutation({
    mutationFn: (payload: LoginRequest) => 
      mode === "BUYER" ? authService.login(payload) : authService.loginShop(payload),
    
    onSuccess: async (res) => {
      if (res?.data?.emailVerified === false) {
        warning("Yêu cầu xác thực", { 
          description: "Tài khoản chưa kích hoạt. Vui lòng kiểm tra email của bạn." 
        });
        router.push(`/account/verify?email=${encodeURIComponent(res?.data?.email)}`);
        return;
      }

      if (res && res.success) {
        if (res.data?.user) authService.storeUserInfoFromResponse(res.data.user);
        await authService.fetchAndStoreUserDetail();
        
        success("Đăng nhập thành công", { 
          description: `Chào mừng ${mode === 'SHOP' ? 'Chủ Shop' : 'bạn'} quay trở lại!` 
        });

        if (mode === "BUYER") {
          router.push(getRedirectPath());
        } else {
          const userDetail = getStoredUserDetail();
          if (hasRole(RoleEnum.SHOP)) {
            router.push("/shop/dashboard");
          } else if (userDetail?.shopId) {
            info("Đang xem xét", { description: "Hồ sơ shop đang được phê duyệt." });
            router.push("/shop/check");
          } else {
            info("Khởi tạo Shop", { description: "Vui lòng hoàn tất thông tin shop." });
            router.push("/shop/onboarding");
          }
        }
      } else {
        error("Đăng nhập thất bại", { description: res?.message || "Thông tin không chính xác." });
      }
    },
    onError: (err: any) => {
      error("Lỗi kết nối", { description: err?.message || "Không thể kết nối đến máy chủ." });
    }
  });
};