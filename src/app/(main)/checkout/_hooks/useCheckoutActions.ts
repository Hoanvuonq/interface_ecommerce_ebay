import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useAppDispatch } from "@/store/store";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import {
  preparePreviewCheckoutPayload,
  prepareOrderRequest,
} from "../_utils/checkout.mapper";

export const useCheckoutActions = () => {
  const dispatch = useAppDispatch();
  const { success: toastSuccess, error: toastError } = useToast();
  const {
    request,
    setPreview,
    setRequest,
    setLoading,
    savedAddresses,
    preview,
  } = useCheckoutStore();
  const lastRequestIdRef = useRef<number | null>(null);

  const previewMutation = useMutation({
    mutationFn: async (params: any) => {
      const updatedRequest = params?.payload ?? params;
      const finalPayload = preparePreviewCheckoutPayload(updatedRequest);
      return await dispatch(checkoutPreviewAction(finalPayload)).unwrap();
    },
    onMutate: () => setLoading(true),

    // Trong onSuccess của previewMutation
    onSuccess: (result: any, variables: any) => {
      const previewData = result?.data || result;
      // Store sẽ tự lưu vào sessionStorage nhờ hàm setPreview đã fix ở bước 1
      setPreview(previewData);

      const variablesReq = variables?.payload ?? variables;
      const shopsFromBackend = _.get(previewData, "shops", []);
      const backendSummaryGlobals =
        _.get(previewData, "summary.globalVouchers", []) || [];

      const updatedShops = (variablesReq?.shops || []).map((s: any) => {
        const freshShop = _.find(shopsFromBackend, { shopId: s.shopId });
        if (!freshShop) return s;

        const discountDetails = _.get(
          freshShop,
          "voucherResult.discountDetails",
          [],
        );

        // Mã gợi ý từ server
        const serverShopCodes = _.chain(discountDetails)
          .filter((d: any) => d.valid && d.voucherType === "SHOP")
          .map("voucherCode")
          .value();

        const serverPlatformCodes = _.chain(discountDetails)
          .filter((d: any) => d.valid && d.voucherType === "PLATFORM")
          .map("voucherCode")
          .value();

        // 🟢 ĐIỂM MẤU CHỐT: Kiểm tra xem User có đang truyền mảng lên không
        // variablesReq là cái User vừa chọn gửi đi
        const userVouchers = s.vouchers;
        const userGlobalVouchers = s.globalVouchers;

        return {
          ...s,
          serviceCode: _.get(freshShop, "selectedShippingMethod")
            ? Number(freshShop.selectedShippingMethod)
            : s.serviceCode,
          shippingFee: _.get(freshShop, "summary.shippingFee", 0),

          // 🟢 FIX: Nếu userVouchers có length > 0, giữ; else lấy serverShopCodes
          vouchers: userVouchers !== undefined && userVouchers.length > 0 ? userVouchers : serverShopCodes,
          // Platform vouchers là global, không set ở shop level
          globalVouchers: userGlobalVouchers !== undefined && userGlobalVouchers.length > 0 ? userGlobalVouchers : [],
        };
      });

      // 🟢 Tính serverGlobalCodes từ shop đầu tiên (giả sử tất cả shops có cùng platform vouchers)
      const firstShop = shopsFromBackend[0];
      const serverGlobalCodes = firstShop ? _.chain(_.get(firstShop, "voucherResult.discountDetails", []))
        .filter((d: any) => d.valid && d.voucherType === "PLATFORM")
        .map("voucherCode")
        .value() : [];

      const nextRequest = {
        ...variablesReq,
        shops: updatedShops,
        globalVouchers:
          variablesReq.globalVouchers !== undefined && variablesReq.globalVouchers.length > 0
            ? variablesReq.globalVouchers
            : serverGlobalCodes,
      };

      // 🟢 setRequest này sẽ tự động lưu vào sessionStorage qua Store
      setRequest(nextRequest);
    },
    onSettled: () => setLoading(false),
  });

  const syncPreview = async (req: any) => {
    const id = Date.now();
    lastRequestIdRef.current = id;
    return await previewMutation.mutateAsync({
      payload: req,
      _clientRequestId: id,
    });
  };

  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!request) return;
    const nextRequest = {
      ...request,
      shops: request.shops.map((s: any) =>
        s.shopId === shopId
          ? { ...s, serviceCode: Number(methodCode), shippingFee: 0 }
          : s,
      ),
    };
    return await syncPreview(nextRequest);
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
      if (!request || !preview) throw new Error("Dữ liệu không hợp lệ");
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
    onSuccess: (res) => {
      sessionStorage.removeItem("checkoutPreview");
      sessionStorage.removeItem("checkoutRequest");
      toastSuccess("Đặt hàng thành công!");
      return res;
    },
    onError: (err: any) => {
      toastError(_.get(err, "response.data.message") || "Đặt hàng thất bại");
    },
    onSettled: () => setLoading(false),
  });

  return {
    syncPreview,
    updateShippingMethod,
    confirmOrder,
    isLoading: previewMutation.isPending || orderMutation.isPending,
  };
};
