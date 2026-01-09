"use client";

import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import { bankAccountService } from "@/services/bank/bank-account.service"; 
import { orderService } from "@/services/orders/order.service";
import { BankAccountResponse } from "@/types/bank/bank-account.types";
import { ReturnOrderRequest } from "@/types/orders/order.types";
import {
    ArrowLeft,
    Banknote,
    ChevronRight,
    Loader2,
    PackageSearch,
    Sparkles,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ReturnOrderDetailsForm } from "../ReturnOrderDetailsForm";
interface ReturnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  productName?: string;
  onOrderCancelled?: () => void;
  productImage?: string;
}

type ReturnStep = "SELECT_TYPE" | "FILL_DETAILS";
type ReturnType = "REFUND_ONLY" | "RETURN_REFUND";

export const ReturnOrderModal: React.FC<ReturnOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  productName,
  onOrderCancelled,
  productImage,
}) => {
  const [step, setStep] = useState<ReturnStep>("SELECT_TYPE");
  const [returnType, setReturnType] = useState<ReturnType | null>(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  const REASONS = [
    "Thiếu hàng / Sai hàng",
    "Hàng bị hư hỏng / Vỡ",
    "Hàng giả / Nhái",
    "Khác với mô tả",
  ];

  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
    }
  }, [isOpen]);
  const fetchBankAccounts = async () => {
    try {
      setIsLoadingBanks(true);
      const data = await bankAccountService.getMyBankAccounts("BUYER" as any);
      setBankAccounts(data);

      const defaultAcc = data.find((acc) => acc.default) || data[0];
      if (defaultAcc) setSelectedBankId(defaultAcc.bankAccountId);
    } catch (error) {
      console.error("Lỗi lấy thông tin ngân hàng:", error);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleClose = () => {
    setStep("SELECT_TYPE");
    setReturnType(null);
    setReason("");
    setDescription("");
    setSelectedImages([]);
    setSelectedBankId("");
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages((prev) => [...prev, ...filesArray].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const mapReasonToCode = (reasonLabel: string) => {
    const reasonMap: Record<string, string> = {
      "Thiếu hàng / Sai hàng": "MISSING_ITEM",
      "Hàng bị hư hỏng / Vỡ": "DEFECTIVE_ITEM",
      "Hàng giả / Nhái": "FAKE_ITEM",
      "Khác với mô tả": "WRONG_DESCRIPTION",
    };
    return reasonMap[reasonLabel] || "OTHER";
  };

  const handleSubmit = async () => {
    if (!reason || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // BƯỚC 1: Chuyển đổi Blob URL thành File object và Upload
      // Lưu ý: Bạn cần viết một hàm upload thực tế gọi lên server
      const uploadedUrls = await Promise.all(
        selectedImages.map(async (blobUrl) => {
          // Nếu là link đã upload rồi (http) thì giữ nguyên, nếu là blob thì mới upload
          if (blobUrl.startsWith("http") && !blobUrl.startsWith("blob"))
            return blobUrl;

          const response = await fetch(blobUrl);
          const blob = await response.blob();
          const file = new File([blob], "evidence.jpg", { type: "image/jpeg" });

          // Gọi API upload của bạn ở đây
          // const res = await uploadService.uploadFile(file);
          // return res.url;

          return "https://your-cdn.com/path-to-image.jpg"; // Link demo sau khi upload thành công
        })
      );

      const payload: ReturnOrderRequest = {
        reasonCode: mapReasonToCode(reason),
        reason: reason,
        description: description || "Khách hàng yêu cầu hoàn trả",
        imageUrls: uploadedUrls,
        videoUrls: [],
        bankAccountId: selectedBankId,
      };

      await orderService.requestReturn(order.orderId, payload);
      success("Gửi yêu cầu thành công!");
      handleClose();
      onOrderCancelled?.();
    } catch (error: any) {
      error(error?.response?.data?.message || "Lỗi định dạng dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <PortalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          {step === "FILL_DETAILS" && (
            <button
              onClick={() => setStep("SELECT_TYPE")}
              className="p-2 -ml-2 hover:bg-orange-50 text-orange-500 rounded-full transition-all"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
          )}
          <span className="text-sm font-black text-gray-800 uppercase tracking-tight">
            {step === "SELECT_TYPE"
              ? "Phương thức hoàn trả"
              : "Chi tiết khiếu nại"}
          </span>
        </div>
      }
      width="max-w-xl"
      footer={
        step === "FILL_DETAILS" ? (
          <div className="flex justify-end w-full gap-3">
            <Button
              type="button"
              variant="edit"
              onClick={handleClose}
              className=" bg-transparent rounded-full"
            >
              Hủy bỏ
            </Button>
            <ButtonField
              htmlType="submit"
              type="login"
              onClick={handleSubmit}
              disabled={
                !reason ||
                selectedImages.length === 0 ||
                isSubmitting ||
                !selectedBankId
              }
              className="w-60 text-base rounded-full"
            >
              <span className="flex items-center gap-2">
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Gửi yêu cầu"
                )}
              </span>
            </ButtonField>
          </div>
        ) : null
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar px-1">
        {step === "SELECT_TYPE" && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-orange-50/60 border border-orange-100 rounded-[1.5rem] p-4 flex gap-4">
              <Sparkles size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-orange-800 font-bold leading-relaxed">
                Hệ thống xử lý yêu cầu dựa trên minh chứng thực tế. Vui lòng
                chọn đúng phương án.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  type: "REFUND_ONLY",
                  icon: Banknote,
                  label: "Chỉ hoàn tiền",
                  sub: "Chưa nhận hàng / Thiếu hàng",
                },
                {
                  type: "RETURN_REFUND",
                  icon: PackageSearch,
                  label: "Trả hàng & Hoàn tiền",
                  sub: "Hàng lỗi, vỡ, không đúng mô tả",
                },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    setReturnType(item.type as ReturnType);
                    setStep("FILL_DETAILS");
                  }}
                  className="w-full flex items-center justify-between p-5 rounded-[1.8rem] border-2 border-transparent bg-gray-50/50 hover:bg-white hover:border-orange-200 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-50 group-hover:scale-110 transition-transform">
                      <item.icon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-gray-800 text-xs uppercase">
                        {item.label}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 italic">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-orange-500"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "FILL_DETAILS" && (
          <ReturnOrderDetailsForm
            order={order}
            productName={productName}
            productImage={productImage}
            bankAccounts={bankAccounts}
            selectedBankId={selectedBankId}
            setSelectedBankId={setSelectedBankId}
            reason={reason}
            setReason={setReason}
            reasonsList={REASONS}
            description={description}
            setDescription={setDescription}
            selectedImages={selectedImages}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
          />
        )}
      </div>
    </PortalModal>
  );
};
