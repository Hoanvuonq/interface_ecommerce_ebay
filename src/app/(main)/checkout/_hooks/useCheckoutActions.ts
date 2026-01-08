import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useAppDispatch } from "@/store/store";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import { preparePreviewPayload, prepareOrderRequest } from "../_utils/checkout.mapper";

export const useCheckoutActions = () => {
  const dispatch = useAppDispatch();
  const { success: toastSuccess, error: toastError } = useToast();
  const { request, preview, savedAddresses, setPreview, setRequest, setLoading } = useCheckoutStore();

  const previewMutation = useMutation({
    mutationFn: async (updatedRequest: any) => {
      const finalPayload = preparePreviewPayload(updatedRequest);
      return await dispatch(checkoutPreviewAction(finalPayload)).unwrap();
    },
    onMutate: () => setLoading(true),
    
    // --- LOGIC HỨNG & CẬP NHẬT STORE ---
    onSuccess: (result: any, variables: any) => {
      const previewData = result?.data || result;
      setPreview(previewData);

      const shopDataFromBackend = _.get(previewData, "shops", []);
      // Lấy danh sách mã sàn từ summary để phân loại
      const backendSummaryGlobals = _.get(previewData, "summary.globalVouchers", []) || [];

      const updatedShops = variables.shops.map((s: any) => {
        const freshShop = _.find(shopDataFromBackend, { shopId: s.shopId });
        
        // 1. Lấy danh sách voucher HỢP LỆ từ Server (đã được tính toán)
        const validDetails = _.get(freshShop, "voucherResult.discountDetails", [])
          .filter((d: any) => d.valid);
        
        const validCodes = validDetails.map((d: any) => d.voucherCode);

        // 2. Tách voucher Sàn và Shop dựa trên response thực tế
        const shopSpecificGlobals = validCodes.filter((c: string) => 
           backendSummaryGlobals.includes(c) || 
           validDetails.find((d: any) => d.voucherCode === c && d.voucherType === 'PLATFORM')
        );

        const shopSpecificVouchers = validCodes.filter((c: string) => 
           !shopSpecificGlobals.includes(c)
        );

        // 3. Logic ưu tiên:
        // - Nếu user gửi lên (variables có key) -> GIỮ NGUYÊN (để tránh bị server override khi user muốn xóa).
        // - Nếu Init (không có key trong variables) -> LẤY TỪ SERVER (Auto Recommend).
        
        const finalVouchers = (s.vouchers !== undefined) ? s.vouchers : shopSpecificVouchers;
        const finalGlobalVouchers = (s.globalVouchers !== undefined) ? s.globalVouchers : shopSpecificGlobals;

        // Cập nhật ServiceCode nếu Server tự đổi (ví dụ 400021 -> 400031)
        const serverSelectedMethod = _.get(freshShop, "selectedShippingMethod");
        const finalServiceCode = serverSelectedMethod ? Number(serverSelectedMethod) : s.serviceCode;

        return {
          ...s,
          serviceCode: finalServiceCode,
          shippingFee: _.get(freshShop, "summary.shippingFee", s.shippingFee),
          vouchers: finalVouchers,
          globalVouchers: finalGlobalVouchers,
        };
      });

      setRequest({
        ...variables,
        shops: updatedShops,
        globalVouchers: [], // Luôn để rỗng ở root
      });
    },
    onSettled: () => setLoading(false),
  });

  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!request || !request.shops) return;
    const updatedRequest = {
      ...request,
      shops: request.shops.map((s: any) =>
        s.shopId === shopId ? { ...s, serviceCode: methodCode ? Number(methodCode) : null } : s
      ),
    };
    try {
      return await previewMutation.mutateAsync(updatedRequest);
    } catch (error) { throw error; }
  };

  const confirmOrder = (note: string, method: string) =>
    orderMutation.mutateAsync({ customerNote: note, paymentMethod: method });

  const orderMutation = useMutation({
    mutationFn: async ({
      customerNote,
      paymentMethod,
    }: {
      customerNote: string;
      paymentMethod: string;
    }) => {
      if (!request || !preview)
        throw new Error("Thông tin đơn hàng không hợp lệ");
      const finalRequest = prepareOrderRequest({
        preview,
        request,
        savedAddresses,
        customerNote,
        paymentMethod,
      });
      return await orderService.createOrder(finalRequest);
    },
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      sessionStorage.removeItem("checkoutPreview");
      sessionStorage.removeItem("checkoutRequest");
      toastSuccess("Đặt hàng thành công!");
      return response;
    },
    onError: (err: any) => {
      const errCode = _.get(err, "response.data.code");
      if (errCode === 3001) {
        previewMutation.mutate(request);
        toastError(
          "Thông tin vận chuyển vừa cập nhật. Vui lòng nhấn Đặt hàng lần nữa."
        );
      } else {
        toastError(_.get(err, "response.data.message") || "Đặt hàng thất bại");
      }
    },
    onSettled: () => setLoading(false),
  });

  return {
    syncPreview: (req: any) => previewMutation.mutateAsync(req),
    updateShippingMethod,
    confirmOrder,
    isLoading: previewMutation.isPending || orderMutation.isPending,
  };
};
