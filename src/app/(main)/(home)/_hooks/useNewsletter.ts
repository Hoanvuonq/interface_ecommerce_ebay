import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export const useNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { success, error: toastError } = useToast();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return toastError("Lỗi định dạng", { description: "Vui lòng nhập email hợp lệ" });
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubscribed(true);
      success("Đăng ký thành công", { description: "Voucher 50K đã sẵn sàng!" });
      setEmail("");
    } catch (err) {
      toastError("Thất bại", { description: "Vui lòng thử lại sau" });
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, subscribed, handleSubscribe };
};