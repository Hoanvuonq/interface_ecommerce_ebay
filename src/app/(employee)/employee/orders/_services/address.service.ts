import { requestAddress } from "../_utils/axios.customize.address";
import {
  MOCK_COUNTRIES,
  getMockStatesByCountry,
  getMockCitiesByState,
} from "./address.mock";

const USE_MOCK_DATA =
  typeof window !== "undefined" &&
  (localStorage.getItem("USE_ADDRESS_MOCK") === "true" ||
    process.env.NEXT_PUBLIC_USE_ADDRESS_MOCK === "true");

export const getCountries = async () => {
  if (USE_MOCK_DATA) {
    return MOCK_COUNTRIES;
  }

  try {
    const res = await requestAddress.get("/countries/positions");
    return res.data?.data || []; // trả về array
  } catch (error) {
    console.warn("⚠️ [ADDRESS API] Failed to fetch countries, using mock data:", error);
    return MOCK_COUNTRIES;
  }
};

// 🏙️ Lấy danh sách tỉnh/thành theo quốc gia
export const getStatesByCountry = async (country: string) => {
  if (USE_MOCK_DATA) {
    console.log("📍 [MOCK] Using mock states for country:", country);
    return getMockStatesByCountry(country);
  }

  try {
    const res = await requestAddress.post("/countries/states", { country });
    return res.data?.data?.states || [];
  } catch (error) {
    console.warn("⚠️ [ADDRESS API] Failed to fetch states, using mock data:", error);
    return getMockStatesByCountry(country);
  }
};

// 🏘️ Lấy danh sách thành phố/quận huyện theo tỉnh
export const getCitiesByState = async (country: string, state: string) => {
  // Nếu bật mock mode, trả về mock data
  if (USE_MOCK_DATA) {
    console.log("📍 [MOCK] Using mock cities for:", country, state);
    return getMockCitiesByState(country, state);
  }

  try {
    const res = await requestAddress.post("/countries/state/cities", {
      country,
      state,
    });
    return res.data?.data || [];
  } catch (error) {
    console.warn("⚠️ [ADDRESS API] Failed to fetch cities, using mock data:", error);
    return getMockCitiesByState(country, state);
  }
};

