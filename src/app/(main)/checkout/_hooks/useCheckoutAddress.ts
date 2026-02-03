import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";
import { buyerService } from "@/services/buyer/buyer.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useMemo } from "react";
import { ApiResponse } from "@/api/_types/api.types";
import {
  BuyerAddressResponse,
  BuyerDetailResponse,
} from "@/types/buyer/buyer.types";
export const useCheckoutAddress = () => {
  const { request, savedAddresses, setBuyerData, setRequest } =
    useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const user = getStoredUserDetail();

  const currentAddress = useMemo(() => {
    return _.find(savedAddresses, { addressId: request?.addressId }) || null;
  }, [savedAddresses, request?.addressId]);

  const updateAddressList = async () => {
    if (!user?.buyerId) return [];
    try {
      const response = (await buyerService.getBuyerDetail(
        user.buyerId,
      )) as unknown as ApiResponse<BuyerDetailResponse>;

      const addresses = _.get(
        response,
        "data.addresses",
        [],
      ) as BuyerAddressResponse[];
      const sortedAddr = _.orderBy(addresses, ["isDefault"], ["desc"]);

      // Lưu trữ thông tin buyer và danh sách địa chỉ đã sắp xếp
      setBuyerData(response.data, sortedAddr);

      return sortedAddr;
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      return [];
    }
  };
  const updateAddress = async (addressId?: string, data?: any) => {
    const targetId = addressId || data?.addressId;
    const latestReq = useCheckoutStore.getState().request;

    if (!targetId || !latestReq) return;

    const next = {
      ...latestReq,
      addressId: targetId,
      shippingAddress: { addressId: targetId, addressChanged: true, ...data },
    };

    setRequest(next);
    await syncPreview(next);
  };
  return {
    currentAddress,
    updateAddress,
    updateAddressList,
    hasAddress: !!currentAddress,
    allAddresses: savedAddresses,
  };
};
