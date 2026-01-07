import _ from "lodash";

export const preparePreviewPayload = (
  updatedRequest: any,
  currentPreview?: any
) => {
  const raw = _.cloneDeep(updatedRequest);
  const previewData = currentPreview?.data || currentPreview;

  return {
    addressId: raw.addressId,
    shops: _.map(raw.shops, (shop) => {
      const shopFromPreview = _.find(previewData?.shops, {
        shopId: shop.shopId,
      });

      const availableOptions =
        _.get(shopFromPreview, "availableShippingOptions") ||
        _.get(shopFromPreview, "shipping.services") ||
        [];

      let targetServiceCode = shop.serviceCode || shop.selectedShippingMethod;
      let targetFee = shop.shippingFee || 0;

      const isSelectedValid = _.some(
        availableOptions,
        (o) => Number(o.serviceCode) === Number(targetServiceCode)
      );

      if (!targetServiceCode || !isSelectedValid) {
        if (availableOptions && availableOptions.length > 0) {
          const sortedOptions = _.sortBy(availableOptions, [
            (o) => Number(o.fee),
          ]);
          const cheapestOption = sortedOptions[0];

          if (cheapestOption) {
            targetServiceCode = cheapestOption.serviceCode;
            targetFee = cheapestOption.fee;
          }
        } else {
          targetServiceCode = 400021;
        }
      } else {
        const selectedOption = _.find(
          availableOptions,
          (o) => Number(o.serviceCode) === Number(targetServiceCode)
        );
        if (selectedOption) {
          targetFee = selectedOption.fee;
        }
      }

      return {
        shopId: shop.shopId,
        itemIds: shop.itemIds || _.map(shop.items, "itemId"),
        serviceCode: Number(targetServiceCode),
        shippingFee: Number(targetFee),
      };
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

    loyaltyPoints: 0,
    paymentMethod: paymentMethod || "COD",
    previewId: data.cartId || data.previewId || "",
    previewAt: data.previewAt,
    customerNote: customerNote || "",
    confirmAllSelected: true,
    allSelectedItemIds: allSelectedItemIds,
  };
};
