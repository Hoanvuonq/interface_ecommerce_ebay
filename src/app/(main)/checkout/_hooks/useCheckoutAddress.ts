import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";
import { buyerService } from "@/services/buyer/buyer.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useMemo } from "react";

export const useCheckoutAddress = () => {
  const { request, savedAddresses, setBuyerData, setRequest } = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const user = getStoredUserDetail();

  const currentAddress = useMemo(() => {
    return _.find(savedAddresses, { addressId: request?.addressId }) || null;
  }, [savedAddresses, request?.addressId]);

  const updateAddressList = async () => {
    if (!user?.buyerId) return;
    try {
      const response = await buyerService.getBuyerDetail(user.buyerId);
      const addresses = (_.get(response, "addresses") || []) as any[];
      const sortedAddr = _.orderBy(addresses, ["isDefault"], ["desc"]);

      setBuyerData(response, sortedAddr);
      return sortedAddr;
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

 const updateAddress = async (addressId?: string, newAddressData?: any) => {
    const targetId = addressId || newAddressData?.addressId;
    if (!targetId || !request) return;

    if (targetId === request.addressId && !newAddressData) return;

    const updatedRequest = {
      ...request,
      addressId: targetId,
      ...(newAddressData && { shippingAddress: newAddressData })
    };

    setRequest(updatedRequest);
    await syncPreview(updatedRequest);
  };
  return {
    currentAddress,
    updateAddress,
    updateAddressList,
    hasAddress: !!currentAddress,
    allAddresses: savedAddresses,
  };
};