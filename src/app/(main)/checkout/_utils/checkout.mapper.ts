import _ from "lodash";

export const preparePreviewCheckoutPayload = (req: any): any => {
  if (!req) return { addressId: "", shops: [], promotion: [] };

  return {
    addressId: req.addressId || "",
    shippingAddress: {
      addressId: req.addressId || "",
      addressChanged: true,
      country: "VN",
    },
    promotion: req.promotion || [],
    shops: _.map(req.shops, (shop) => ({
      shopId: shop.shopId,
      items: (shop.items || []).map((item: any) => ({
        itemId: item.itemId || item.id,
        quantity: Number(item.quantity || 1),
      })),
      serviceCode: Number(shop.serviceCode || 400031),
      vouchers: shop.vouchers || [],
      globalVouchers: shop.globalVouchers || [],
    })),
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
    _.map(s.items, "itemId"),
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
        expectedUnitPrice: Number(
          item.unitPrice || item.expectedUnitPrice || 0,
        ),
        // promotionId: item.promotionId || null,
        quantity: Number(
          shopReq?.items?.find((i: any) => i.itemId === item.itemId)
            ?.quantity ||
            item.quantity ||
            1,
        ),
      }));

      return {
        shopId: s.shopId,
        items,
        vouchers: shopReq?.vouchers || [],
        serviceCode: Number(
          shopReq?.serviceCode || s.selectedShippingMethod || 400021,
        ),
        shippingFee: Number(_.get(s, "summary.shippingFee", 0)),
        globalVouchers: shopGlobalVouchers,
        loyaltyPoints: Number(_.get(shopReq, "loyaltyPoints", 0)),
      };
    }),
    buyerAddressData: {
      // addressId: String(request.addressId),
      buyerAddressId: String(request.addressId),
      // addressType: Number(_.get(fullAddressData, "addressType", 0)),
      // taxAddress: _.get(fullAddressData, "taxAddress", null),
    },
    paymentMethod: paymentMethod || "COD",
    // previewId: data.previewId || data.cartId || "",
    // previewAt: data.previewAt,
    customerNote: customerNote || "",
  };
};