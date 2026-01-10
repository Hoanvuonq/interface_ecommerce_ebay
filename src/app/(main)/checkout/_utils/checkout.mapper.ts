import _ from "lodash";

export const preparePreviewPayload = (
  updatedRequest: any,
  currentPreview?: any
) => {
  const raw = _.cloneDeep(updatedRequest);

  return {
    addressId: raw.addressId,
    globalVouchers: [], 
    shops: _.map(raw.shops, (shop) => {
      const shopPayload: any = {
        shopId: shop.shopId,
        itemIds: shop.itemIds || [],
        serviceCode: Number(shop.serviceCode),
        shippingFee: Number(shop.shippingFee || 0),
      };

      if (Array.isArray(shop.vouchers)) {
        shopPayload.vouchers = shop.vouchers;
      }

      if (Array.isArray(shop.globalVouchers)) {
        shopPayload.globalVouchers = shop.globalVouchers;
      }

      return shopPayload;
    }),
  };
};

export const prepareOrderRequest = (params: any): any => {
  const { preview, request, savedAddresses, customerNote, paymentMethod } =
    params;
  const data = preview?.data || preview;
  const fullAddressData = _.find(savedAddresses, {
    addressId: request.addressId,
  });
  const allSelectedItemIds = _.flatMap(data.shops, (s: any) =>
    _.map(s.items, "itemId")
  );

  return {
    shops: _.map(data.shops, (s) => {
      const shopReq = _.find(request.shops, { shopId: s.shopId });
      const shopGlobalVouchers = _.chain(s.voucherResult?.discountDetails)
        .filter({ voucherType: "PLATFORM", valid: true })
        .map("voucherCode")
        .value();

      return {
        shopId: s.shopId,
        itemIds: _.map(s.items, "itemId"),
        vouchers: shopReq?.vouchers || [],
        serviceCode: Number(
          shopReq?.serviceCode || s.selectedShippingMethod || 400021
        ),
        shippingFee: Number(_.get(s, "summary.shippingFee", 0)),
        globalVouchers: shopGlobalVouchers,
        loyaltyPoints: Number(_.get(shopReq, "loyaltyPoints", 0)),
      };
    }),
    buyerAddressData: {
      addressId: String(request.addressId),
      buyerAddressId: String(request.addressId),
      addressType: Number(_.get(fullAddressData, "addressType", 0)),
      taxAddress: _.get(fullAddressData, "taxAddress", null),
    },
    paymentMethod: paymentMethod || "COD",
    previewId: data.cartId || data.previewId || "",
    previewAt: data.previewAt,
    customerNote: customerNote || "",
    confirmAllSelected: true,
    allSelectedItemIds: allSelectedItemIds,
  };
};
