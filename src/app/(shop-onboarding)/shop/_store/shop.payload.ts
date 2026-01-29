/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapShopOnboardingPayload = (
  finalValues: any,
  logoPath: string,
  legalAssetIds: any,
) => {
  const getGeoAddr = (obj: any) => ({
    countryCode: "VN",
    countryName: "Việt Nam",
    provinceCode: obj?.provinceCode || "",
    provinceName: obj?.provinceName || "",
    districtCode: "",
    districtName: "",
    wardCode: obj?.wardCode || "",
    wardName: obj?.wardName || "",
    detail: obj?.addressDetail || obj?.detail || "",
  });

  return {
    shopName: finalValues.shopName,
    description: finalValues.description,
    logoUrl: logoPath,
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
        provinceCode: finalValues.taxProvinceCode || finalValues.provinceCode,
        provinceName: finalValues.taxProvinceName || finalValues.provinceName,
        wardCode: finalValues.taxWardCode || finalValues.wardCode,
        wardName: finalValues.taxWardName || finalValues.wardName,
        addressDetail:
          finalValues.taxAddressDetail || finalValues.addressDetail,
      }),
      email: finalValues.email, // Email tự động get
      taxIdentificationNumber: finalValues.taxId,
    },
    address: {
      // 🟢 FIX TS(2345): Đưa detail lên cấp 1 theo đúng DTO
      fullName: finalValues.pickupAddress?.fullName || "",
      phone: finalValues.pickupAddress?.phone || "",
      detail:
        finalValues.pickupAddress?.addressDetail ||
        finalValues.pickupAddress?.detail ||
        "",
      address: getGeoAddr(finalValues.pickupAddress), // Thông tin địa lý cấp 2
    },
  };
};
