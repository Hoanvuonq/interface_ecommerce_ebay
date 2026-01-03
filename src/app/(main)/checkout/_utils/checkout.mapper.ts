import _ from "lodash";

export const preparePreviewPayload = (
  updatedRequest: any,
  currentPreview?: any
) => {
  const raw = _.cloneDeep(updatedRequest);

  return {
    addressId: raw.addressId,
    globalVouchers: raw.globalVouchers || [],
    shops: _.map(raw.shops, (shop) => {
      const shopFromPreview = _.find(currentPreview?.shops, {
        shopId: shop.shopId,
      });

      const actualFee = Number(
        _.get(shopFromPreview, "summary.shippingFee", 0)
      );

      return {
        shopId: shop.shopId,
        itemIds: shop.itemIds || _.map(shop.items, "itemId"),
        vouchers: shop.vouchers || [],
        globalVouchers: shop.globalVouchers || [],
        shippingMethodCode: String(
          shop.selectedShippingMethod || shop.shippingMethodCode || "400021"
        ),
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

  const previewAt = _.get(preview, "previewAt");

  return {
    shops: _.map(preview.shops, (s) => ({
      shopId: s.shopId,
      itemIds: _.map(s.items, "itemId"),
      serviceCode: Number(s.selectedShippingMethod || 400021),
      shippingFee: Number(_.get(s, "summary.shippingFee", 0)),
      vouchers: [],
      globalVouchers: [],
    })),

    shippingMethod: "STANDARD",
    buyerAddressId: String(request.addressId),
    buyerAddressData: {
      ..._.get(preview, "buyerAddressData", {}),
      buyerAddressId: String(request.addressId),
      addressId: String(request.addressId),
      addressType: 0,
    },

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
      city:
        _.get(fullAddressData, "city") ||
        _.get(fullAddressData, "district", "") ||
        "Hồ Chí Minh",
      state: _.get(fullAddressData, "province", ""),
      postalCode: _.get(fullAddressData, "ward", ""),
      country: "VN",
    },

    paymentMethod,
    customerNote,
    previewAt: preview.previewAt,
    globalVouchers: _.get(
      preview,
      "voucherApplication.globalVouchers.validVouchers",
      []
    ),
  };
};
