import _ from "lodash";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";

export const mapFinalOrderRequest = (request: any, preview: any, savedAddresses: any[], note: string, method: string) => {
    const fullAddress = request.shippingAddress || _.find(savedAddresses, { addressId: request.addressId });
    
    return {
        shops: _.map(preview.shops, (s) => {
            const opt = _.find(s.availableShippingOptions, { code: s.selectedShippingMethod });
            return {
                shopId: s.shopId,
                itemIds: _.map(s.items, "itemId"),
                shippingMethod: s.selectedShippingMethod,
                shippingFee: _.get(opt, "fee", 0),
                vouchers: _.map(s.appliedVouchers, (v) => v.code || v),
            };
        }),
        shippingMethod: "STANDARD",
        buyerAddressId: request.addressId,
        buyerAddressData: _.get(preview, "buyerAddressData", { addressId: request.addressId, addressType: 0 }),
        shippingAddress: {
            addressId: request.addressId,
            recipientName: _.get(fullAddress, "recipientName") || _.get(fullAddress, "fullName", ""),
            phoneNumber: _.get(fullAddress, "phone") || _.get(fullAddress, "phoneNumber", ""),
            addressLine1: _.get(fullAddress, "detailAddress") || _.get(fullAddress, "detail", ""),
            city: _.get(fullAddress, "district", ""),
            state: _.get(fullAddress, "province", ""),
            postalCode: _.get(fullAddress, "ward", ""),
            country: "VN",
            districtNameOld: _.get(fullAddress, "districtNameOld"),
            provinceNameOld: _.get(fullAddress, "provinceNameOld"),
            wardNameOld: _.get(fullAddress, "wardNameOld"),
        },
        paymentMethod: method,
        customerNote: note,
        globalVouchers: _.get(request, "globalVouchers", []),
    };
};
export const preparePreviewPayload = (updatedRequest: any) => {
  const payload = _.cloneDeep(updatedRequest);
  const addr = _.get(payload, "shippingAddress");

  if (addr) {
    const oldMap = mapAddressToOldFormat(
      addr.ward || addr.postalCode,
      addr.province || addr.state
    );
    payload.shippingAddress = {
      ...addr,
      districtNameOld: oldMap.old_district_name,
      provinceNameOld: oldMap.old_province_name,
      wardNameOld: oldMap.old_ward_name,
    };
  }
  return payload;
};

export const prepareOrderRequest = (params: {
  preview: any;
  request: any;
  savedAddresses: any[];
  customerNote: string;
  paymentMethod: string;
}): any => {
  const { preview, request, savedAddresses, customerNote, paymentMethod } = params;
  
  const fullAddressData = request.shippingAddress || 
    _.find(savedAddresses, { addressId: request.addressId });

  return {
    shops: _.map(preview.shops, (s) => ({
      shopId: s.shopId,
      itemIds: _.map(s.items, "itemId"),
      shippingMethod: s.selectedShippingMethod,
      shippingFee: _.get(_.find(s.availableShippingOptions, { code: s.selectedShippingMethod }), "fee", 0),
      vouchers: _.map(s.appliedVouchers, (v) => v.code || v),
    })),
    shippingMethod: "STANDARD",
    buyerAddressId: request.addressId,
    buyerAddressData: _.get(preview, "buyerAddressData", { 
      addressId: String(request.addressId || ""), 
      buyerAddressId: String(request.addressId || ""),
      addressType: 0 
    }),
    shippingAddress: {
      addressId: request.addressId,
      recipientName: _.get(fullAddressData, "recipientName") || _.get(fullAddressData, "fullName", ""),
      phoneNumber: _.get(fullAddressData, "phone") || _.get(fullAddressData, "phoneNumber", ""),
      addressLine1: _.get(fullAddressData, "detailAddress") || _.get(fullAddressData, "detail", ""),
      city: _.get(fullAddressData, "district", ""),
      state: _.get(fullAddressData, "province", ""),
      postalCode: _.get(fullAddressData, "ward", ""),
      country: "VN",
      ..._.pick(fullAddressData, ["districtNameOld", "provinceNameOld", "wardNameOld"]),
    },
    paymentMethod,
    customerNote,
    globalVouchers: _.get(request, "globalVouchers", []),
  };
};