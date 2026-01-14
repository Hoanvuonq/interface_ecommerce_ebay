"use client";

import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiCheck, FiLock } from "react-icons/fi";
import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";
import { FormInput } from "@/components/formInput";
import { PortalModal } from "@/features/PortalModal";
import walletService from "@/services/wallet/wallet.service";
import type {
  ChangeWalletPasswordRequest,
  WalletResponse,
} from "@/types/wallet/wallet.types";
import { WalletType } from "@/types/wallet/wallet.types";
import { useToast } from "@/hooks/useToast";
interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  wallet?: WalletResponse | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSuccess,
  wallet,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const isFirstTimeChange =
    wallet?.mustChangePassword === true && wallet?.type === WalletType.SHOP;
  const requiresCurrentPassword = !isFirstTimeChange;

  useEffect(() => {
    if (visible) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (requiresCurrentPassword && !formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
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
      const requestData: ChangeWalletPasswordRequest = {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      if (requiresCurrentPassword) {
        requestData.currentPassword = formData.currentPassword;
      }

      await walletService.changePassword(requestData);
      success("Đổi mật khẩu ví thành công!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const headerContent = (
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
        <FiLock size={18} />
      </div>
      <span>Đổi mật khẩu ví</span>
    </div>
  );
  // --- Footer Content ---
  const footerContent = (
    <div className="flex items-center gap-3">
      <Button
        variant="edit"
        className="flex-1 sm:flex-none rounded-xl px-5 py-2.5 font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 border-gray-200"
        onClick={onClose}
        disabled={loading}
      >
        Hủy bỏ
      </Button>
      <ButtonField
        form="change-password-form"
        htmlType="submit"
        type="login"
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            <FiCheck className="w-5 h-5" />
            {isFirstTimeChange ? "Hoàn tất tạo ví" : "Lưu thay đổi"}
          </span>
        )}
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={visible}
      onClose={onClose}
      title={headerContent}
      footer={footerContent}
      width="max-w-md"
      className="border-t-4 border-t-orange-500" 
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl border bg-orange-50 border-gray-100 text-orange-800 flex gap-3 shadow-inner-sm">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-orange-600" />
          <div className="text-sm leading-relaxed">
            <span className="font-bold block mb-1 uppercase tracking-wider text-[10px]">
              {isFirstTimeChange ? "Thiết lập lần đầu" : "Lưu ý bảo mật"}
            </span>
            {isFirstTimeChange ? (
              "Ví của bạn đã được tạo tự động. Vui lòng thiết lập mật khẩu để bảo vệ tài sản và thực hiện giao dịch."
            ) : (
              <>
                Mật khẩu ví dùng để xác thực khi <strong>rút tiền</strong> và{" "}
                <strong>thanh toán</strong>. Không chia sẻ cho người khác.
              </>
            )}
          </div>
        </div>

        <form id="change-password-form" onSubmit={handleSubmit} className="space-y-5">
          {requiresCurrentPassword && (
            <FormInput
              label="Mật khẩu hiện tại"
              required
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              error={errors.currentPassword}
              placeholder="••••••"
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
            />
          )}

          <FormInput
            label="Mật khẩu mới"
            required
            type="password"
            name="newPassword"
            value={formData.newPassword}
            error={errors.newPassword}
            placeholder="Tối thiểu 6 ký tự"
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
          />

          <FormInput
            label="Xác nhận mật khẩu"
            required
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </form>
      </div>
    </PortalModal>
  );
};