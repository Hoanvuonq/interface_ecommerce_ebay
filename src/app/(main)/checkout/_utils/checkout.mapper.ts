import _ from "lodash";
import { CheckoutOrderPreviewRequest } from "../_types/checkout.type";


export const preparePreviewCheckoutPayload = (
  req: any,
): CheckoutOrderPreviewRequest => {
  if (!req) return { addressId: "", shops: [] };

  const payload: CheckoutOrderPreviewRequest = {
    addressId: req.addressId || "",
    shippingAddress: {
      addressId: req.addressId || "",
      addressChanged: req.addressChanged ?? true,
      country: req.country || "VN",
    },

    allDiscountCodes: req.allDiscountCodes || [],
    shops: _.map(req.shops, (shop) => {
      const shopData: any = {
        shopId: shop.shopId,
        items: (shop.items || []).map((item: any) => ({
          itemId: item.itemId || item.id,
          quantity: Number(item.quantity || 1),
        })),
        serviceCode: Number(shop.serviceCode ),
      };

      if (!_.isEmpty(shop.vouchers)) {
        shopData.vouchers = shop.vouchers;
      }

      if (!_.isEmpty(shop.globalVouchers)) {
        shopData.globalVouchers = shop.globalVouchers;
      }

      if (shop.internationalServiceCode)
        shopData.internationalServiceCode = Number(
          shop.internationalServiceCode,
        );
      if (shop.firstMileServiceCode)
        shopData.firstMileServiceCode = Number(shop.firstMileServiceCode);

      return shopData;
    }),

    previewAllSelected: req.previewAllSelected ?? true,
    usingSavedAddress: req.usingSavedAddress ?? true,
  };

  return payload;
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

  const allDiscountCodes = _.flatten([
    ..._.map(data.shops, (s: any) =>
      _.map(s.applicableVouchers, "voucherCode"),
    ),
    ..._.map(data.globalVoucherResults, "voucherCode"),
  ]).filter(Boolean);

  return {
    shops: _.map(data.shops, (s) => {
      const shopReq = _.find(request.shops, { shopId: s.shopId });

      return {
        shopId: s.shopId,
        items: _.map(s.items, (item: any) => ({
          itemId: item.itemId,
          quantity: Number(item.quantity || 1),
          expectedUnitPrice: Number(
            item.unitPrice || item.expectedUnitPrice || 0,
          ),
        })),
        vouchers: shopReq?.vouchers || [],
        serviceCode: Number(
          s.serviceCode || s.selectedShippingMethod || 400021,
        ),
        shippingFee: Number(_.get(s, "summary.shippingFee", 0)),
        globalVouchers: shopReq?.globalVouchers || [],
        loyaltyPoints: Number(_.get(shopReq, "loyaltyPoints", 0)),
        itemIds: _.map(s.items, "itemId"),
      };
    }),

    buyerAddressData: {
      buyerAddressId: String(request.addressId),
      addressId: String(request.addressId),
    },

    shippingAddress: {
      addressId: String(request.addressId),
      addressChanged: true,
      country: fullAddressData?.address?.country || "Vietnam",
      taxFee: String(_.get(data, "summary.taxFee", "0")),
    },

    addressId: String(request.addressId),
    loyaltyPoints: Number(data.summary?.totalLoyaltyPoints || 0),
    paymentMethod: paymentMethod || "COD",
    previewAllSelected: true,
    usingSavedAddress: true,
    allDiscountCodes: _.uniq(allDiscountCodes),
    allSelectedItemIds: allSelectedItemIds,
    effectiveAddressId: String(request.addressId),
    customerNote: customerNote || "",
  };
};
