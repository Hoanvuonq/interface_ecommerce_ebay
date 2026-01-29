import _ from "lodash";

export const preparePreviewCheckoutPayload = (updatedRequest: any) => {
  const raw = _.cloneDeep(updatedRequest);

  return {
    addressId: raw.addressId,
    shippingAddress: {
      addressId: raw.addressId,
      addressChanged: true,
      country: raw.country || "VN",
      taxFee: raw.taxFee || "",
    },
    promotion: raw.promotion || [],
    shops: _.map(raw.shops, (shop) => {
      const shopPayload: any = {
        shopId: shop.shopId,
        items: (shop.items || []).map((item: any) => ({
          itemId: item.itemId || item.id,
          quantity: Number(item.quantity || 1),
        })),
        serviceCode: Number(shop.serviceCode || 400031),
        shippingFee: Number(shop.shippingFee || 0),
      };

      // 🟢 Voucher riêng của Shop
      if (shop.vouchers && shop.vouchers.length > 0) {
        shopPayload.vouchers = shop.vouchers;
      }

      // 🟢 Voucher sàn (Platform) áp dụng cho shop này
      if (shop.globalVouchers && shop.globalVouchers.length > 0) {
        shopPayload.globalVouchers = shop.globalVouchers;
      }

      return shopPayload;
    }),
    // 🔴 KHÔNG gửi globalVouchers ở đây nữa
  };
};

export const prepareOrderRequest = (params: any): any => {
  const { preview, request, customerNote, paymentMethod } = params;
  const data = preview?.data || preview;

  return {
    shops: _.map(data.shops, (s) => {
      const shopReq = _.find(request.shops, { shopId: s.shopId });
      return {
        shopId: s.shopId,
        items: _.map(s.items, (item: any) => ({
          itemId: item.itemId,
          expectedUnitPrice: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 1),
        })),
        vouchers: shopReq?.vouchers || [],
        // 🟢 Lấy từ shop level trong request
        globalVouchers: shopReq?.globalVouchers || [],
        serviceCode: Number(shopReq?.serviceCode || s.selectedShippingMethod),
        shippingFee: Number(
          shopReq?.shippingFee || _.get(s, "summary.shippingFee", 0),
        ),
        loyaltyPoints: Number(_.get(shopReq, "loyaltyPoints", 0)),
      };
    }),
    buyerAddressData: { buyerAddressId: String(request.addressId) },
    paymentMethod: paymentMethod || "COD",
    customerNote: customerNote || "",
  };
};
