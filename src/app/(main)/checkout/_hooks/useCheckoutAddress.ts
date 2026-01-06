import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";
import { buyerService } from "@/services/buyer/buyer.service"; 
import { getStoredUserDetail } from "@/utils/jwt";

export const useCheckoutAddress = () => {
  const { request, savedAddresses, setBuyerData } = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const user = getStoredUserDetail();

  const currentAddress =
    _.find(savedAddresses, { addressId: request?.addressId }) ||
    request?.shippingAddress ||
    null;

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
    const updatedRequest = {
      ...request,
      addressId,
      shippingAddress: newAddressData
        ? { ...newAddressData, country: "Vietnam" }
        : undefined,
    };
    await syncPreview(updatedRequest);
  };

  return {
    currentAddress,
    updateAddress,
    updateAddressList,
    hasAddress: !!currentAddress,
  };
};