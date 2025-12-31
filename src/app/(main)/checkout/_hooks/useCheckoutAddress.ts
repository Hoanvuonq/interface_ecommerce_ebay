import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutActions } from "./useCheckoutActions";

export const useCheckoutAddress = () => {
  const { request, savedAddresses } = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();

  const currentAddress =
    _.find(savedAddresses, { addressId: request?.addressId }) ||
    request?.shippingAddress ||
    null;

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
    hasAddress: !!currentAddress,
  };
};
