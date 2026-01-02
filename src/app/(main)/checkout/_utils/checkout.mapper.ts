import _ from "lodash";

export const preparePreviewPayload = (
  updatedRequest: any,
  currentPreview?: any
) => {
  const raw = _.cloneDeep(updatedRequest);
  const globalVouchers = raw.globalVouchers || [];

  return {
    shops: _.map(raw.shops, (shop, index) => {
      const shopFromPreview = _.find(currentPreview?.shops, {
        shopId: shop.shopId,
      });
      const actualFee = Number(
        shopFromPreview?.shippingFee || shop.shippingFee || 0
      );

      return {
        shopId: shop.shopId,
        itemIds: shop.itemIds || [],
        vouchers: shop.vouchers || [],
        globalVouchers: index === 0 ? globalVouchers : [],
        shippingMethodCode: String(shop.selectedShippingMethod || "2"),
        shippingFee: actualFee,
      };
    }),
  };
};

export const prepareOrderRequest = (params: {
  preview: any;
  request: any;
  savedAddresses: any[];
  customerNote: string;
  paymentMethod: string;
}): any => {
  const { preview, request, savedAddresses, customerNote, paymentMethod } =
    params;

  const fullAddressData =
    _.find(savedAddresses, { addressId: request.addressId }) ||
    request.shippingAddress;

  return {
    shops: _.map(preview.shops, (s) => {
      const selectedOpt = _.find(s.availableShippingOptions, {
        code: String(s.selectedShippingMethod || "2"),
      });

      return {
        shopId: s.shopId,
        itemIds: _.map(s.items, "itemId"),
        shippingMethod: s.selectedShippingMethod || "STANDARD",
        shippingFee: _.get(selectedOpt, "fee", s.shippingFee || 0),
        vouchers: _.map(s.appliedVouchers, (v) => (_.isString(v) ? v : v.code)),
      };
    }),

    shippingMethod: "STANDARD",
    buyerAddressId: request.addressId,
    buyerAddressData: _.get(preview, "buyerAddressData", {
      addressId: String(request.addressId || ""),
      addressType: 0,
    }),

    shippingAddress: {
      addressId: request.addressId,
      recipientName:
        _.get(fullAddressData, "recipientName") ||
        _.get(fullAddressData, "fullName", ""),
      phoneNumber:
        _.get(fullAddressData, "phone") ||
        _.get(fullAddressData, "phoneNumber", ""),
      addressLine1:
        _.get(fullAddressData, "detailAddress") ||
        _.get(fullAddressData, "detail", ""),
      city: _.get(fullAddressData, "district", ""),
      state: _.get(fullAddressData, "province", ""),
      postalCode: _.get(fullAddressData, "ward", ""),
      country: "VN",
      ..._.pick(fullAddressData, [
        "districtNameOld",
        "provinceNameOld",
        "wardNameOld",
      ]),
    },

    paymentMethod,
    customerNote,
    globalVouchers: _.get(request, "globalVouchers", []),
  };
};
