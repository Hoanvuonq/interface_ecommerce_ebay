import _ from "lodash";

export const preparePreviewPayload = (
  updatedRequest: any,
  currentPreview?: any
) => {
  const raw = _.cloneDeep(updatedRequest);
  let allGlobalVouchers: string[] = [];
  if (Array.isArray(raw.globalVouchers) && raw.globalVouchers.length > 0) {
    allGlobalVouchers = _.uniq(raw.globalVouchers);
  } else if (Array.isArray(raw.shops)) {
    allGlobalVouchers = _.uniq(
      _.flatMap(raw.shops, (shop) =>
        Array.isArray(shop.globalVouchers) ? shop.globalVouchers : []
      )
    );
  }

  return {
    addressId: raw.addressId,
    shippingAddress: {
      addressId: raw.addressId,
      addressChanged: true,
      country: raw.country || "VN",
      taxFee: raw.taxFee || raw.taxAddress || "",
    },
    globalVouchers: allGlobalVouchers,
    promotion: raw.promotion || [],
    shops: _.map(raw.shops, (shop) => {
      const shopPayload: any = {
        shopId: shop.shopId,
        itemIds: shop.itemIds || [],
        serviceCode: Number(shop.serviceCode),
        shippingFee: Number(shop.shippingFee || 0),
      };

      if (Array.isArray(shop.vouchers) && shop.vouchers.length > 0) {
        shopPayload.vouchers = shop.vouchers;
      }

      if (Array.isArray(shop.globalVouchers) && shop.globalVouchers.length > 0) {
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

      const items = _.map(s.items, (item: any) => ({
        itemId: item.itemId,
        expectedUnitPrice: Number(item.unitPrice || item.expectedUnitPrice || 0),
        promotionId: item.promotionId || null,
      }));

      return {
        shopId: s.shopId,
        items,
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
