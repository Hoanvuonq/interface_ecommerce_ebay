export const mapShopOnboardingPayload = (
  finalValues: any,
  logoPath: string,
  legalAssetIds: any,
) => {
  const getAddr = (obj: any) => ({
    countryCode: obj?.countryCode || "VN",
    countryName: obj?.countryName || obj?.country || "Việt Nam",
    provinceCode: obj?.provinceCode || "",
    provinceName: obj?.provinceName || obj?.province || "",
    districtCode: obj?.districtCode || "",
    districtName: obj?.districtName || obj?.district || "",
    wardCode: obj?.wardCode || "",
    wardName: obj?.wardName || obj?.ward || "",
    detail: obj?.addressDetail || obj?.detail || "",
  });

  return {
    shopName: finalValues.shopName,
    description: finalValues.description,
    logoUrl: logoPath,
    legalInfo: {
      nationality: finalValues.nationality || "Vietnam",
      identityType: finalValues.idType?.toUpperCase(),
      identityNumber: finalValues.idNumber,
      fullName: finalValues.fullName,
      frontImageAssetId: legalAssetIds.frontImageAssetId,
      backImageAssetId: legalAssetIds.backImageAssetId,
      faceImageAssetId: legalAssetIds.faceImageAssetId,
    },
    taxInfo: {
      type: finalValues.businessType?.toUpperCase(),
      registeredAddress: {
        countryCode: "VN",
        countryName: "Việt Nam",
        provinceCode: finalValues.taxProvinceCode,
        provinceName: finalValues.taxProvinceName,
        districtCode: "",
        districtName: "",
        wardCode: finalValues.taxWardCode,
        wardName: finalValues.taxWardName,
        detail: finalValues.taxAddressDetail,
      },
      email: finalValues.billingEmail || finalValues.email,
      taxIdentificationNumber: finalValues.taxId,
    },
    address: {
      address: getAddr(finalValues.pickupAddress),
      detail: finalValues.pickupAddress?.addressDetail || "",
      fullName: finalValues.pickupAddress?.fullName || "",
      phone: finalValues.pickupAddress?.phone || "",
      isDefault: true,
      isDefaultPickup: true,
      isDefaultReturn: true,
    },
  };
};
