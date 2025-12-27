import { useMutation } from "@tanstack/react-query";
import { LoginRequest, RoleEnum } from "@/auth/_types/auth";
import authService from "@/auth/services/auth.service";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { getRedirectPath, getStoredUserDetail, hasRole } from "@/utils/jwt";

export const useAuthMutation = (mode: "BUYER" | "SHOP" | "EMPLOYEE" | "ADMIN") => {
  const router = useRouter();
  const { success, error, warning, info } = useToast();

  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      switch (mode) {
        case "EMPLOYEE":
          return authService.loginStaff(payload);
        case "SHOP":
          return authService.loginShop(payload);
        case "BUYER":
        default:
          return authService.login(payload);
      }
    },

    onSuccess: async (res) => {
      if (res && res?.data?.emailVerified === false) {
        warning("Yêu cầu xác thực", {
          description: "Tài khoản chưa kích hoạt. Vui lòng kiểm tra email của bạn.",
        });
        router.push(`/account/verify?email=${encodeURIComponent(res?.data?.email || "")}`);
        return;
      }

      if (res && res.success) {
        if (res.data?.user) {
          authService.storeUserInfoFromResponse(res.data.user);
        }

        await authService.fetchAndStoreUserDetail();

        const welcomeMsg = {
          SHOP: "Chủ Shop",
          EMPLOYEE: "Cán bộ quản lý",
          BUYER: "bạn",
          ADMIN: "Quản trị viên",
        }[mode];

        success("Đăng nhập thành công", {
          description: `Chào mừng ${welcomeMsg} quay trở lại!`,
        });

        if (mode === "BUYER" || mode === "EMPLOYEE") {
          router.push(getRedirectPath());
        } else if (mode === "SHOP") {
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
        error("Đăng nhập thất bại", {
          description: res?.message || "Thông tin không chính xác hoặc bạn không có quyền truy cập.",
        });
      }
    },

    onError: (err: any) => {
      error("Lỗi kết nối", {
        description: err?.response?.data?.message || err?.message || "Không thể kết nối đến máy chủ.",
      });
    },
  });
};