/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapShopOnboardingPayload = (
  finalValues: any,
  logoAssetId: string,
  logoUrl: string,
  legalAssetIds: any,
  countryData?: any,
) => {
  const getGeoAddr = (obj: any) => ({
    country: obj?.countryName || "Việt Nam",
    province: obj?.provinceName || "",
    district: obj?.districtName || "",
    ward: obj?.wardName || "",
    detail: obj?.addressDetail || obj?.detail || "",
    zipCode: obj?.zipCode || "10000",
    geoinfo: {
      latitude: obj?.latitude || 1,
      longitude: obj?.longitude || 1,
      userVerified: true,
      userAdjusted: true,
      confirmed: true,
    },
    isInternational: false,
  });

  const payload = {
    shopName: finalValues.shopName,
    description: finalValues.description || "",
    logoAssetId: logoAssetId,
    legalInfo: {
      nationality: finalValues.nationality || "vn",
      identityType: finalValues.idType?.toUpperCase() || "CCCD",
      identityNumber: finalValues.idNumber,
      fullName: finalValues.fullName,
      frontImageAssetId: legalAssetIds.frontImageAssetId,
      backImageAssetId: legalAssetIds.backImageAssetId,
      faceImageAssetId: legalAssetIds.faceImageAssetId,
    },
    taxInfo: {
      type: finalValues.businessType?.toUpperCase() || "PERSONAL",
      registeredAddress: getGeoAddr({
        provinceName: finalValues.taxProvinceName || finalValues.provinceCode,
        districtName: finalValues.taxDistrictName || "",
        wardName: finalValues.taxWardName || "",
        addressDetail: finalValues.taxAddressDetail || "",
      }),
      email: finalValues.email,
      taxIdentificationNumber: finalValues.taxId,
    },
    address: {
      address: getGeoAddr(finalValues.pickupAddress),
      fullName: finalValues.pickupAddress?.fullName || finalValues.fullName,
      phone: finalValues.pickupAddress?.phone || "",
      isDefault: true,
      isDefaultPickup: true,
      isDefaultReturn: true,
    },
  };

  return payload;
};
